// -----------------------------------------------------------------------------------------------------------------------------
// Dependencies: GxEPD2 của
// Tested:  ESP32-C3 DevKitM-1 dual USB
// Result: https://youtu.be/yVmRT403PUM
//------------------------------------------------------------------------------------------------------------------------------
// base class GxEPD2_GFX can be used to pass references or pointers to the display instance as parameter, uses ~1.2k more code
// enable or disable GxEPD2_GFX base class
#define ENABLE_GxEPD2_GFX 0

#include <GxEPD2_BW.h>
#include <GxEPD2_3C.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Cắm y hệt như chú thích sau. Giữ nguyên comment
// ESP32-C3 SS=7,SCL(SCK)=4,SDA(MOSI)=6,BUSY=3,RST=2,DC=1

// 2.13'' EPD Module
// GxEPD2_BW<GxEPD2_213_BN, GxEPD2_213_BN::HEIGHT> display(GxEPD2_213_BN(/*CS=5*/ SS, /*DC=*/ 1, /*RST=*/ 2, /*BUSY=*/ 3)); // DEPG0213BN 122x250, SSD1680
// GxEPD2_3C<GxEPD2_213_Z98c, GxEPD2_213_Z98c::HEIGHT> display(GxEPD2_213_Z98c(/*CS=5*/ SS, /*DC=*/ 1, /*RST=*/ 2, /*BUSY=*/ 3)); // GDEY0213Z98 122x250, SSD1680

// 2.9'' EPD Module
GxEPD2_BW<GxEPD2_290_BS, GxEPD2_290_BS::HEIGHT> display(GxEPD2_290_BS(/*CS=5*/ SS, /*DC=*/1, /*RST=*/2, /*BUSY=*/3)); // DEPG0290BS 128x296, SSD1680
// GxEPD2_3C<GxEPD2_290_C90c, GxEPD2_290_C90c::HEIGHT> display(GxEPD2_290_C90c(/*CS=5*/ SS, /*DC=*/ 1, /*RST=*/ 2, /*BUSY=*/ 3)); // GDEM029C90 128x296, SSD1680

// WiFi
const char *ssid = "Do Ngoc";      // Enter your WiFi name
const char *password = "12346789"; // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "178.128.126.128";
const char *broadcast_topic = "epd";
const char *mqtt_username = "linhda";
const char *mqtt_password = "123456";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);
String client_id = "esp32-client-";

void writeEPD(char *message);

void callback(char *topic, byte *payload, unsigned int length)
{
  char message[length + 1];
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
    message[i] = (char)payload[i];
  }
  message[length] = '\0';

  Serial.println();
  Serial.println("-----------------------");
  if (strcmp(topic, client_id.c_str()) == 0)
  {
    writeEPD(message);
  }
  else if (strcmp(topic, broadcast_topic) == 0 && strcmp(message, "list") == 0)
  {
    client.publish(broadcast_topic, client_id.c_str());
  }
}

void setupMQTT()
{
  // Set software serial baud to 115200;
  Serial.begin(9600);
  // connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  client_id += String(WiFi.macAddress());

  // connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected())
  {
    Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("Public emqx mqtt broker connected");
    }
    else
    {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // publish and subscribe
  String init_message = client_id + " connected!";
  Serial.println("Public emqx mqtt broker publish connected message!");
  client.publish(broadcast_topic, init_message.c_str());
  client.subscribe(broadcast_topic);
  client.subscribe(client_id.c_str());
}

void loopMQTT()
{
  client.loop();
}

void writeEPD(char *message)
{
  display.setRotation(1);
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);
  int16_t tbx, tby;
  uint16_t tbw, tbh;
  display.getTextBounds(message, 0, 0, &tbx, &tby, &tbw, &tbh);
  // center the bounding box by transposition of the origin:
  uint16_t x = ((display.width() - tbw) / 2) - tbx;
  uint16_t y = ((display.height() + tbh) / 2) - tby;
  display.setFullWindow();
  display.firstPage();
  do
  {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(x, y - tbh);
    display.print(message);
    display.setTextColor(display.epd2.hasColor ? GxEPD_RED : GxEPD_BLACK);
  } while (display.nextPage());
}

void showPartialUpdate()
{
  // some useful background
  // use asymmetric values for test
  uint16_t box_x = 10;
  uint16_t box_y = 15;
  uint16_t box_w = 70;
  uint16_t box_h = 20;
  uint16_t cursor_y = box_y + box_h - 6;
  if (display.epd2.WIDTH < 104)
    cursor_y = box_y + 6;
  float value = 13.95;
  uint16_t incr = display.epd2.hasFastPartialUpdate ? 1 : 3;
  display.setFont(&FreeMonoBold9pt7b);
  if (display.epd2.WIDTH < 104)
    display.setFont(0);
  display.setTextColor(GxEPD_BLACK);
  // show where the update box is
  for (uint16_t r = 0; r < 4; r++)
  {
    display.setRotation(r);
    display.setPartialWindow(box_x, box_y, box_w, box_h);
    display.firstPage();
    do
    {
      display.fillRect(box_x, box_y, box_w, box_h, GxEPD_BLACK);
      // display.fillScreen(GxEPD_BLACK);
    } while (display.nextPage());
    delay(500);
    display.firstPage();
    do
    {
      display.fillRect(box_x, box_y, box_w, box_h, GxEPD_WHITE);
    } while (display.nextPage());
    delay(1000);
  }
}

void setup()
{
  pinMode(8, OUTPUT);
  digitalWrite(8, HIGH);

  display.init(115200, true, 50, false);
  delay(1000);
  if (display.epd2.hasFastPartialUpdate)
  {
    showPartialUpdate();
    delay(1000);
  }
  display.hibernate();
  setupMQTT();
}

void loop()
{
  // put your main code here, to run repeatedly:
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);

  loopMQTT();
}
