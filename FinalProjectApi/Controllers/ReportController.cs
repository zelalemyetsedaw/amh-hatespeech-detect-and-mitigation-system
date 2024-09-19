using System.Diagnostics.CodeAnalysis;
using FinalProjectApi.Models;
using FinalProjectApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinalProjectApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ReportController : ControllerBase
{
   private readonly ReportService _reportService;

   public ReportController(ReportService reportService) => _reportService = reportService;


   [HttpGet("{id:length(24)}")]
   public async Task<IActionResult> Get(string id)
   {
      var existingDriver = await _reportService.GetAsync(id);

      if (existingDriver is null) return NotFound();

      return Ok(existingDriver);
   }

   [HttpGet("post/{UserId:length(24)}")]
   public async Task<IActionResult> GetByUserId(string UserId)
   {
      var existingDriver = await _reportService.GetByUserIdAsync(UserId);
      Console.WriteLine(existingDriver.Count);
      if (existingDriver is null) return NotFound();

      return Ok(existingDriver);
   }


   [HttpGet]
   public async Task<IActionResult> Get()
   {
      var allDrivers = await _reportService.GetAsync();
      if (allDrivers.Any())
         return Ok(allDrivers);

      return NotFound();
   }

   [HttpPost]
   public async Task<IActionResult> Post(Report post)
   {
      await _reportService.CreateAsync(post);
      return CreatedAtAction(nameof(Get), new { id = post.Id }, post);

   }

   [HttpPut("{id:length(24)}")]
   public async Task<IActionResult> Update(string id, Report post)
   {
      var existingDriver = await _reportService.GetAsync(id);

      if (existingDriver is null)
         return BadRequest();

      post.Id = existingDriver.Id;

      await _reportService.UpdateAsync(post);
      return NoContent();
   }

   [HttpDelete("{id:length(24)}")]
   public async Task<IActionResult> Delete(string id)
   {
      var existingDriver = await _reportService.GetAsync(id);

      if (existingDriver is null)
      {
         return BadRequest();
      }

      await _reportService.RemoveAsync(id);

      return NoContent();
   }

   [HttpPut("{reportId:length(24)}/check")]
   public async Task<IActionResult> CheckReport(string reportId)
   {
      var report = await _reportService.GetAsync(reportId);
      if (report == null) return NotFound("Report not found.");

      report.Checked = true;
      await _reportService.UpdateAsync(report);

      return NoContent();
   }

   [HttpGet("unchecked")]
   public async Task<ActionResult<List<Report>>> GetUncheckedReports()
   {
      var reports = await _reportService.GetUncheckedReportsAsync();
      if (reports == null || reports.Count == 0)
      {
         return NotFound("No unchecked reports found.");
      }

      return Ok(reports);
   }

   [HttpGet("moderator/{moderatorId:length(24)}")]
public async Task<IActionResult> GetByModeratedBy(string moderatorId)
{
    var reports = await _reportService.GetByModeratedByAsync(moderatorId);

    if (reports == null || reports.Count == 0)
    {
        return Ok();
    }

    return Ok(reports);
}

[HttpGet("unassigned")]
public async Task<ActionResult<List<Report>>> GetUnassignedReports()
{
    var reports = await _reportService.GetUnassignedReportsAsync();
    if (reports == null || reports.Count == 0)
    {
        return NotFound("No unassigned reports found.");
    }

    return Ok(reports);
}
}