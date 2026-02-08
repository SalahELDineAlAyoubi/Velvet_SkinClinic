using Microsoft.AspNetCore.Mvc;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Controllers
{
     [Route("api/[controller]")]
    public class ClientsController : PrivateController 
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }


        // GET: api/clients/list
        [HttpGet("list")]
        public async Task<IActionResult> GetAllList()
        {
            try
            {
                var clients = await _clientService.GetAllClientsListAsync();
                return Ok(clients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب العملاء" });
            }
        }
        // GET: api/clients/search?term=ahmad
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            try
            {
                var clients = await _clientService.SearchClientsAsync(term ?? "");
                return Ok(clients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء البحث" });
            }
        }

        // POST: api/clients/minimal
        [HttpPost("minimal")]
        public async Task<IActionResult> CreateMinimal([FromBody] CreateClientMinimalRM createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var client = await _clientService.CreateClientMinimalAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إضافة العميل" });
            }
        }
        // GET: api/clients
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var clients = await _clientService.GetAllClientsAsync();
                return Ok(clients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب العملاء" });
            }
        }

        // GET: api/clients/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var client = await _clientService.GetClientByIdAsync(id);
                return Ok(client);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "العميل غير موجود" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب العميل" });
            }
        }

        // GET: api/clients/by-identifier/123
        [HttpGet("by-identifier/{clientIdentifier}")]
        public async Task<IActionResult> GetByIdentifier(string clientIdentifier)
        {
            try
            {
                var client = await _clientService.GetClientByIdentifierAsync(clientIdentifier);
                return Ok(client);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "العميل غير موجود" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب العميل" });
            }
        }

        // POST: api/clients
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientRM createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var client = await _clientService.CreateClientAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إضافة العميل" });
            }
        }

        // PUT: api/clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientRM updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var client = await _clientService.UpdateClientAsync(id, updateDto);
                return Ok(client);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "العميل غير موجود" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث العميل" });
            }
        }

        // PUT: api/clients/5/total-required
        [HttpPut("{id}/total-required")]
        public async Task<IActionResult> UpdateTotalRequired(int id, [FromBody] UpdateClientTotalRequiredRM updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var client = await _clientService.UpdateClientTotalRequiredAsync(id, updateDto);
                return Ok(client);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "العميل غير موجود" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث المبلغ المطلوب" });
            }
        }

        // DELETE: api/clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _clientService.DeleteClientAsync(id);

                if (!result)
                    return NotFound(new { message = "العميل غير موجود" });

                return Ok(new { message = "تم حذف العميل بنجاح" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف العميل" });
            }
        }

        // POST: api/clients/5/services/3
        [HttpPost("{clientId}/services/{serviceId}")]
        public async Task<IActionResult> AddService(int clientId, int serviceId)
        {
            try
            {
                var client = await _clientService.AddServiceToClientAsync(clientId, serviceId);
                return Ok(client);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إضافة الخدمة" });
            }
        }

        // DELETE: api/clients/5/services/3
        [HttpDelete("{clientId}/services/{serviceId}")]
        public async Task<IActionResult> RemoveService(int clientId, int serviceId)
        {
            try
            {
                var client = await _clientService.RemoveServiceFromClientAsync(clientId, serviceId);
                return Ok(client);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف الخدمة" });
            }
        }

        // POST: api/clients/5/payments
        [HttpPost("{clientId}/payments")]
        public async Task<IActionResult> AddPayment(int clientId, [FromBody] CreatePaymentRM  createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var payment = await _clientService.AddPaymentAsync(clientId, createDto);
                return Ok(payment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "العميل غير موجود" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إضافة الدفعة" });
            }
        }

        // PUT: api/clients/5/payments/2
        [HttpPut("{clientId}/payments/{paymentNumber}")]
        public async Task<IActionResult> UpdatePayment(int clientId, int paymentNumber, [FromBody] UpdatePaymentRM updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var payment = await _clientService.UpdatePaymentAsync(clientId, paymentNumber, updateDto);
                return Ok(payment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "الدفعة غير موجودة" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث الدفعة" });
            }
        }

        // DELETE: api/clients/5/payments/2
        [HttpDelete("{clientId}/payments/{paymentNumber}")]
        public async Task<IActionResult> DeletePayment(int clientId, int paymentNumber)
        {
            try
            {
                var result = await _clientService.DeletePaymentAsync(clientId, paymentNumber);

                if (!result)
                    return NotFound(new { message = "الدفعة غير موجودة" });

                return Ok(new { message = "تم حذف الدفعة بنجاح" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف الدفعة" });
            }
        }


        // GET: api/clients/birthdays/upcoming?days=10
        [HttpGet("birthdays/upcoming")]
        public async Task<IActionResult> GetUpcomingBirthdays([FromQuery] int days = 10)
        {
            try
            {
                if (days < 1 || days > 365)
                    return BadRequest(new { message = "عدد الأيام يجب أن يكون بين 1 و 365" });

                var birthdays = await _clientService.GetUpcomingBirthdaysAsync(days);
                return Ok(birthdays);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب أعياد الميلاد" });
            }
        }
    }
}