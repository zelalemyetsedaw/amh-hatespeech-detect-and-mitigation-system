
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using FinalProjectApi.Models;
using System.IdentityModel.Tokens.Jwt;   // for JwtSecurityTokenHandler
using System.Text;                       // for Encoding
using Microsoft.IdentityModel.Tokens;    // for SecurityTokenDescriptor, SigningCredentials, SymmetricSecurityKey, SecurityAlgorithms
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;          // for ClaimsIdentity, Claim, ClaimTypes
using BCrypt;
using FinalProjectApi.Configurations;
namespace FinalProjectApi.Services;



public class ModeratorService
{
  private readonly IMongoCollection<Moderator> moderators;
  private readonly string key;

  public ModeratorService(IOptions<DatabaseSettings> databaseSettings)
  {
    var client = new MongoClient(databaseSettings.Value.ConnectionString);
    var database = client.GetDatabase(databaseSettings.Value.DatabaseName);
    moderators = database.GetCollection<Moderator>("moderators");
    this.key = "this is my custom Secret key for authentication";
  }

  public List<Moderator> GetModerators() => moderators.Find(user => true).ToList();
  public Moderator GetModerator(string id) => moderators.Find<Moderator>(user => user.Id == id).FirstOrDefault();

  public Moderator GetModeratorByEmail(string email) => moderators.Find<Moderator>(users => users.Email == email).FirstOrDefault();

  public Moderator Create(Moderator moderator)
  {
    var existingUser = moderators.Find(u => u.Email == moderator.Email).FirstOrDefault();
    if (existingUser != null)
    {
      throw new Exception("Email is already taken");
    }
    moderator.Password = BCrypt.Net.BCrypt.HashPassword(moderator.Password);
    moderators.InsertOne(moderator);
    return moderator;
  }

  public async Task UpdateAsync(string id, Moderator updatedUser)
  {
    await moderators.ReplaceOneAsync(user => user.Id == id, updatedUser);
  }

  public string? Authenticate(string email, string password)
  {
    string storedHash = this.moderators.Find(x => x.Email == email).FirstOrDefault().Password;

    bool isMatch = BCrypt.Net.BCrypt.Verify(password, storedHash);

    Console.WriteLine(isMatch);
    if (isMatch == false)
      return null;

    var tokenHandler = new JwtSecurityTokenHandler();

    var tokenKey = Encoding.ASCII.GetBytes(key);

    var tokenDescriptor = new SecurityTokenDescriptor()
    {
      Subject = new ClaimsIdentity(new Claim[]{
        new Claim(ClaimTypes.Email, email),
      }),

      Expires = DateTime.UtcNow.AddHours(1),

      SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(tokenKey),
        SecurityAlgorithms.HmacSha256Signature
      )
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
  }



  public List<Moderator> GetOnlyApprovedModerators()
  {
    return moderators.Find(user => user.IsApproved == true).ToList();
  }

  public Moderator? DeleteModerator(string id)
  {
    var moderator = moderators.Find(user => user.Id == id).FirstOrDefault();

    if (moderator == null)
    {
      return null;
    }

    moderators.DeleteOne(user => user.Id == id);
    return moderator;
  }

  public Moderator? UpdateModerator(string id, Moderator updatedModerator)
  {
    var moderator = moderators.Find(user => user.Id == id).FirstOrDefault();

    if (moderator == null)
    {
      return null;
    }

    moderators.ReplaceOne(user => user.Id == id, updatedModerator);
    return updatedModerator;
  }

  public Moderator? UpdateModeratorIsApprovedValue(string id, bool isApproved)
  {
    var moderator = moderators.Find(user => user.Id == id).FirstOrDefault();

    if (moderator == null)
    {
      return null;
    }

    moderator.IsApproved = isApproved;
    moderators.ReplaceOne(user => user.Id == id, moderator);
    return moderator;
  }

}

