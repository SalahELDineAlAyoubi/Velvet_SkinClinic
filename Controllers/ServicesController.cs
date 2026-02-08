using Microsoft.AspNetCore.Mvc;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Controllers
{
     [Route("api/[controller]")]
    public class ServicesController : PrivateController 
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

         [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var services = await _serviceService.GetAllServicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب الخدمات" });
            }
        }

         [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            try
            {
                var services = await _serviceService.SearchServicesAsync(term);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء البحث" });
            }
        }

         [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var service = await _serviceService.GetServiceByIdAsync(id);
                return Ok(service);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "الخدمة غير موجودة" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب الخدمة" });
            }
        }

         [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateServiceRM createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var service = await _serviceService.CreateServiceAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
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

         [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceRM updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var service = await _serviceService.UpdateServiceAsync(id, updateDto);
                return Ok(service);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "الخدمة غير موجودة" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث الخدمة" });
            }
        }

         [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _serviceService.DeleteServiceAsync(id);

                if (!result)
                    return NotFound(new { message = "الخدمة غير موجودة" }); 

                return Ok(new { message = "تم حذف الخدمة بنجاح" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف الخدمة" });
            }
        }
    }
}