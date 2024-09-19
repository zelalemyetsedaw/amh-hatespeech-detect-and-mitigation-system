using MongoDB.Bson.Serialization.Attributes;

namespace FinalProjectApi.Models
{
    public class Report
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; } 
        public string ContentId { get; set; } = null!;
        // ID of the post or comment
        public string UserId {get; set; } = null!;
        public string ContentType { get; set; } = null!;// "Post" or "Comment"
        public string Reason { get; set; } = null!;
        public bool Checked {get; set;} = false;
        public string? ModeratedBy {get ; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}