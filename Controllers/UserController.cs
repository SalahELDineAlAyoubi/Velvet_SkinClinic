using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VelvetSkinClinic.helpersModels.Enums;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Controllers
{
     [Route("api/[controller]")]
    public class UsersController : PrivateController 
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

         [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        //[HttpPost]
        //[Authorize] // must be authenticated
        //public async Task<IActionResult> CreateUser([FromBody] CreateUserRM model)
        //{
        //    try
        //    {
        //        // ── Role check ──────────────────────────────────────────────────
        //        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        //        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var callerRole) ||
        //            (callerRole != UserRoleEnum.Admin && callerRole != UserRoleEnum.Owner))
        //        {
        //            return Forbid(); // 403 – not Admin or Owner
        //        }

        //        // ── Only Owner can create another Admin or Owner ─────────────────
        //        if (model.UserRole >= (int)UserRoleEnum.Admin && callerRole != UserRoleEnum.Owner)
        //            return StatusCode(403, new { message = "Only an Owner can create Admin or Owner accounts." });

        //        // ── Create ───────────────────────────────────────────────────────
        //        var result = await _userService.CreateUserAsync(model);
        //        return CreatedAtAction(nameof(GetUserById), new { id = result.UserId }, result);
        //    }
        //    catch (InvalidOperationException ex)
        //    {
        //        return Conflict(new { message = ex.Message }); // 409 – login taken
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}


        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRM createUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);


                var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var callerRole) ||
                    (callerRole != UserRoleEnum.Admin && callerRole != UserRoleEnum.Owner))
                {
                    return Forbid(); // 403 – not Admin or Owner
                }

                // ── Only Owner can create another Admin or Owner ─────────────────
                if (createUserDto.UserRole >= (int)UserRoleEnum.Admin && callerRole != UserRoleEnum.Owner)
                    return StatusCode(403, new { message = "Only an Owner can create Admin or Owner accounts." });

                var user = await _userService.CreateUserAsync(createUserDto);

                return CreatedAtAction(
                    nameof(GetUserById),
                    new { id = user.Id },
                    user
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        // PUT: api/users/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRM request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var callerRole) ||
                    (callerRole != UserRoleEnum.Admin && callerRole != UserRoleEnum.Owner))
                {
                    return StatusCode(403, new { message = "Only Admin or Owner can change passwords." });
                }

                await _userService.ChangePasswordAsync(request);
                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // GET: api/users/check-login/john123
        [HttpGet("check-login/{loginCustom}")]
        public async Task<IActionResult> CheckLoginExists(string loginCustom)
        {
            try
            {
                var exists = await _userService.LoginExistsAsync(loginCustom);
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
