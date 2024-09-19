using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using FinalProjectApi.Models;
using FinalProjectApi.Services;
namespace FinalProjectApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ModeratorController : Controller
{
    private readonly ModeratorService service;
    private readonly ReportService _reportService;

    public ModeratorController(ModeratorService _service, ReportService reportService)
    {
        service = _service;
        _reportService = reportService;
    }

    //  [Authorize]
    [HttpGet]
    public ActionResult<List<Moderator>> GetModerators()
    {
        return service.GetModerators();
    }

    [HttpGet("{id:length(24)}")]

    public ActionResult<Moderator> GetModerator(string id)
    {
        var user = service.GetModerator(id);

        if (user == null)
        {
            return NotFound(); // 404 Not Found
        }

        return Json(user);
    }

    [HttpPost]
    public ActionResult<Moderator> Create(Moderator user)
    {
        string password = user.Password;

        service.Create(user);
        var token = service.Authenticate(user.Email, password);



        return Ok(new { token, user });

        // return Json(user);
    }

    [AllowAnonymous]
    [Route("authenticate")]
    [HttpPost]

    public ActionResult Login(string email, string password)
    {

         var user1 = service.GetModeratorByEmail(email);

    if (user1 == null)
    {
        return NotFound("User has not applied.");
    }

    if (!user1.IsApproved)
    {
        return Unauthorized("User is not approved.");
    }

    var token = service.Authenticate(email, password);

    if (token == null)
    {
        return Unauthorized("Invalid email or password.");
    }

    return Ok(new { token, user1 });
    }

    [HttpGet("approved")]
    public ActionResult<List<Moderator>> GetOnlyApprovedModerators()
    {
        return service.GetOnlyApprovedModerators();
    }

    [HttpDelete("{id:length(24)}")]
    public IActionResult DeleteModerator(string id)
    {
        var result = service.DeleteModerator(id);

        if (result == null)
        {
            return NotFound(); // 404 Not Found
        }

        return NoContent(); // 204 No Content
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult UpdateModerator(string id, Moderator updatedModerator)
    {
        var result = service.UpdateModerator(id, updatedModerator);

        if (result == null)
        {
            return NotFound(); // 404 Not Found
        }

        return NoContent(); // 204 No Content
    }

    [HttpPatch("{id:length(24)}/approve")]
    public IActionResult UpdateModeratorIsApprovedValue(string id, bool isApproved)
    {
        var result = service.UpdateModeratorIsApprovedValue(id, isApproved);

        if (result == null)
        {
            return NotFound(); // 404 Not Found
        }

        return NoContent(); // 204 No Content
    }



        [HttpPost("distribute")]
        public async Task<IActionResult> DistributeReports()
        {
            var moderators = service.GetOnlyApprovedModerators();
            var uncheckedReports = await _reportService.GetUnassignedReportsAsync();

            if (!moderators.Any() || !uncheckedReports.Any())
            {
                return BadRequest("No moderators or unchecked reports available.");
            }
            
            
            int reportsPerModerator = uncheckedReports.Count / moderators.Count;
            int extraReports = uncheckedReports.Count % moderators.Count;

            int index = 0;
            foreach (var moderator in moderators)
            {
                int count = reportsPerModerator + (index < extraReports ? 1 : 0);
                var reportsForModerator = uncheckedReports.Skip(index * reportsPerModerator).Take(count).ToList();

                foreach (var report in reportsForModerator)
                {
                    report.ModeratedBy = moderator.Id;
                    await _reportService.UpdateAsync(report);
                }

                index++;
            }

            return Ok();
        }

}