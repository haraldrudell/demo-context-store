/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package surgeforward;

import java.io.*;
import java.net.*;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.json.JSONObject;

/*
java 10 180320 has HttpUrlConnection
https://www.baeldung.com/java-http-request

in Java 11 180925, this has been reworked: https://dzone.com/articles/java-11-standardized-http-client-api
 */

public class SurgeApi {
  public static class Api {
    protected static final String enc = "UTF-8";
    protected static final String qMark = "?";
    protected static final String amp = "&";
    protected static final String equal = "=";
    protected static final String POST = "POST";
    protected static final int buflen = 1024;

    protected final String URL;
    protected String URLwithParameters;

    Api(String URL) {
      this.URL = URL;
    }

    protected String getPrintableURL() {
      return this.URL;
    }

    protected String getURL(Map<String, String> parameters) throws UnsupportedEncodingException {
      String result = this.URL;
      boolean isFirst = true;

      for (Map.Entry<String, String> entry : parameters.entrySet()) {
        if (isFirst) {
          isFirst = false;
          result += qMark;
        } else result += amp;
        result +=
          URLEncoder.encode(entry.getKey(), enc) +
            equal +
            URLEncoder.encode(entry.getValue(), enc);
      }
      return result;
    }

    protected HttpURLConnection connect(String spec) throws IOException {
      HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(spec).openConnection(); // HttpURLConnection is abstract
      httpURLConnection.setRequestMethod(POST); // default is GET
      //httpURLConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      //httpURLConnection.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
      // httpURLConnection.setConnectTimeout(5000); // TODO unknown default
      //httpURLConnection.setReadTimeout(5000); // TODO unknown default
      //httpURLConnection.setDoOutput(true); // default is input only, true is for sending a body eg. POST
      return httpURLConnection;
    }

    protected String getBody(InputStream input) throws IOException {
      BufferedReader reader = new BufferedReader(new InputStreamReader(input));
      char[] buffer = new char[buflen];
      Writer writer = new StringWriter();
      int n;

      try {
        while ((n = reader.read(buffer, 0, buflen)) != -1) writer.write(buffer, 0, n);
      } finally {
        reader.close();
        writer.close();
        input.close();
      }
      return writer.toString();
    }

    protected JSONObject getJSONBody(InputStream input) throws IOException {
      return new JSONObject(getBody(input));
    }

    protected Map<String, String> getResponseHeaders(HttpURLConnection conn) {
      Map<String, String> headers = new LinkedHashMap<>();
      int n = 0;
      String key;

      while ((key = conn.getHeaderFieldKey(n)) != null) {
        String value = conn.getHeaderField(n++);
        headers.put(key, value);
      }
      System.out.printf("n: %d\n", n);
      return headers;
    }

    public JSONObject get(Map<String, String> queryParameters) {
      HttpURLConnection httpURLConnection;

      try {
        httpURLConnection = connect(getURL(queryParameters));

        System.out.printf("headers: %s\n", getResponseHeaders(httpURLConnection));

        int statusCode = httpURLConnection.getResponseCode();
        if (statusCode != 200) throw new Error("Status code: " + statusCode);
      } catch (IOException e) {
        throw new AssertionError("Connect failed url: " + getPrintableURL(), e);
      }

      JSONObject response;
      try {
        response = getJSONBody(httpURLConnection.getInputStream());
      } catch (IOException e1) {
        throw new AssertionError("Parsing body failed url: " + getPrintableURL(), e1);
      }

      return response;
    }
  }

  public static class TestApi {
    protected static final Map<String, String> queryParameters = Stream.of(new String[][]{
      {"client_id", "ConsumerKeyFromSalesfoceConnectedApps"},
      {"client_secret", "ConsumerSecretFromSalesforceConnectedApps"},
      {"username", "username@salesforce.com"},
      {"password", "passwordSecurityToken"},
      {"grant_type", "password"},
    }).collect(Collectors.collectingAndThen(
      Collectors.toMap(data -> data[0], data -> data[1]),
      Collections::<String, String>unmodifiableMap));
    protected static final String schemeHostPort = "https://login.salesforce.com";
    protected static final String uri = "/services/oauth2/token";

    TestApi() {
      SurgeApi.Api api = new SurgeApi.Api(schemeHostPort + uri);
      JSONObject actual = api.get(queryParameters);
    }
  }

  public static void main(String[] args) {
    new SurgeApi.TestApi();
  }
}
