

#include <WiFi.h>
#include <HTTPClient.h>
#include <UrlEncode.h>

const char* ssid = "galaxy123";
const char* password = "galaxy123";
String phoneNumber = "";
String apiKey = "";

const char* serverName = "http://192.168.158.129:3000/6446041a2db998bcf9bdd2da/esp32";

unsigned long lastTime = 0;
unsigned long timerDelay = 1000;

const int trigPin = 5;
const int echoPin = 18;

//define sound speed in cm/uS
#define SOUND_SPEED 0.034

long duration;
float distanceCm;

void sendMessage(String message){

  // Data to send with HTTP POST
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&apikey=" + apiKey + "&text=" + urlEncode(message);    
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
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
   
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distanceCm = (duration * SOUND_SPEED)*2;

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
