using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VelvetSkinClinic.Repositories.UnitOfWork;

namespace VelvetSkinClinic.Controllers
{
    [ApiController]
   [Authorize]
    public class PrivateController : ControllerBase
    {
         public PrivateController()
        {
         }
    }
}
