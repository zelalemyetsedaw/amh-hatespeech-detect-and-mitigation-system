using MongoDB.Bson.Serialization.Attributes;

namespace FinalProjectApi.Models;

public class Comment
{

  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id {get; set;}

   public string PostId { get; set; } = null!;
   public string UserId { get; set; } = null!;
   public string Content { get; set; } = null!;
   public string? ParentId { get; set; } 
   public bool HasHate {get; set; } = false;
   
   [BsonDateTimeOptions(Kind = DateTimeKind.Local)] // Set the DateTimeKind to Local
    public DateTime CreatedAt { get; set; } = DateTime.Now; // Initialize with current date and time
}