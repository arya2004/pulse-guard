#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <UrlEncode.h>
#include <PulseSensorPlayground.h>

// WiFi credentials
const char* ssid = "your-ssid";
const char* password = "your-password";

// API and patient details
String phoneNumber = "+91xxxxxxxxxx";  // Example: "+91xxxxxxxxxx"
String apiKey = "your-api-key";
String patientId = "your-patient-id";

// Server details
const char* serverName = "http://<base_url>/<patient_id>/esp32";

// Timing variables
unsigned long lastTime = 0;
unsigned long timerDelay = 1000;

// Pulse sensor setup
hw_timer_t* sampleTimer = NULL;
portMUX_TYPE sampleTimerMux = portMUX_INITIALIZER_UNLOCKED;
PulseSensorPlayground pulseSensor;

const int PULSE_INPUT = 36;    
const int THRESHOLD = 685;

// Function prototypes
void IRAM_ATTR onSampleTime();
void sendMessage(String message);

void setup() {
  // Initialize Serial communication
  Serial.begin(115200);
  analogReadResolution(10);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while(WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  // Pulse sensor setup
  pulseSensor.analogInput(PULSE_INPUT);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

  // Timer setup for pulse sensor sampling
  sampleTimer = timerBegin(0, 80, true);                
  timerAttachInterrupt(sampleTimer, &onSampleTime, true);  
  timerAlarmWrite(sampleTimer, 2000, true);      
  timerAlarmEnable(sampleTimer);
}

void loop() {
  // Check if it's time to send data
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;

      // Get pulse rate
      int pulseRate = pulseSensor.getBeatsPerMinute();
      Serial.print("Pulse rate: ");
      Serial.println(pulseRate);

      // Send pulse data to server
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      String httpRequestData = "id=" + patientId + "&pulse=" + String(pulseRate);
      int httpResponseCode = http.POST(httpRequestData);

      // Handle server response
      switch (httpResponseCode) {
        case 200:
          Serial.println("Data sent successfully.");
          break;
        case 201:
          Serial.println("Tachycardia detected.");
          sendMessage("Patient's pulse was recorded at more than 100 BPM.");
          break;
        case 202:
          Serial.println("Bradycardia detected.");
          sendMessage("Patient's pulse was recorded at less than 40 BPM.");
          break;
        default:
          Serial.print("Error sending data. HTTP response code: ");
          Serial.println(httpResponseCode);
          break;
      }

      // Free resources
      http.end();
    } else {
      Serial.println("WiFi Disconnected.");
    }

    // Update lastTime
    lastTime = millis();
  }
}

// Interrupt service routine for pulse sensor sampling
void IRAM_ATTR onSampleTime() {
  portENTER_CRITICAL_ISR(&sampleTimerMux);
  PulseSensorPlayground::OurThis->onSampleTime();
  portEXIT_CRITICAL_ISR(&sampleTimerMux);
}

// Function to send WhatsApp message using CallMeBot API
void sendMessage(String message) {
  // Construct the API URL
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&text=" + urlEncode(message) + "&apikey=" + apiKey;
  HTTPClient http;
  http.begin(url);

  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  // Send HTTP POST request
  int httpResponseCode = http.POST(url);
  if (httpResponseCode == 200) {
    Serial.println("Message sent successfully.");
  } else {
    Serial.println("Error sending the message.");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  // Free resources
  http.end();
}
