#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

const char* ssid = "SSID_HERE";
const char* password = "PASSWORD_HERE";

ESP8266WebServer server(80);

IPAddress local_IP(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

const int relayPin = 5;
int relayState = HIGH;

void routes() {
  server.on("/", []() {
    server.send(200, "text/plain", "Fan automation: active");
  });

  server.on("/toggle", []() {
    relayState = !relayState; 
    digitalWrite(relayPin, relayState);

    StaticJsonDocument<200> resJson;
    resJson["status"] = relayState ? "on" :"off";
    resJson["isSuccessful"] = true;

    String response;
    serializeJson(resJson, response);

    server.send(200, "application/json", response);
  });

  server.on("/status", []() {
    StaticJsonDocument<200> resJson;
    resJson["status"] = relayState ? "on" :"off";

    String response;
    serializeJson(resJson, response);

    server.send(200, "application/json", response);
  });
}

void setup() {
  Serial.begin(9600);
  delay(1000);

  Serial.println("Init");

  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("Failed to config static IP");
  }

  WiFi.begin(ssid, password);
  Serial.println("Connecting...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("Connected, IP: ");
  Serial.println(WiFi.localIP());

  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, relayState);

  routes();
  server.begin();

  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  server.handleClient();
}
