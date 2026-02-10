#include <ESP32Servo.h>
#include <WebServer.h>
#include <WiFi.h>
#include <ArduinoJson.h>

const char* ssid = "SSID_HERE"
const char* password = "PASSSWORD_HERE";

WebServer server(80);

IPAddress local_IP(192, 168, 1, 100);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

Servo myServo;
int servoPin = 13;
int servoState = 30;

void routes() {
  server.on("/", []() {
    server.send(200, "text/plain", "Light automation: active");
  });

  server.on("/toggle", []() {
    servoState = (servoState == 0) ? 30 : 0;
    myServo.write(servoState);

    StaticJsonDocument<200> resJson;
    resJson["status"] = (servoState == 0) ? "off" : "on";
    resJson["isSuccessful"] = true;

    String response;
    serializeJson(resJson, response);
    
    server.send(200, "application/json", response);

    delay(1000);
  });

  server.on("/status", []() {
    StaticJsonDocument<200> resJson;
    resJson["status"] = (servoState == 0) ? "off" : "on";

    String response;
    serializeJson(resJson, response);

    server.send(200, "application/json", response);
  });
}

void setup() {
  Serial.begin(115200);

  Serial.println("Init servo");

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

  myServo.attach(servoPin);
  myServo.write(servoState);

  routes();
  server.begin();
}

void loop() {
  server.handleClient();
}
