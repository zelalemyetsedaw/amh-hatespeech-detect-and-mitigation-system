using MongoDB.Bson.Serialization.Attributes;

namespace FinalProjectApi.Models;

public class Post
{

  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id {get; set;} 

  public string? UserId { get; set; } = null!;
  public string Content { get; set; } = null!;
  public bool HasHate { get; set; } = false;
  public int likes { get; set; }
  [BsonDateTimeOptions(Kind = DateTimeKind.Local)] // Set the DateTimeKind to Local
  public DateTime CreatedAt { get; set; } = DateTime.Now; // Initialize with current date and time
}