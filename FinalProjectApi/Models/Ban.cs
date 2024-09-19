namespace FinalProjectApi.Models
{
    public class Ban
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public int HateCount { get; set; }
        public DateTime BannedUntil { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}