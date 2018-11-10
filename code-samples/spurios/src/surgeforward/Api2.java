package surgeforward;

import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.util.IOUtils;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;

/*
Use the simplest library found:
https://www.baeldung.com/google-http-client

Module Settings - Libraries - + - From Maven…
com.google.http-client:google-http-client:1.26.0

181107: java.lang.NoClassDefFoundError: com/google/common/base/Preconditions

https://search.maven.org/

gson
https://www.baeldung.com/jackson-vs-gson

 */
public class Api2 {
  public static class Api {
    public static class Reddit {
      String Kind;

      public String toString() {
        return String.format("Reddit[%s]", Kind);
      }
    }
    protected final HttpRequestFactory requestFactory;

    Api() {
      requestFactory = new NetHttpTransport().createRequestFactory();
    }

    public Reddit []get(String encodedUrl) {
      HttpRequest request = null;
      try {
        request = requestFactory.buildGetRequest(new GenericUrl(encodedUrl));
      } catch (IOException e) {
        throw new AssertionError("Build request failed", e);
      }

      Reddit []jsonObject;
      try {
        // getContent is java.io.InputStream
        //new Gson().fromJson() // wants java.io.Reader. Second argument is either Type or the class to be result type
        // Gson fromJson execute getContentbuild GetRequest com.google.gson.Gson
        jsonObject = new Gson().fromJson(new InputStreamReader(request.execute().getContent()),
          Reddit[].class);
      } catch (IOException e) {
        throw new AssertionError("Request failed", e);
      }

      return jsonObject;
    }
  }

  public static class TestReddit {
    protected static final String redditURL = "https://www.reddit.com/r/webdev/comments/8bri2q/looking_for_easy_public_json_api_recommendations.json";

    TestReddit() {
      Api.Reddit[] reddit = new Api2.Api().get(redditURL);
      System.out.printf("Result: %d '%s' %s\n", reddit.length, Arrays.toString(reddit), reddit[0]);
    }
  }

  public static void main(String[] args) {
    new Api2.TestReddit();
  }
}
