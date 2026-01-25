using Microsoft.AspNetCore.Mvc;

namespace VelvetSkinClinic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConnexionController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ConnexionController> _logger;

        public ConnexionController(ILogger<ConnexionController> logger)
        {
            _logger = logger;
        }
        [ApiController]
        [Route("api/test")]
        public class TestController : ControllerBase
        {
            [HttpGet]
            public IActionResult Get()
            {
                return Ok("Backend works");
            }
        }
    }
}
