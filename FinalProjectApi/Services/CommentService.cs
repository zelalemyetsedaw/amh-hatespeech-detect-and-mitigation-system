using FinalProjectApi.Configurations;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using FinalProjectApi.Models;

namespace FinalProjectApi.Services;

public class CommentService
{
  private readonly IMongoCollection<Comment> _commentCollection;

  public CommentService(IOptions<DatabaseSettings> databaseSettings)
  {
    var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
    var mongoDb = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
    _commentCollection = mongoDb.GetCollection<Comment>("Comments");
  }

  public async Task<List<Comment>> GetAsync() => await _commentCollection.Find(_ => true).ToListAsync();
  public async Task<Comment> GetAsync(string id) => await _commentCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

  public async Task<List<Comment>> GetByPostIdAsync(string postId) =>
              await _commentCollection.Find(x => x.PostId == postId && x.HasHate == false).ToListAsync();
  public async Task CreateAsync(Comment comment) => await _commentCollection.InsertOneAsync(comment);
  public async Task UpdateAsync(Comment comment) => await _commentCollection.ReplaceOneAsync(x => x.Id == comment.Id, comment);

  public async Task RemoveAsync(string id) => await _commentCollection.DeleteOneAsync(x => x.Id == id);

  public async Task<List<Comment>> GetWithHateSpeechAsync() => await _commentCollection.Find(x => x.HasHate == true).ToListAsync();

  public async Task<List<Comment>> GetWithoutHateSpeechAsync() => await _commentCollection.Find(x => x.HasHate == false).ToListAsync();

public async Task<List<Comment>> GetByUserIdAsync(string userId) =>
    await _commentCollection.Find(x => x.UserId == userId).ToListAsync();
}