using FinalProjectApi.Configurations;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using FinalProjectApi.Models;

namespace FinalProjectApi.Services;

public class PostService
{
  private readonly IMongoCollection<Post> _postCollection;

  public PostService(IOptions<DatabaseSettings> databaseSettings)
  {
    var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
    var mongoDb = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
    _postCollection = mongoDb.GetCollection<Post>("Posts");
  }

  public async Task<List<Post>> GetAsync() => await _postCollection.Find(_ => true).ToListAsync();
  public async Task<Post> GetAsync(string id) => await _postCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

  public async Task<List<Post>> GetByUserIdAsync(string id) => await _postCollection.Find(x => x.UserId == id).ToListAsync();

  public async Task CreateAsync(Post post) => await _postCollection.InsertOneAsync(post);
  public async Task UpdateAsync(Post post) => await _postCollection.ReplaceOneAsync(x => x.Id == post.Id, post);

  public async Task RemoveAsync(string id) => await _postCollection.DeleteOneAsync(x => x.Id == id);

  public async Task<List<Post>> GetWithHateSpeechAsync() => await _postCollection.Find(x => x.HasHate == true).ToListAsync();

  public async Task<List<Post>> GetWithoutHateSpeechAsync() => await _postCollection.Find(x => x.HasHate == false).ToListAsync();

}