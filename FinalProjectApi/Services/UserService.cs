
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using FinalProjectApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using BCrypt;
using FinalProjectApi.Configurations;
namespace FinalProjectApi.Services;



public class UserService
{
  private readonly IMongoCollection<User> users;
  private readonly string key;

  public UserService(IOptions<DatabaseSettings> databaseSettings)
  {
    var client = new MongoClient(databaseSettings.Value.ConnectionString);
    var database = client.GetDatabase(databaseSettings.Value.DatabaseName);
    users = database.GetCollection<User>("users");
    this.key = "this is my custom Secret key for authentication";
  }

  public List<User> GetUsers() => users.Find(user => true).ToList();
  public User GetUser(string id) => users.Find<User>(user => user.Id == id).FirstOrDefault();

  public User GetUserByEmail(string email) => users.Find<User>(users => users.Email == email).FirstOrDefault();

  public User Create(User user)
  {
    var existingUser = users.Find(u => u.Email == user.Email).FirstOrDefault();
    if (existingUser != null)
    {
      throw new Exception("Email is already taken");
    }
    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
    users.InsertOne(user);
    return user;
  }

  public async Task UpdateAsync(string id, User updatedUser)
  {
    await users.ReplaceOneAsync(user => user.Id == id, updatedUser);
  }

  public string? Authenticate(string email, string password)
  {
    string storedHash = this.users.Find(x => x.Email == email).FirstOrDefault().Password;

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

  public async Task UpdateUserHateCountAsync(string userId, int hateCountIncrement)
  {
    var user = GetUser(userId);
    if (user == null) return;
    Console.WriteLine(user.HateCount);
    Console.WriteLine(hateCountIncrement);
    user.HateCount += hateCountIncrement;
    Console.WriteLine(user.HateCount);
    user.HateCount = Math.Max(user.HateCount, 0);
    await UpdateAsync(user.Id, user);
    await CheckAndUpdateBanStatusAsync(user.Id);
  }

  public async Task CheckAndUpdateBanStatusAsync(string userId)
  {
    var user = GetUser(userId);
    if (user == null) return;

    Console.WriteLine(user.HateCount);
    if (user.HateCount > 20)
    {

      user.BannedUntil = DateTime.MaxValue;
    }
    else if (user.HateCount > 15)
    {

      user.BannedUntil = DateTime.Now.AddMonths(1);
    }
    // else if (user.HateCount > 10)
    // {
    //   user.BannedUntil = DateTime.Now.AddDays(7);
    // }
    else if (user.HateCount > 4)
    {

      user.BannedUntil = DateTime.Now.AddDays(2);
    }
    else
    {

      user.BannedUntil = DateTime.Now;
    }

    await UpdateAsync(user.Id, user);
  }

  public async Task DeleteAsync(string id)
  {
    await users.DeleteOneAsync(user => user.Id == id);
  }
}