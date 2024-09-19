using FinalProjectApi.Configurations;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using FinalProjectApi.Models;

namespace FinalProjectApi.Services;

public class ReportService
{
  private readonly IMongoCollection<Report> _reportCollection;

  public ReportService(IOptions<DatabaseSettings> databaseSettings)
  {
      var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
      var mongoDb = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
      _reportCollection = mongoDb.GetCollection<Report>("Reports");
  }

  public async Task<List<Report>> GetAsync() => await _reportCollection.Find(_ => true).ToListAsync();
  public async Task<Report> GetAsync(string id) => await _reportCollection.Find(x=> x.Id == id).FirstOrDefaultAsync();

  public async Task<List<Report>> GetByUserIdAsync(string id) => await _reportCollection.Find(x=> x.UserId == id).ToListAsync();

  public async Task CreateAsync(Report post) => await _reportCollection.InsertOneAsync(post);
  public async Task UpdateAsync(Report post) => await _reportCollection.ReplaceOneAsync(x => x.Id == post.Id, post);

  public async Task RemoveAsync(string id) => await _reportCollection.DeleteOneAsync(x => x.Id == id);

  public async Task<List<Report>> GetUncheckedReportsAsync()
    {
        return await _reportCollection.Find(report => report.Checked == false).ToListAsync();
    }

    public async Task<List<Report>> GetByModeratedByAsync(string moderatorId)
{
    return await _reportCollection.Find(x => x.ModeratedBy == moderatorId).ToListAsync();
}

public async Task<List<Report>> GetUnassignedReportsAsync()
{
    return await _reportCollection.Find(report => report.ModeratedBy == null).ToListAsync();
}

}