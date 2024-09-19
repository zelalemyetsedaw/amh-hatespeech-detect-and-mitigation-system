using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FinalProjectApi.Helpers; 
public class HateSpeechChecker
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task<string> ContainsHateSpeechAsync(string content)
    {
        var requestBody = new { input_string = content };
        var contentString = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        var response = await client.PostAsync("https://hatespeechapi-13.onrender.com", contentString);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseBody);

        return result.predicted_label;
    }
}
