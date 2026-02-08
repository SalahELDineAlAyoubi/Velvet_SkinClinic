using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController  : ControllerBase
    {

         private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRM login )
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var response = await _authService.LoginAsync(login);

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

         [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                if (string.IsNullOrEmpty(refreshTokenDto.RefreshToken))
                    return BadRequest(new { message = "Refresh token is required" });

                var response = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<IActionResult> RevokeToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                var result = await _authService.RevokeTokenAsync(refreshTokenDto.RefreshToken);

                if (!result)
                    return NotFound(new { message = "Token not found" });

                return Ok(new { message = "Token revoked successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

         [HttpGet("validate")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            var loginCustom = User.Claims.FirstOrDefault(c => c.Type == "loginCustom")?.Value;

            return Ok(new
            {
                valid = true,
                userId,
                loginCustom
            });
        }

    }
}
