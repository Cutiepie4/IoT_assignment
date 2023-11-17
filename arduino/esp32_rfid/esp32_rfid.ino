#include <HTTPClient.h>
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#define RST_PIN 22
#define SS_PIN 21
#define BUZZER_PIN 4

#define redPin 25
#define greenPin 26
#define bluePin 27

MFRC522 mfrc522(SS_PIN, RST_PIN);

const char *ssid = "wifi nha ai day 2,4Ghz";
const char *password = "khongcomatkhaudau";
String serverUrl = "http://192.168.0.102:5000";
String readCardApi = serverUrl + "/read-card";  // Replace with your server URL

bool singleMode = false;
bool continuousMode = false;

AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, HIGH);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  SPI.begin();
  mfrc522.PCD_Init();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to Wifi: wifi nha ai day 2,4Ghz");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());


  server.on("/enable_single_mode", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /enable request");
    singleMode = true;
    continuousMode = false;
    request->send(200, "text/plain", "RFID is enabled!");
  });

  server.on("/enable_continuous_mode", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /enable_continuous_mode request");
    singleMode = false;
    continuousMode = true;
    request->send(200, "text/plain", "Continuous RFID mode is enabled!");
  });

  server.on("/disable_continuous_mode", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received /disable_continuous_mode request");
    singleMode = false;
    continuousMode = false;
    request->send(200, "text/plain", "Continuous RFID mode is disabled.");
  });

  server.begin();
}

void loop() {
  // singleMode => blue, continuousMode => green
  digitalWrite(BUZZER_PIN, HIGH);

  if (WiFi.status() == WL_CONNECTED) {
    if (singleMode) {
      pinMode(redPin, HIGH);
      pinMode(greenPin, HIGH);
      pinMode(bluePin, HIGH);
      setColor(0, 0, 128);
    } else if (continuousMode) {
      pinMode(redPin, HIGH);
      pinMode(greenPin, HIGH);
      pinMode(bluePin, HIGH);
      setColor(0, 128, 0);
    } else {
      pinMode(redPin, LOW);
      pinMode(greenPin, LOW);
      pinMode(bluePin, LOW);
    }
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

    Serial.println(cardIdString);

    if (singleMode || continuousMode) {
      digitalWrite(BUZZER_PIN, LOW);
      delay(200);
      digitalWrite(BUZZER_PIN, HIGH);
    }

    if (singleMode) {
      WiFiClient client;
      HTTPClient http;
      http.begin(client, readCardApi);
      http.addHeader("Content-Type", "application/json");
      DynamicJsonDocument jsonDocument(200);
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
      singleMode = false;

    } else if (continuousMode) {
      WiFiClient client;
      HTTPClient http;
      http.begin(client, readCardApi);
      http.addHeader("Content-Type", "application/json");

      DynamicJsonDocument jsonDocument(200);
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
    delay(300);
  } else {
    Serial.println("Wifi disconnected...");
    delay(3000);
  }
}

void setColor(int redValue, int greenValue, int blueValue) {
  analogWrite(redPin, 255 - redValue);
  analogWrite(greenPin, 255 - greenValue);
  analogWrite(bluePin, 255 - blueValue);
}
