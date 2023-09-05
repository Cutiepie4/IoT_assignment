#include <WiFi.h>
#include <ArduinoJson.h>

// Replace with your network credentials
const char* ssid = "TP-Link_AF1E";
const char* password = "97207122";

#define PIN_RED 23    // GPIO23
#define PIN_GREEN 22  // GPIO22
#define PIN_BLUE 21   // GPIO21

WiFiServer server(80);

String header;
String receivedData = "";
int r, g, b, a;

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();

  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
}

void loop() {
  setColor(r, g, b);
  WiFiClient client = server.available();

  if (client) {
    Serial.println("New Client.");
    String currentLine = "";
    bool headerFound = false;                                                  // make a String to hold incoming data from the client
    while (client.connected()) { 
      if (client.available()) {
        char c = client.read();

        if (!headerFound) {
          header += c;
          if (header.endsWith("\r\n\r\n")) {
            headerFound = true;
          }
        } else {
          receivedData += c;
        }

        if (c == '\n' && currentLine == "\r") {
          break;
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }

    if (headerFound) {
      Serial.println("Received JSON data:");
      Serial.println(receivedData);
      sscanf(receivedData.c_str(), "r=%d&g=%d&b=%d&a=%d", &r, &g, &b, &a);

      client.println("HTTP/1.1 200 OK");
      client.println("Content-type: text/html");
      client.println("Connection: close");
      client.println();
      client.println("Data received successfully");
    } else {
      client.println("HTTP/1.1 400 Bad Request");
      client.println("Content-type: text/html");
      client.println("Connection: close");
      client.println();
      client.println("Bad Request");
    }

    // Clear the variables
    receivedData = "";
    header = "";

    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}

void setColor(int R, int G, int B) {
  analogWrite(PIN_RED, R);
  analogWrite(PIN_GREEN, G);
  analogWrite(PIN_BLUE, B);
}