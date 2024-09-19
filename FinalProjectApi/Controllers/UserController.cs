using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using FinalProjectApi.Models;
using FinalProjectApi.Services;
namespace FinalProjectApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController: Controller
{
   private readonly UserService service;

   public UserController(UserService _service)
   {
    service = _service;
   }
   
  //  [Authorize]
   [HttpGet]
   public ActionResult<List<User>> GetUsers()
   {
    return service.GetUsers();
   }

   [HttpGet("{id:length(24)}")]

   public ActionResult<User> GetUser(string id)
   {
    var user = service.GetUser(id);

    if (user == null)
        {
            return NotFound(); // 404 Not Found
        }

    return Json(user);
   }

   [HttpPost]
   public ActionResult<User> Create(User user)
   {
    string password = user.Password;
    
    service.Create(user);
    var token = service.Authenticate(user.Email,password);

      

    return Ok(new {token, user});

    // return Json(user);
   }

   [AllowAnonymous]
   [Route("authenticate")]
   [HttpPost]

   public ActionResult Login(string email,string password)
   {

      var token = service.Authenticate(email,password);
      
      if (token == null)
        return Unauthorized();
      
      var user1 = service.GetUserByEmail(email);
      return Ok(new {token, user1});
   }

    [HttpPut("{id:length(24)}")]
   public async Task<IActionResult> UpdateUser(string id, User updatedUser)
   {
       var user = service.GetUser(id);

       if (user == null)
       {
           return NotFound(); // 404 Not Found
       }

       updatedUser.Id = id; // Ensure the user ID is retained
       await service.UpdateAsync(id, updatedUser);

       return NoContent(); // 204 No Content
   }

   [HttpDelete("{id:length(24)}")]
   public async Task<IActionResult> DeleteUser(string id)
   {
       var user = service.GetUser(id);

       if (user == null)
       {
           return NotFound(); // 404 Not Found
       }

       await service.DeleteAsync(id);

       return NoContent(); // 204 No Content
   }
}