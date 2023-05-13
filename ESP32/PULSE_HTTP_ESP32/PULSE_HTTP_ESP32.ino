
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <UrlEncode.h>

const char* ssid = "";
const char* password = "";
String phoneNumber = "";
String apiKey = "";

const char* serverName = "http://<base_url>/<patient_id>/esp32";

unsigned long lastTime = 0;
unsigned long timerDelay = 1000;

hw_timer_t * sampleTimer = NULL;
portMUX_TYPE sampleTimerMux = portMUX_INITIALIZER_UNLOCKED;
#define USE_ARDUINO_INTERRUPTS true
//#define NO_PULSE_SENSOR_SERIAL true
#include <PulseSensorPlayground.h>
PulseSensorPlayground pulseSensor;

const int PULSE_INPUT = 36;    
const int THRESHOLD = 685; 

void IRAM_ATTR onSampleTime() {
  portENTER_CRITICAL_ISR(&sampleTimerMux);
    PulseSensorPlayground::OurThis->onSampleTime();
  portEXIT_CRITICAL_ISR(&sampleTimerMux);
}

//define sound speed in cm/uS


void sendMessage(String message){

  // Data to send with HTTP POST
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber  + "&text=" + urlEncode(message)+ "&apikey=" + apiKey;    
  HTTPClient http;
  http.begin(url);

  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(url);
  if (httpResponseCode == 200){
    Serial.print("Message sent successfully");
  }
  else{
    Serial.println("Error sending the message");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  // Free resources
  http.end();
}


void setup() {
  Serial.begin(115200);
  analogReadResolution(10);
 // Sets the echoPin as an Input
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
    pulseSensor.analogInput(PULSE_INPUT);
  
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

    sampleTimer = timerBegin(0, 80, true);                
  timerAttachInterrupt(sampleTimer, &onSampleTime, true);  
  timerAlarmWrite(sampleTimer, 2000, true);      
  timerAlarmEnable(sampleTimer);
  
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
   
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    

  
  // Reads the echoPin, returns the sound wave travel time in microseconds

  
  // Calculate the distance
  int distanceCm = pulseSensor.getBeatsPerMinute();
  Serial.print(distanceCm);

      http.begin(client, serverName);

     http.addHeader("Content-Type", "application/x-www-form-urlencoded");

      String httpRequestData = "id=6446041a2db998bcf9bdd2da&pulse="+ String(distanceCm);           

      int httpResponseCode = http.POST(httpRequestData);
      if(httpResponseCode == 200){
        Serial.println("okay");
      }
            if(httpResponseCode == 201){
        Serial.println("tachy");
        sendMessage("Patient's pulse was recorded more than 100");
      }
            if(httpResponseCode == 202){
        Serial.println("brady");
        sendMessage("Patient's pulse was recorded less than 40");
      }
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
