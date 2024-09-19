using MongoDB.Bson.Serialization.Attributes;

namespace FinalProjectApi.Models;

public class User
{
  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id{get; set;}

  [BsonElement("Email")]
  public string Email {get; set;} = null!;

  [BsonElement("Password")]
  public string Password { get; set; } = null!;
  public string Username { get; set; } = null!;
  public int HateCount { get; set; } = 0;
  public DateTime BannedUntil { get; set; } = DateTime.Now ;

  public DateTime CreatedAt { get; set; } = DateTime.Now;

  public bool IsAdmin { get; set; } = false;
}