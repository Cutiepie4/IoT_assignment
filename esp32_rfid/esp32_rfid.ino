#include <HTTPClient.h>
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#define RST_PIN 22
#define SS_PIN 21

MFRC522 mfrc522(SS_PIN, RST_PIN);

const char *ssid = "wifi nha ai day 2,4Ghz";
const char *password = "khongcomatkhaudau";
String serverUrl = "http://192.168.0.103:5000";
String sendCardApi = serverUrl + "/receive-card";  // Replace with your server URL

int ledPin = 2;
bool isEnable = false;

AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to Wifi: wifi nha ai day 2,4Ghz");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  SPI.begin();
  mfrc522.PCD_Init();
  delay(4);

  server.on("/clear", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /clear request");
    request->send(200, "text/plain", "Card data cleared");
  });

  server.on("/enable", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /enable request");
    isEnable = true;
    request->send(200, "text/plain", "RFID is enabled!");
  });

  server.on("/disable", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /disable request");
    isEnable = false;
    request->send(200, "text/plain", "RFID is disabled.");
  });

  server.begin();

  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (isEnable) {
    digitalWrite(ledPin, HIGH);
    if (WiFi.status() == WL_CONNECTED) {
      if (!mfrc522.PICC_IsNewCardPresent()) {
        return;
      }

      if (!mfrc522.PICC_ReadCardSerial()) {
        return;
      }

      digitalWrite(ledPin, HIGH);

      byte *cardId = mfrc522.uid.uidByte;
      String cardIdString = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        cardIdString += String(cardId[i], HEX);
      }

      Serial.println(cardIdString);

      WiFiClient client;
      HTTPClient http;

      http.begin(client, sendCardApi);
      http.addHeader("Content-Type", "application/json");

      DynamicJsonDocument jsonDocument(200);  // Use DynamicJsonDocument for sending

      // Add the card ID to the JSON object
      jsonDocument["card_id"] = cardIdString;

      String jsonString;
      serializeJson(jsonDocument, jsonString);

      int httpCode = http.POST(jsonString);
      if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(payload);
      } else {
        Serial.println("HTTP request failed");
      }
      http.end();
    } else {
      Serial.println("Wifi disconnected...");
      delay(3000);
    }
  }
  else {
    digitalWrite(ledPin, LOW);
  }
}
