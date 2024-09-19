using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using FinalProjectApi.Services;

namespace FinalProjectApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly StatisticsService _statisticsService;

        public StatisticsController(StatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("totalposts")]
        public async Task<IActionResult> GetTotalPosts()
        {
            var totalPosts = await _statisticsService.GetTotalPostsAsync();
            return Ok(totalPosts);
        }

        [HttpGet("totalhatespoken")]
        public async Task<IActionResult> GetTotalHateSpoken()
        {
            var totalHateSpoken = await _statisticsService.GetTotalHateSpokenAsync();
            return Ok(totalHateSpoken);
        }

        [HttpGet("totalhatespokenlastmonth")]
        public async Task<IActionResult> GetTotalHateSpokenLastMonth()
        {
            var totalHateSpokenLastMonth = await _statisticsService.GetTotalHateSpokenLastMonthAsync();
            return Ok(totalHateSpokenLastMonth);
        }

        [HttpGet("totalhatespokenlastweek")]
        public async Task<IActionResult> GetTotalHateSpokenLastWeek()
        {
            var totalHateSpokenLastWeek = await _statisticsService.GetTotalHateSpokenLastWeekAsync();
            return Ok(totalHateSpokenLastWeek);
        }

        [HttpGet("totalusers")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var totalUsers = await _statisticsService.GetTotalUsersAsync();
            return Ok(totalUsers);
        }

        [HttpGet("totalusersbanned")]
        public async Task<IActionResult> GetTotalUsersBanned()
        {
            var totalUsersBanned = await _statisticsService.GetTotalUsersBannedAsync();
            return Ok(totalUsersBanned);
        }

        [HttpGet("totalreports")]
        public async Task<IActionResult> GetTotalReports()
        {
            var totalReports = await _statisticsService.GetTotalReportsAsync();
            return Ok(totalReports);
        }

        [HttpGet("totalreportslastweek")]
        public async Task<IActionResult> GetTotalReportsLastWeek()
        {
            var totalReportsLastWeek = await _statisticsService.GetTotalReportsLastWeekAsync();
            return Ok(totalReportsLastWeek);
        }
    }
}
