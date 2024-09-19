using System;
using System.Threading.Tasks;
using FinalProjectApi.Models;
using MongoDB.Driver;
using FinalProjectApi.Configurations;
using Microsoft.Extensions.Options;

namespace FinalProjectApi.Services
{
    public class StatisticsService
    {
        private readonly IMongoCollection<Post> _postsCollection;
        private readonly IMongoCollection<Comment> _commentsCollection;
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Report> _reportsCollection;

        public StatisticsService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDb = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _postsCollection = mongoDb.GetCollection<Post>("Posts");
            _commentsCollection = mongoDb.GetCollection<Comment>("Comments");
            _usersCollection = mongoDb.GetCollection<User>("users");
            _reportsCollection = mongoDb.GetCollection<Report>("Reports");
        }

        public async Task<long> GetTotalPostsAsync()
        {
            return await _postsCollection.CountDocumentsAsync(FilterDefinition<Post>.Empty) + await _commentsCollection.CountDocumentsAsync(FilterDefinition<Comment>.Empty);
        }

        public async Task<long> GetTotalHateSpokenAsync()
        {
            var totalHateSpoken = await _postsCollection.CountDocumentsAsync(post => post.HasHate) +
                                  await _commentsCollection.CountDocumentsAsync(comment => comment.HasHate);
            return totalHateSpoken;
        }

        public async Task<long> GetTotalHateSpokenLastMonthAsync()
        {
            var lastMonth = DateTime.Now.AddMonths(-1);
            var totalHateSpokenLastMonth = await _postsCollection.CountDocumentsAsync(post => post.HasHate && post.CreatedAt >= lastMonth) +
                                           await _commentsCollection.CountDocumentsAsync(comment => comment.HasHate && comment.CreatedAt >= lastMonth);
            return totalHateSpokenLastMonth;
        }

        public async Task<long> GetTotalHateSpokenLastWeekAsync()
        {
            var lastWeek = DateTime.Now.AddDays(-7);
            var totalHateSpokenLastWeek = await _postsCollection.CountDocumentsAsync(post => post.HasHate && post.CreatedAt >= lastWeek) +
                                          await _commentsCollection.CountDocumentsAsync(comment => comment.HasHate && comment.CreatedAt >= lastWeek);
            return totalHateSpokenLastWeek;
        }

        public async Task<long> GetTotalUsersAsync()
        {
            return await _usersCollection.CountDocumentsAsync(FilterDefinition<User>.Empty);
        }

        public async Task<long> GetTotalUsersBannedAsync()
        {
            return await _usersCollection.CountDocumentsAsync(user => user.BannedUntil > DateTime.Now);
        }

        public async Task<long> GetTotalReportsAsync()
        {
            return await _reportsCollection.CountDocumentsAsync(FilterDefinition<Report>.Empty);
        }

        public async Task<long> GetTotalReportsLastWeekAsync()
        {
            var lastWeek = DateTime.Now.AddDays(-7);
            return await _reportsCollection.CountDocumentsAsync(report => report.CreatedAt >= lastWeek);
        }
    }
}
