#include <HTTPClient.h>
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

#include <ESPAsyncWebServer.h>
#include <set>

#define RST_PIN 22
#define SS_PIN 21

MFRC522 mfrc522(SS_PIN, RST_PIN);

const char *ssid = "wifi nha ai day 2,4Ghz";
const char *password = "khongcomatkhaudau";
const char *serverUrl = "http://192.168.0.104:5000/send-card-id"; // Replace with your server URL

AsyncWebServer server(80);

std::set <String> list_cards;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to Wifi: wifi nha ai day 2,4Ghz");
  Serial.print("IP:");
  Serial.println(WiFi.localIP());

  SPI.begin();
  mfrc522.PCD_Init();
  delay(4);
  Serial.println(F("Scanning RFID card..."));
 
  server.on("/clearcard", HTTP_GET, [](AsyncWebServerRequest *request){
    list_cards.clear();
    Serial.println("Received /clearcard request");
    request->send(200, "text/plain", "Card data cleared");
  });

  server.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!mfrc522.PICC_IsNewCardPresent()) {
      return;
    }

    if (!mfrc522.PICC_ReadCardSerial()) {
      return;
    }

    byte *cardId = mfrc522.uid.uidByte;
    String cardIdString = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      cardIdString += String(cardId[i], HEX);
    }

    int size = list_cards.size();
    list_cards.insert(cardIdString);
    if(size == list_cards.size()) {
      return;
    }

    Serial.println(cardIdString);

    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument jsonDocument(200); // Use DynamicJsonDocument for sending

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
  }
}
