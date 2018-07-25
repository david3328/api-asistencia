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
byte Usuario1[4]= {48, 78, 21,124} ; //código del usuario 1
byte Usuario2[4]= {0x20, 0xC2, 0x4D, 0x80} ; //código del usuario 2

void setup() {
  
   Serial.begin(9600);                 
}

void loop() {

  SPI.begin();        //Iniciamos el Bus SPI
  mfrc522.PCD_Init(); // Iniciamos el MFRC522
  
  //mfrc522.PICC_HaltA();    
// Revisamos si hay nuevas tarjetas  presentes
  if ( mfrc522.PICC_IsNewCardPresent()) 
        {  
            if ( mfrc522.PICC_ReadCardSerial()) 
            {   Serial.print(F("ID-ALUMNO:"));
                  for (byte i = 0; i < mfrc522.uid.size; i++) {
                          //Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
                          Serial.print(mfrc522.uid.uidByte[i]);  
                          //Serial.print(mfrc522.uid.uidByte[i], HEX);  
                          ActualUID[i]=mfrc522.uid.uidByte[i];          
                  } 
                  Serial.print("     ");                                   
                  if(compareArray(ActualUID,Usuario1))
                    Serial.println("VICTOR ARRASCUE");                    
                  else if(compareArray(ActualUID,Usuario2))
                        Serial.println("JOAQUIN DIAZ");                    
                  else
                      Serial.println("Acceso denegado...");                      
            }
  }
  
  while ( !mfrc522.PICC_IsNewCardPresent()){

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
  }
}

//Función para comparar dos vectores
 boolean compareArray(byte array1[],byte array2[])
{
  if(array1[0] != array2[0])return(false);
  if(array1[1] != array2[1])return(false);
  if(array1[2] != array2[2])return(false);
  if(array1[3] != array2[3])return(false);
  return(true);
}
