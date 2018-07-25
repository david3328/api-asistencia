#include <SPI.h>
#include "nRF24L01.h"
#include <printf.h>
#include <RF24.h>
//#include "RF24_config.h"
RF24 radio(7,8); // CE, CSN
const byte address[6] = "00001";
const  byte Usuario1[4]={};
 
void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openReadingPipe(0,address);
  radio.setPALevel(RF24_PA_MIN);
  radio.startListening();
}
void loop() {
  
  if (radio.available()) {
   
 radio.read(Usuario1,sizeof Usuario1);
    for (int i = 0; i < 4; i++) {
     Serial.print(Usuario1[i]);
     //radio.stopListening(); 
  }
  Serial.println(" ");
  delay(5000);
    
    }
  }


