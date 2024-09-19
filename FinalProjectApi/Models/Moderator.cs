using MongoDB.Bson.Serialization.Attributes;

public class Moderator
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("Email")]
    public string Email { get; set; } = null!;

    [BsonElement("Password")]
    public string Password { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Essay { get; set; } = null!;
    public int NumberOfTask { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public bool IsApproved { get; set; } = false;
}