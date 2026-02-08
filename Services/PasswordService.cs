using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Services
{
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReportService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<MonthlyReportDto> GetMonthlyReportAsync(int year, int month)
        {
            var payments = await _unitOfWork.PaymentsRepository.GetPaymentsByMonthAsync(year, month);

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var monthName = GetArabicMonthName(month);
            var period = $"{monthName} {year}";

            return GenerateReport(payments, period, startDate, endDate);
        }

        public async Task<MonthlyReportDto> GetDateRangeReportAsync(DateTime startDate, DateTime endDate)
        {
            var payments = await _unitOfWork.PaymentsRepository.GetPaymentsByDateRangeAsync(startDate, endDate);

            var period = $"من {startDate:dd/MM/yyyy} إلى {endDate:dd/MM/yyyy}";

            return GenerateReport(payments, period, startDate, endDate);
        }

        public async Task<MonthlyReportDto> GetAllPaymentsReportAsync()
        {
            var payments = await _unitOfWork.PaymentsRepository.GetAllPaymentsWithClientsAsync();

            return GenerateReport(payments, "جميع الفترات", null, null);
        }

        private MonthlyReportDto GenerateReport(
            IEnumerable<Payment> payments,
            string period,
            DateTime? startDate,
            DateTime? endDate)
        {
            var paymentsList = payments.ToList();
            var uniqueClientIds = paymentsList.Select(p => p.ClientId).Distinct().Count();

            return new MonthlyReportDto
            {
                Period = period,
                StartDate = startDate,
                EndDate = endDate,
                TotalAmount = paymentsList.Sum(p => p.Amount),
                TotalPayments = paymentsList.Count,
                UniqueClients = uniqueClientIds,
                Payments = paymentsList.Select(MapToPaymentReportDto).ToList()
            };
        }

        private PaymentReportDto MapToPaymentReportDto(Payment payment)
        {
            return new PaymentReportDto
            {
                Id = payment.Id,
                ClientId = payment.ClientId,
                ClientName = payment.Client.Name,
                ClientIdentifier = payment.Client.ClientIdentifier,
                PaymentNumber = payment.PaymentNumber,
                Amount = payment.Amount,
                Date = payment.PaymentDate.ToString("yyyy-MM-dd")
            };
        }

        private string GetArabicMonthName(int month)
        {
            var monthNames = new[]
            {
                "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
            };

            return month >= 1 && month <= 12 ? monthNames[month - 1] : "";
        }
    }
}