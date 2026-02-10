# Orobas Room Controller

Room automation for **my office** using an ESP32 for lights and an ESP8266 for a fan. Devices expose simple HTTP endpoints and are controlled by a small React client on the same local network.

---

## Screenshots

### Lights
<img width="1536" height="2048" alt="image" src="https://github.com/user-attachments/assets/878775d6-4ea0-4222-abbd-8977df65bdd9" />

### Fan
<img width="1536" height="2048" alt="image" src="https://github.com/user-attachments/assets/0fcf6c9e-348a-43d5-8592-721411bc247a" />

### Client
<img width="1832" height="950" alt="2026-02-11-071208_hyprshot" src="https://github.com/user-attachments/assets/6a748705-7ab9-4363-af9c-48902cc53f93" />


--

## Devices

* **ESP32**: Controls office lights via a servo
* **ESP8266**: Controls office fan via a relay

Each device runs its own HTTP server.

---

## Network

Both devices use static IPs on my local network.

* ESP32: `192.168.1.100`
* ESP8266: `192.168.1.200`

WiFi credentials are defined directly in each sketch:

```cpp
const char* ssid = "SSID_HERE";
const char* password = "PASSWORD_HERE";
```

---

## API

Same API for both devices.

```
GET /        -> health check
GET /toggle -> toggle device state
GET /status -> current state
```

### Response

```json
{
  "status": "on" | "off",
  "isSuccessful": true
}
```

---

## Hardware Pins

### ESP32 (Office Light)

* Servo pin: `GPIO 13`
* Angles: `30` (on), `0` (off)

### ESP8266 (Office Fan)

* Relay pin: `GPIO 5`
* Default state: `HIGH`

---

## Client

A simple React app running on my network sends HTTP requests to each device.

Example:

```ts
fetch("http://192.168.1.100/toggle");
```

---

## Notes

* Intended for my local network only
* Not exposed to the public internet


