using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using VelvetSkinClinic.helpersModels;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Services
{
    public class ClientService : IClientService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ClientService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ClientDto> GetClientByIdAsync(int id)
        {
            var client = await _unitOfWork.ClientsRepository.GetClientWithDetailsAsync(id);

            if (client == null)
                throw new KeyNotFoundException("العميل غير موجود");

            return MapToDto(client);
        }

        public async Task<ClientDto> GetClientByIdentifierAsync(string clientIdentifier)
        {
            var client = await _unitOfWork.ClientsRepository.GetClientByIdentifierAsync(clientIdentifier);

            if (client == null)
                throw new KeyNotFoundException("العميل غير موجود");

            return MapToDto(client);
        }

        public async Task<IEnumerable<ClientDto>> GetAllClientsAsync()
        {
            var clients = await _unitOfWork.ClientsRepository.GetActiveClientsAsync();
            return clients.Select(MapToDto);
        }

        public async Task<ClientDto> CreateClientAsync(CreateClientRM createDto)
        {
            // Check if client identifier already exists
            if (await _unitOfWork.ClientsRepository.ClientIdentifierExistsAsync(createDto.ClientIdentifier))
                throw new InvalidOperationException("رقم الهوية موجود مسبقاً");

            var client = new Client
            {
                ClientIdentifier = createDto.ClientIdentifier.Trim(),
                Name = createDto.Name.Trim(),
                Phone = createDto.Phone.Trim(),
                Birthday = createDto.Birthday?.Trim(),
                Diseases = createDto.Diseases?.Trim(),
                Notes = createDto.Notes?.Trim(),
                TotalRequired = createDto.TotalRequired,
                TotalPaid = 0,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.ClientsRepository.AddAsync(client);
            await _unitOfWork.CompleteAsync();

            // Add services
            if (createDto.ServiceIds != null && createDto.ServiceIds.Any())
            {
                foreach (var serviceId in createDto.ServiceIds)
                {
                    var service = await _unitOfWork.ServicesRepository.GetByIdAsync(serviceId);
                    if (service != null && service.IsActive)
                    {
                        var clientService = new Models.ClientService
                        {
                            ClientId = client.Id,
                            ServiceId = serviceId,
                            CreatedDate = DateTime.Now
                        };
                        client.ClientServices.Add(clientService);
                    }
                }
                await _unitOfWork.CompleteAsync();
            }

            return await GetClientByIdAsync(client.Id);
        }

        public async Task<ClientDto> UpdateClientAsync(int id, UpdateClientRM updateDto)
        {
            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(id);

            if (client == null || !client.IsActive)
                throw new KeyNotFoundException("العميل غير موجود");

            client.Name = updateDto.Name.Trim();
            client.Phone = updateDto.Phone.Trim();
            client.Birthday = updateDto.Birthday?.Trim();
            client.Diseases = updateDto.Diseases?.Trim();
            client.Notes = updateDto.Notes?.Trim();
            client.UpdatedDate = DateTime.Now;

            _unitOfWork.ClientsRepository.Update(client);
            await _unitOfWork.CompleteAsync();

            return await GetClientByIdAsync(id);
        }

        public async Task<ClientDto> UpdateClientTotalRequiredAsync(int id, UpdateClientTotalRequiredRM updateDto)
        {
            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(id);

            if (client == null || !client.IsActive)
                throw new KeyNotFoundException("العميل غير موجود");

            client.TotalRequired = updateDto.TotalRequired;
            client.UpdatedDate = DateTime.Now;

            _unitOfWork.ClientsRepository.Update(client);
            await _unitOfWork.CompleteAsync();

            return await GetClientByIdAsync(id);
        }

        public async Task<bool> DeleteClientAsync(int id)
        {
            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(id);

            if (client == null)
                return false;

            // Soft delete
            client.IsActive = false;
            client.UpdatedDate = DateTime.Now;

            _unitOfWork.ClientsRepository.Update(client);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<ClientDto> AddServiceToClientAsync(int clientId, int serviceId)
        {
            var client = await _unitOfWork.ClientsRepository.GetClientWithDetailsAsync(clientId);
            if (client == null)
                throw new KeyNotFoundException("العميل غير موجود");

            var service = await _unitOfWork.ServicesRepository.GetByIdAsync(serviceId);
            if (service == null || !service.IsActive)
                throw new KeyNotFoundException("الخدمة غير موجودة");

            // Check if already exists
            if (client.ClientServices.Any(cs => cs.ServiceId == serviceId))
                throw new InvalidOperationException("الخدمة موجودة بالفعل");

            var clientService = new Models.ClientService
            {
                ClientId = clientId,
                ServiceId = serviceId,
                CreatedDate = DateTime.Now
            };

            client.ClientServices.Add(clientService);
            await _unitOfWork.CompleteAsync();

            return await GetClientByIdAsync(clientId);
        }

        public async Task<ClientDto> RemoveServiceFromClientAsync(int clientId, int serviceId)
        {
            var client = await _unitOfWork.ClientsRepository.GetClientWithDetailsAsync(clientId);
            if (client == null)
                throw new KeyNotFoundException("العميل غير موجود");

            var clientService = client.ClientServices.FirstOrDefault(cs => cs.ServiceId == serviceId);
            if (clientService == null)
                throw new KeyNotFoundException("الخدمة غير مرتبطة بالعميل");

            client.ClientServices.Remove(clientService);
            await _unitOfWork.CompleteAsync();

            return await GetClientByIdAsync(clientId);
        }

        public async Task<PaymentDto> AddPaymentAsync(int clientId, CreatePaymentRM createDto)
        {
            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(clientId);
            if (client == null || !client.IsActive)
                throw new KeyNotFoundException("العميل غير موجود");

            var paymentNumber = await _unitOfWork.PaymentsRepository.GetNextPaymentNumberAsync(clientId);

            var payment = new Payment
            {
                ClientId = clientId,
                PaymentNumber = paymentNumber,
                Amount = createDto.Amount,
                PaymentDate = DateOnly.FromDateTime(DateTime.Now),
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.PaymentsRepository.AddAsync(payment);

            // Update client total paid
            client.TotalPaid += createDto.Amount;
            client.UpdatedDate = DateTime.Now;
            _unitOfWork.ClientsRepository.Update(client);

            await _unitOfWork.CompleteAsync();

            return MapPaymentToDto(payment);
        }

        public async Task<PaymentDto> UpdatePaymentAsync(int clientId, int paymentNumber, UpdatePaymentRM updateDto)
        {
            var payment = await _unitOfWork.PaymentsRepository.GetClientPaymentAsync(clientId, paymentNumber);
            if (payment == null)
                throw new KeyNotFoundException("الدفعة غير موجودة");

            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(clientId);
            if (client == null)
                throw new KeyNotFoundException("العميل غير موجود");

            // Update client total paid
            var oldAmount = payment.Amount;
            client.TotalPaid = client.TotalPaid - oldAmount + updateDto.Amount;

            payment.Amount = updateDto.Amount;
            payment.PaymentDate =  DateOnly.FromDateTime(DateTime.Parse(updateDto.Date));
            payment.UpdatedDate = DateTime.Now;

            _unitOfWork.PaymentsRepository.Update(payment);
            _unitOfWork.ClientsRepository.Update(client);
            await _unitOfWork.CompleteAsync();

            return MapPaymentToDto(payment);
        }

        public async Task<bool> DeletePaymentAsync(int clientId, int paymentNumber)
        {
            var payment = await _unitOfWork.PaymentsRepository.GetClientPaymentAsync(clientId, paymentNumber);
            if (payment == null)
                return false;

            var client = await _unitOfWork.ClientsRepository.GetByIdAsync(clientId);
            if (client != null)
            {
                client.TotalPaid -= payment.Amount;
                client.UpdatedDate = DateTime.Now;
                _unitOfWork.ClientsRepository.Update(client);
            }

            _unitOfWork.PaymentsRepository.Delete(payment);
            await _unitOfWork.CompleteAsync();

            // Renumber payments
            var payments = await _unitOfWork.PaymentsRepository.GetClientPaymentsAsync(clientId);
            var paymentsList = payments.OrderBy(p => p.PaymentNumber).ToList();
            for (int i = 0; i < paymentsList.Count; i++)
            {
                paymentsList[i].PaymentNumber = i + 1;
                _unitOfWork.PaymentsRepository.Update(paymentsList[i]);
            }
            await _unitOfWork.CompleteAsync();

            return true;
        }

        private ClientDto MapToDto(Client client)
        {
            return new ClientDto
            {
                Id = client.Id,
                ClientIdentifier = client.ClientIdentifier,
                Name = client.Name,
                Phone = client.Phone,
                Birthday = client.Birthday,
                Diseases = client.Diseases,
                Notes = client.Notes,
                Services = client.ClientServices
                    .Select(cs => new ServiceDto
                    {
                        Id = cs.Service.Id,
                        Name = cs.Service.Name,
                        Description = cs.Service.Description,
                        Price = cs.Service.Price,
                        SessionsNumber = cs.Service.SessionsNumber
                    })
                    .ToList(),
                TotalRequired = client.TotalRequired,
                TotalPaid = client.TotalPaid,
                Payments = client.Payments
                    .OrderBy(p => p.PaymentNumber)
                    .Select(MapPaymentToDto)
                    .ToList()
            };
        }

        private PaymentDto MapPaymentToDto(Payment payment)
        {
            return new PaymentDto
            {
                Id = payment.Id,
                PaymentNumber = payment.PaymentNumber,
                Amount = payment.Amount,
                Date = payment.PaymentDate.ToString("yyyy-MM-dd")
            };
        }


        // Services/Implementations/ClientService.cs - Add these methods
        public async Task<IEnumerable<ClientListDto>> GetAllClientsListAsync()
        {
            var clients = await _unitOfWork.ClientsRepository.GetActiveClientsAsync();
            return clients.Select(c => new ClientListDto
            {
                Id = c.Id,
                ClientIdentifier = c.ClientIdentifier,
                Name = c.Name,
                Phone = c.Phone
            });
        }

        public async Task<IEnumerable<ClientListDto>> SearchClientsAsync(string searchTerm)
        {
            var clients = await _unitOfWork.ClientsRepository.GetActiveClientsAsync();

            if (string.IsNullOrWhiteSpace(searchTerm))
                return clients.Select(MapToListDto);

            searchTerm = searchTerm.ToLower().Trim();

            return clients
                .Where(c =>
                    c.Name.ToLower().Contains(searchTerm) ||
                    c.Phone.Contains(searchTerm) ||
                    c.ClientIdentifier.Contains(searchTerm))
                .Select(MapToListDto);
        }

        public async Task<ClientDto> CreateClientMinimalAsync(CreateClientMinimalRM createDto)
        {
            // Check if phone already exists
            var existingClients = await _unitOfWork.ClientsRepository.GetActiveClientsAsync();
            var cleanNewPhone = CleanPhone(createDto.Phone);

            if (existingClients.Any(c => CleanPhone(c.Phone) == cleanNewPhone))
                throw new InvalidOperationException("رقم الهاتف مسجل مسبقاً");

            // Generate client identifier (you can customize this logic)
            var clientIdentifier = await GenerateClientIdentifierAsync();

            var client = new Client
            {
                ClientIdentifier = clientIdentifier,
                Name = createDto.Name.Trim(),
                Phone = createDto.Phone.Trim(),
                Birthday = null,
                Diseases = null,
                Notes = null,
                TotalRequired = 0,
                TotalPaid = 0,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.ClientsRepository.AddAsync(client);
            await _unitOfWork.CompleteAsync();

            return await GetClientByIdAsync(client.Id);
        }

        // Helper methods
        private ClientListDto MapToListDto(Client client)
        {
            return new ClientListDto
            {
                Id = client.Id,
                ClientIdentifier = client.ClientIdentifier,
                Name = client.Name,
                Phone = client.Phone
            };
        }

        private string CleanPhone(string phone)
        {
            return phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
        }

        private async Task<string> GenerateClientIdentifierAsync()
        {
             var clients = await _unitOfWork.ClientsRepository.GetAllAsync();
            var maxId = clients.Any() ? clients.Max(c => c.Id) : 0;
            return (maxId + 1).ToString();
        }
        // Services/Implementations/ClientService.cs - Add this method
        public async Task<IEnumerable<BirthdayNotificationDto>> GetUpcomingBirthdaysAsync(int days = 10)
        {
            var clients = await _unitOfWork.ClientsRepository.GetActiveClientsAsync();
            var today = DateTime.Today;
            var upcomingBirthdays = new List<BirthdayNotificationDto>();

            foreach (var client in clients)
            {
                if (string.IsNullOrWhiteSpace(client.Birthday))
                    continue;

                // Parse birthday (DD/MM or DD/MM/YYYY)
                var parts = client.Birthday.Split('/');
                if (parts.Length < 2)
                    continue;

                if (!int.TryParse(parts[0], out int day) || !int.TryParse(parts[1], out int month))
                    continue;

                // Calculate days until next birthday
                var daysUntil = CalculateDaysUntilBirthday(today, day, month);

                // Only include if within the specified days range
                if (daysUntil >= 0 && daysUntil <= days)
                {
                    upcomingBirthdays.Add(new BirthdayNotificationDto
                    {
                        Id = client.Id,
                        ClientIdentifier = client.ClientIdentifier,
                        Name = client.Name,
                        Phone = client.Phone,
                        Birthday = client.Birthday,
                        DaysUntilBirthday = daysUntil,
                        IsToday = daysUntil == 0
                    });
                }
            }

            // Sort by days until birthday (closest first)
            return upcomingBirthdays.OrderBy(b => b.DaysUntilBirthday).ToList();
        }

        private int CalculateDaysUntilBirthday(DateTime today, int birthDay, int birthMonth)
        {
            // Create birthday for this year
            DateTime birthdayThisYear;
            try
            {
                birthdayThisYear = new DateTime(today.Year, birthMonth, birthDay);
            }
            catch
            {
                // Handle invalid dates like Feb 29 in non-leap years
                return -1;
            }

            // If birthday already passed this year, calculate for next year
            if (birthdayThisYear < today)
            {
                try
                {
                    birthdayThisYear = new DateTime(today.Year + 1, birthMonth, birthDay);
                }
                catch
                {
                    return -1;
                }
            }

            return (birthdayThisYear - today).Days;
        }
    }
}