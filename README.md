# Orobas Room Controller

Room automation for **my office** using an ESP32 for lights and an ESP8266 for a fan. Devices expose simple HTTP endpoints and are controlled by a small React client on the same local network.

---

## Screenshots

### Lights
![lights resized 2](https://github.com/user-attachments/assets/6fbe9ea5-b500-4b8f-9161-a12197210c1b)

### Fan
![fan resized](https://github.com/user-attachments/assets/5536015c-4fab-4954-98b2-87ccfc613f24)

### Dashboard
<img width="1825" height="945" alt="2026-02-11-072740_hyprshot" src="https://github.com/user-attachments/assets/acf8dcb3-7bfd-4f1c-ad6b-117ea1d05321" />

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


