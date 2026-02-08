using Microsoft.AspNetCore.Mvc;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Controllers
{
     [Route("api/[controller]")]
    public class ReportsController : PrivateController 
    {
        private readonly IReportService _reportService;
        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }
        // GET: api/reports/monthly?year=2026&month=2
        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                if (year < 2000 || year > 2100)
                    return BadRequest(new { message = "السنة غير صحيحة" });

                if (month < 1 || month > 12)
                    return BadRequest(new { message = "الشهر غير صحيح" });

                var report = await _reportService.GetMonthlyReportAsync(year, month);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء التقرير" });
            }
        }

        // GET: api/reports/date-range?startDate=2026-01-01&endDate=2026-01-31
        [HttpGet("date-range")]
        public async Task<IActionResult> GetDateRangeReport(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                    return BadRequest(new { message = "تاريخ البداية يجب أن يكون قبل تاريخ النهاية" });

                var report = await _reportService.GetDateRangeReportAsync(startDate, endDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء التقرير" });
            }
        }

        // GET: api/reports/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPaymentsReport()
        {
            try
            {
                var report = await _reportService.GetAllPaymentsReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء التقرير" });
            }
        }

        // POST: api/reports/custom
        [HttpPost("custom")]
        public async Task<IActionResult> GetCustomReport([FromBody] MonthlyReportRequestDto request)
        {
            try
            {
                MonthlyReportDto report;

                if (request.Year.HasValue && request.Month.HasValue)
                {
                    report = await _reportService.GetMonthlyReportAsync(
                        request.Year.Value,
                        request.Month.Value);
                }
                else if (request.StartDate.HasValue && request.EndDate.HasValue)
                {
                    report = await _reportService.GetDateRangeReportAsync(
                        request.StartDate.Value,
                        request.EndDate.Value);
                }
                else
                {
                    report = await _reportService.GetAllPaymentsReportAsync();
                }

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء التقرير" });
            }
        }
    }
}