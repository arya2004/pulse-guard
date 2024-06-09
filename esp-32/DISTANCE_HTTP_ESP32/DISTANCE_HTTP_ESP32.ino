#include <WiFi.h>
#include <HTTPClient.h>
#include <UrlEncode.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Phone number, API key, and patient ID for CallMeBot API
String phoneNumber = "+91xxxxxxxxxx";  // example "+91xxxxxxxxxx"
String apiKey = "YOUR_API_KEY";
String patientId = "YOUR_PATIENT_ID";

// Server details
const char* serverName = "http://<base_url>/<patient_id>/esp32";

// Timing variables
unsigned long lastTime = 0;
unsigned long timerDelay = 500;

// Ultrasonic sensor pins
const int trigPin = 5;
const int echoPin = 18;

// Speed of sound in cm/uS
#define SOUND_SPEED 0.034

long duration;
float distanceCm;

// Function to send messages via CallMeBot API
void sendMessage(String message) {
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&apikey=" + apiKey + "&text=" + urlEncode(message);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.POST(url);
  if (httpResponseCode == 200) {
    Serial.print("Message sent successfully");
  } else {
    Serial.println("Error sending the message");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
      
      digitalWrite(trigPin, LOW);
      delayMicroseconds(2);
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);
      
      duration = pulseIn(echoPin, HIGH);
      distanceCm = (duration * SOUND_SPEED) * 2;

      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      String httpRequestData = "id=" + patientId + "&pulse=" + String(distanceCm);            
      int httpResponseCode = http.POST(httpRequestData);
      
      // Handle different HTTP response codes
      if (httpResponseCode == 200) {
        Serial.println("HTTP 200: Data sent successfully");
      } else if (httpResponseCode == 201) {
        Serial.println("HTTP 201: Tachycardia detected");
        sendMessage("Patient's pulse was recorded as tachycardic (>100 bpm)");
      } else if (httpResponseCode == 202) {
        Serial.println("HTTP 202: Bradycardia detected");
        sendMessage("Patient's pulse was recorded as bradycardic (<40 bpm)");
      } else {
        Serial.print("HTTP Error: ");
        Serial.println(httpResponseCode);
      }
      
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
