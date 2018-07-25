#include <SPI.h>
#include <printf.h>
#include <RF24.h>
#include <MFRC522.h>
#define RST_PIN  9    //Pin 9 para el reset del RC522
#define SS_PIN  10   //Pin 10 para el SS (SDA) del RC522
MFRC522 mfrc522(SS_PIN, RST_PIN); ///Creamos el objeto para el RC522
RF24 radio(7,8); // CE, CSN
const byte address[6] = "00001";
byte ActualUID[4]={}; //almacenará el código del Tag leído
int flag = 0 ; 

void setup() {
  
   Serial.begin(9600);                 
}

void loop() {

  SPI.begin();        //Iniciamos el Bus SPI
  mfrc522.PCD_Init(); // Iniciamos el MFRC522
    
// Revisamos si hay nuevas tarjetas  presentes
  if ( mfrc522.PICC_IsNewCardPresent()) 
        {  
            if ( mfrc522.PICC_ReadCardSerial()) 
            {   Serial.print(F("ID-ALUMNO:"));
                  for (byte i = 0; i < mfrc522.uid.size; i++) {

                          Serial.print(mfrc522.uid.uidByte[i]);  

                          ActualUID[i]=mfrc522.uid.uidByte[i];          
                  } 
                  flag = 1;
                  
            }
  }
  
  while ( flag = 1){

 SPI.end(); 
 //SPI.begin(); 
  radio.begin();
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MIN);
  radio.stopListening();
  
 //for (byte i = 0; i < 4; i++) {
   radio.write(ActualUID,sizeof ActualUID);
   //Serial.print(ActualUID[i]);
// }
 //Serial.println(" ");
 delay(500);
 //mfrc522.PCD_Reset();
 flag = 0 ;
  }
}


