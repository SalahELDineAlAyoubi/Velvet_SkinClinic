using System.Linq.Expressions;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface IReportService
    {
        Task<MonthlyReportDto> GetMonthlyReportAsync(int year, int month);
        Task<MonthlyReportDto> GetDateRangeReportAsync(DateTime startDate, DateTime endDate);
        Task<MonthlyReportDto> GetAllPaymentsReportAsync();
    }
}
