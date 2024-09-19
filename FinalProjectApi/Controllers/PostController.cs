using System.Diagnostics.CodeAnalysis;
using FinalProjectApi.Models;
using FinalProjectApi.Services;
using Microsoft.AspNetCore.Mvc;
using FinalProjectApi.Helpers;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Authentication;

namespace FinalProjectApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class PostController : ControllerBase
{
   private readonly PostService _postService;
   private readonly UserService _userService;

   public PostController(PostService postService, UserService userService)
   {
      _postService = postService;
      _userService = userService;
   }


   [HttpGet("{id:length(24)}")]
   public async Task<IActionResult> Get(string id)
   {
      var existingDriver = await _postService.GetAsync(id);

      if (existingDriver is null) return NotFound();

      return Ok(existingDriver);
   }

   [HttpGet("post/{UserId:length(24)}")]
   public async Task<IActionResult> GetByUserId(string UserId)
   {
      var existingDriver = await _postService.GetByUserIdAsync(UserId);
      Console.WriteLine(existingDriver.Count);
      if (existingDriver is null) return NotFound();

      return Ok(existingDriver);
   }


   [HttpGet]
   public async Task<IActionResult> Get()
   {
      var allDrivers = await _postService.GetAsync();
      if (allDrivers.Any())
         return Ok(allDrivers);

      return NotFound();
   }

   [HttpPost]
   public async Task<IActionResult> Post(Post post)
   {

      var user = _userService.GetUser(post.UserId);


      if (user == null)
         return NotFound("User not found.");


      if (user.BannedUntil.ToLocalTime() > DateTime.Now)
      {
         var bannedDuration = user.BannedUntil == DateTime.MaxValue ? "permanently" : $"until {user.BannedUntil}";
         return Ok( $"User is banned {bannedDuration}." );
      }

      string temp = await HateSpeechChecker.ContainsHateSpeechAsync(post.Content);
      if (temp == "Hate")
      {
         post.HasHate = true;
         await _postService.CreateAsync(post);

         // Increment the user's hate count and update the ban status if necessary


         await _userService.UpdateUserHateCountAsync(user.Id, 1);
         return Ok("The content contains hate speech and cannot be posted.");

      }

      else
      {
         await _postService.CreateAsync(post);
         return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
      }





   }

   [HttpPut("{id:length(24)}")]
   public async Task<IActionResult> Update(string id, Post post)
   {

      var user = _userService.GetUser(post.UserId);


      if (user == null)
         return NotFound("User not found.");

      if (user.BannedUntil.ToLocalTime() > DateTime.Now)
      {
         var bannedDuration = user.BannedUntil == DateTime.MaxValue ? "permanently" : $"until {user.BannedUntil}";
         return Ok( $"User is banned {bannedDuration}." );
      }


      var existingDriver = await _postService.GetAsync(id);


      if (existingDriver is null)
         return BadRequest();

      post.Id = existingDriver.Id;

      string temp = await HateSpeechChecker.ContainsHateSpeechAsync(post.Content);
      if (temp == "Hate")
      {
         post.HasHate = true;
         await _postService.UpdateAsync(post);

         // Increment the user's hate count and update the ban status if necessary


         await _userService.UpdateUserHateCountAsync(post.UserId, 1);
         return Ok("The content contains hate speech and cannot be posted.");

      }
      else
      {


         await _postService.UpdateAsync(post);
         return NoContent();
      }





   }

   [HttpDelete("{id:length(24)}")]
   public async Task<IActionResult> Delete(string id)
   {
      var existingDriver = await _postService.GetAsync(id);

      if (existingDriver is null)
      {
         return BadRequest();
      }

      await _postService.RemoveAsync(id);

      return NoContent();
   }


   [HttpGet("getwithhate")]
   public async Task<IActionResult> GetWithHateSpeech()
   {
      var postsWithHateSpeech = await _postService.GetWithHateSpeechAsync();
      if (postsWithHateSpeech.Any())
         return Ok(postsWithHateSpeech);
      return NotFound("No posts with hate speech found.");
   }

   [HttpGet("getwithouthate")]
   public async Task<IActionResult> GetWithoutHateSpeech()
   {
      var postsWithoutHateSpeech = await _postService.GetWithoutHateSpeechAsync();
      if (postsWithoutHateSpeech.Any())
         return Ok(postsWithoutHateSpeech);
      return NotFound("No posts without hate speech found.");
   }

[HttpPut("{postId:length(24)}/mark-as-hate")]
public async Task<IActionResult> MarkAsHate(string postId)
{
    var post = await _postService.GetAsync(postId);
    if (post == null) return NotFound("Post not found.");

    if (!post.HasHate)
    {
        post.HasHate = true;
        await _postService.UpdateAsync(post);

        await _userService.UpdateUserHateCountAsync(post.UserId, 1);
    }

    return NoContent();
}

[HttpPut("{postId:length(24)}/unmark-as-hate")]
public async Task<IActionResult> UnmarkAsHate(string postId)
{
    var post = await _postService.GetAsync(postId);
    if (post == null) return NotFound("Post not found.");

    if (post.HasHate)
    {
        post.HasHate = false;
        await _postService.UpdateAsync(post);

        await _userService.UpdateUserHateCountAsync(post.UserId, -1);
    }

    return NoContent();
}





}