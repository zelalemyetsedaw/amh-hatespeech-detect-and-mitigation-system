using System.Diagnostics.CodeAnalysis;
using FinalProjectApi.Helpers;
using FinalProjectApi.Models;
using FinalProjectApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace FinalProjectApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CommentController : ControllerBase
{
   private readonly CommentService _commentService;
   private readonly UserService _userService;

   public CommentController(CommentService commentService, UserService userService) {
       _commentService = commentService;
       _userService = userService;
       }


   [HttpGet("{id:length(24)}")]
   public async Task<IActionResult> Get(string id)
   {
      var existingDriver = await _commentService.GetAsync(id);

      if (existingDriver is null) return NotFound();

      return Ok(existingDriver);
   }

   [HttpGet("bypost/{postId:length(24)}")]
   public async Task<IActionResult> GetByPostId(string postId)
   {
      var commentsByPostId = await _commentService.GetByPostIdAsync(postId);
      if (commentsByPostId.Any())
         return Ok(commentsByPostId);

      return NotFound();
   }


   [HttpGet]
   public async Task<IActionResult> Get()
   {
      var allDrivers = await _commentService.GetAsync();
      if (allDrivers.Any())
         return Ok(allDrivers);

      return NotFound();
   }

   [HttpPost]
   public async Task<IActionResult> Post(Comment comment)
   {

      var user = _userService.GetUser(comment.UserId);
      

      if (user == null)
         return NotFound("User not found.");
      

      if (user.BannedUntil.ToLocalTime() > DateTime.Now)
      {
         var bannedDuration = user.BannedUntil == DateTime.MaxValue ? "permanently" : $"until {user.BannedUntil}";
         return Ok($"User is banned {bannedDuration}." );
      }

      string temp = await HateSpeechChecker.ContainsHateSpeechAsync(comment.Content);
      if (temp == "Hate")
      {
         comment.HasHate = true;
         await _commentService.CreateAsync(comment);

         // Increment the user's hate count and update the ban status if necessary


         await _userService.UpdateUserHateCountAsync(comment.UserId, 1);
         return Ok("The content contains hate speech and cannot be posted.");

      }

      else
      {
         await _commentService.CreateAsync(comment);
         return CreatedAtAction(nameof(Get), new { id = comment.Id }, comment);
      }
     
   }

   [HttpPut("{id:length(24)}")]
   public async Task<IActionResult> Update(string id, Comment comment)
   {
      var user = _userService.GetUser(comment.UserId);


      if (user == null)
         return NotFound("User not found.");

      if (user.BannedUntil.ToLocalTime() > DateTime.Now)
      {
         var bannedDuration = user.BannedUntil == DateTime.MaxValue ? "permanently" : $"until {user.BannedUntil}";
         return Ok( $"User is banned {bannedDuration}." );
      }


      var existingDriver = await _commentService.GetAsync(id);


      if (existingDriver is null)
         return BadRequest();

      comment.Id = existingDriver.Id;

      string temp = await HateSpeechChecker.ContainsHateSpeechAsync(comment.Content);
      if (temp == "Hate")
      {
         comment.HasHate = true;
         await _commentService.UpdateAsync(comment);

         // Increment the user's hate count and update the ban status if necessary


         await _userService.UpdateUserHateCountAsync(comment.UserId, 1);
         return Ok("The content contains hate speech and cannot be posted.");

      }
      else
      {


         await _commentService.UpdateAsync(comment);
         return NoContent();
      }






      
   }

   [HttpDelete("{id:length(24)}")]
   public async Task<IActionResult> Delete(string id)
   {
      var existingDriver = await _commentService.GetAsync(id);

      if (existingDriver is null)
      {
         return BadRequest();
      }

      await _commentService.RemoveAsync(id);

      return NoContent();
   }


   [HttpGet("getwithhate")]
   public async Task<IActionResult> GetWithHateSpeech()
   {
      var postsWithHateSpeech = await _commentService.GetWithHateSpeechAsync();
      if (postsWithHateSpeech.Any())
         return Ok(postsWithHateSpeech);
      return NotFound("No comments with hate speech found.");
   }

   [HttpGet("getwithouthate")]
   public async Task<IActionResult> GetWithoutHateSpeech()
   {
      var postsWithoutHateSpeech = await _commentService.GetWithoutHateSpeechAsync();
      if (postsWithoutHateSpeech.Any())
         return Ok(postsWithoutHateSpeech);
      return NotFound("No comments without hate speech found.");
   }


  [HttpPut("{commentId:length(24)}/mark-as-hate")]
public async Task<IActionResult> MarkAsHate(string commentId)
{
    var post = await _commentService.GetAsync(commentId);
    if (post == null) return NotFound("Post not found.");

    if (!post.HasHate)
    {
        post.HasHate = true;
        await _commentService.UpdateAsync(post);

        await _userService.UpdateUserHateCountAsync(post.UserId, 1);
    }

    return NoContent();
}

[HttpPut("{commentId:length(24)}/unmark-as-hate")]
public async Task<IActionResult> UnmarkAsHate(string commentId)
{
    var post = await _commentService.GetAsync(commentId);
    if (post == null) return NotFound("Post not found.");

    if (post.HasHate)
    {
        post.HasHate = false;
        await _commentService.UpdateAsync(post);

        await _userService.UpdateUserHateCountAsync(post.UserId, -1);
    }

    return NoContent();
}

[HttpGet("byuser/{userId:length(24)}")]
public async Task<IActionResult> GetByUserId(string userId)
{
    var commentsByUserId = await _commentService.GetByUserIdAsync(userId);
    if (commentsByUserId.Any())
        return Ok(commentsByUserId);

    return NotFound("No comments found for the given user.");
}







}