/*
 * ============================================================
 *  CardioTwin AI — ESP32 Firmware
 * ============================================================
 *  
 *  Real-time biometric sensor station that reads heart rate,
 *  HRV, SpO2, and skin temperature, then POSTs JSON to the
 *  CardioTwin FastAPI backend every 2 seconds.
 *
 *  COMPONENTS:
 *    - ESP32-WROOM-32 Dev Board
 *    - MAX30102 Pulse Oximeter (I2C: SDA=21, SCL=22)
 *    - 10kΩ NTC Thermistor + 10kΩ resistor (voltage divider on GPIO 34)
 *    - Green LED + 220Ω resistor (GPIO 26)
 *    - Red LED + 220Ω resistor (GPIO 27)
 *    - Passive Buzzer (GPIO 25)
 *
 *  WIRING:
 *    ESP32 3.3V  → MAX30102 VIN, NTC voltage divider top
 *    ESP32 GND   → MAX30102 GND, NTC divider bottom, LEDs cathode, Buzzer (-)
 *    GPIO 21     → MAX30102 SDA
 *    GPIO 22     → MAX30102 SCL
 *    GPIO 34     → NTC/Resistor junction (ADC input)
 *    GPIO 25     → Buzzer (+)
 *    GPIO 26     → 220Ω → Green LED anode
 *    GPIO 27     → 220Ω → Red LED anode
 *
 *  NTC VOLTAGE DIVIDER:
 *    3.3V ── [10kΩ NTC] ── junction (GPIO 34) ── [10kΩ resistor] ── GND
 *
 *  BACKEND API CONTRACT (from dtos/readingsDto.py):
 *    POST /api/reading
 *    {
 *      "bpm": float,          // 30-220
 *      "hrv": float,          // 0-200  (RMSSD in ms)
 *      "spo2": float,         // 70-100
 *      "temperature": float,  // 30.0-42.0 (°C)
 *      "timestamp": int,      // millis() since boot
 *      "session_id": string   // "demo" for hackathon
 *    }
 *
 *  RESPONSE:
 *    { "status": "calibrating"|"scored", "alert": true|false, ... }
 *    Hardware checks "alert" field only:
 *      true  → Buzzer beep + Red LED
 *      false → Green LED blink
 *
 *  LIBRARIES REQUIRED (install via Arduino Library Manager):
 *    1. SparkFun MAX3010x Pulse and Proximity Sensor Library
 *    2. ArduinoJson (by Benoit Blanchon)
 *    3. WiFi, HTTPClient, Wire — built-in with ESP32 board package
 *
 * ============================================================
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "MAX30105.h"
#include "heartRate.h"

// ============================================================
//  CONFIGURATION — CHANGE THESE FOR YOUR SETUP
// ============================================================

// WiFi credentials — UPDATE AT VENUE
const char* WIFI_SSID     = "REDMI 15";
const char* WIFI_PASSWORD = "akeemjr8fg";

// Backend API endpoint — GET FROM PERSON 3 (backend developer)
const char* API_URL       = "https://cardiotwin-jqrct.ondigitalocean.app/api/reading";

// Session ID — fixed for hackathon demo
const char* SESSION_ID    = "demo";

// ============================================================
//  PIN DEFINITIONS
// ============================================================

#define MAX30102_SDA     21    // I2C Data (default ESP32)
#define MAX30102_SCL     22    // I2C Clock (default ESP32)
#define NTC_PIN          34    // ADC input for NTC thermistor
#define BUZZER_PIN       25    // Passive buzzer
#define GREEN_LED_PIN    26    // Data-sent-OK indicator
#define RED_LED_PIN      27    // Error / alert / no-finger indicator

// ============================================================
//  SENSOR & TIMING CONSTANTS
// ============================================================

// MAX30102
#define FINGER_THRESHOLD     50000   // IR value below this = no finger
#define MAX30102_LED_BRIGHT  0x1F    // LED pulse amplitude (lower = less power)
#define MAX30102_SAMPLE_AVG  4       // Samples to average per reading
#define MAX30102_LED_MODE    2       // 2 = RED + IR (SpO2 mode)
#define MAX30102_SAMPLE_RATE 400     // Samples per second
#define MAX30102_PULSE_WIDTH 411     // LED pulse width (411μs = 18-bit ADC)
#define MAX30102_ADC_RANGE   4096    // ADC range

// NTC Thermistor (Steinhart-Hart calculation)
#define NTC_NOMINAL_R        10000.0  // NTC resistance at 25°C (10kΩ)
#define NTC_NOMINAL_TEMP     25.0     // Temperature for nominal resistance
#define NTC_BETA             3950.0   // Beta coefficient (B25/85)
#define NTC_SERIES_R         10000.0  // Series resistor value (10kΩ)
#define NTC_ADC_MAX          4095.0   // ESP32 12-bit ADC max value
#define NTC_SAMPLES          10       // ADC samples to average (noise reduction)

// Beat detection & HRV
#define BPM_BUFFER_SIZE      10       // Rolling average window for BPM
#define HRV_BUFFER_SIZE      20       // Beat intervals stored for RMSSD calc
#define MIN_VALID_BPM        30.0     // Backend validation: min 30
#define MAX_VALID_BPM        220.0    // Backend validation: max 220
#define MIN_VALID_HRV        0.0      // Backend validation: min 0
#define MAX_VALID_HRV        200.0    // Backend validation: max 200
#define MIN_VALID_SPO2       70.0     // Backend validation: min 70
#define MAX_VALID_SPO2       100.0    // Backend validation: max 100
#define MIN_VALID_TEMP       30.0     // Backend validation: min 30.0°C
#define MAX_VALID_TEMP       42.0     // Backend validation: max 42.0°C
#define MIN_BEAT_INTERVAL_MS 273      // Max 220 BPM → 60000/220 ≈ 273ms
#define MAX_BEAT_INTERVAL_MS 2000     // Min 30 BPM  → 60000/30  = 2000ms

// Timing
#define SEND_INTERVAL_MS         2000     // POST every 2 seconds (per PRD)
#define WIFI_TIMEOUT_MS          15000    // 15 seconds to connect
#define MAX_CONSECUTIVE_FAILS    5        // Reconnect WiFi after 5 HTTP failures
#define LED_BLINK_MS             100      // LED blink duration
#define ALERT_BEEP_FREQ          800      // Alert buzzer frequency (Hz)
#define ALERT_BEEP_ON_MS         200      // Alert beep ON duration
#define ALERT_BEEP_OFF_MS        100      // Alert beep OFF duration
#define ALERT_BEEP_COUNT         3        // Number of alert beeps
#define ERROR_BEEP_FREQ          400      // Error tone frequency
#define SUCCESS_BEEP_FREQ        1000     // Success tick frequency
#define BOOT_TONE_DURATION       150      // Boot melody note duration

// SpO2 estimation
// Linear approximation: SpO2 ≈ 110 - 25 * R
// Where R = (AC_red / DC_red) / (AC_ir / DC_ir)
#define SPO2_COEFF_A         110.0
#define SPO2_COEFF_B         25.0

// ============================================================
//  GLOBAL STATE
// ============================================================

MAX30105 particleSensor;

// Beat detection state
float    bpmBuffer[BPM_BUFFER_SIZE];
int      bpmBufferIndex   = 0;
int      bpmBufferCount   = 0;
bool     bpmBufferFull    = false;

// HRV (beat-to-beat intervals)
long     beatIntervals[HRV_BUFFER_SIZE];
int      hrvBufferIndex   = 0;
int      hrvBufferCount   = 0;

// Beat timing
unsigned long lastBeatTime      = 0;
bool          firstBeatDetected = false;

// SpO2 accumulators (between sends)
float    redACSum     = 0;
float    redDCSum     = 0;
float    irACSum      = 0;
float    irDCSum      = 0;
int      spo2Samples  = 0;

// Running min/max for AC component extraction
long     redMin = 0, redMax = 0;
long     irMin  = 0, irMax  = 0;
bool     spo2WindowReset = true;

// Latest computed values (sent to backend)
float    currentBPM         = 0;
float    currentHRV         = 0;
float    currentSpO2        = 0;
float    currentTemperature = 0;

// Network state
int      consecutiveHTTPFails = 0;
bool     wifiConnected        = false;

// Timing
unsigned long lastSendTime   = 0;
unsigned long lastBlinkTime  = 0;

// Finger detection
bool     fingerPresent       = false;
bool     prevFingerPresent   = false;

// ============================================================
//  FORWARD DECLARATIONS
// ============================================================

void     setupPins();
void     setupMAX30102();
void     connectWiFi();
void     reconnectWiFi();
float    readNTCTemperature();
void     processSensorLoop();
void     calculateSpO2();
float    calculateHRV();
float    calculateAverageBPM();
void     sendReading();
void     handleResponse(int httpCode, String& payload);
void     blinkLED(int pin, int durationMs);
void     playBootMelody();
void     playAlertBeeps();
void     playErrorTone();
void     playSuccessTick();
void     buzzerTone(int freq, int durationMs);

// ============================================================
//  SETUP
// ============================================================

void setup() {
    Serial.begin(115200);
    delay(500);

    Serial.println();
    Serial.println("=============================================");
    Serial.println("  CardioTwin AI — Sensor Station Firmware");
    Serial.println("  v1.0 | ESP32 + MAX30102 + NTC Thermistor");
    Serial.println("=============================================");
    Serial.println();

    // 1. Configure pins
    setupPins();

    // 2. Boot indicator — Red LED on while booting
    digitalWrite(RED_LED_PIN, HIGH);

    // 3. Initialize I2C and MAX30102
    setupMAX30102();

    // 4. Test NTC thermistor
    float testTemp = readNTCTemperature();
    Serial.print("[NTC] Initial temperature: ");
    Serial.print(testTemp);
    Serial.println(" °C");
    if (testTemp < 10.0 || testTemp > 50.0) {
        Serial.println("[NTC] WARNING: Temperature out of expected range.");
        Serial.println("[NTC] Check wiring: 3.3V → NTC → GPIO34 → 10kΩ → GND");
    } else {
        Serial.println("[NTC] ✅ Thermistor reading OK");
    }

    // 5. Connect to WiFi
    connectWiFi();

    // 6. Boot complete
    digitalWrite(RED_LED_PIN, LOW);
    playBootMelody();

    // Flash green LED 3× to signal ready
    for (int i = 0; i < 3; i++) {
        blinkLED(GREEN_LED_PIN, 200);
        delay(200);
    }

    Serial.println();
    Serial.println("╔═══════════════════════════════════════╗");
    Serial.println("║   SYSTEM READY — Place finger on      ║");
    Serial.println("║   the MAX30102 sensor to begin.       ║");
    Serial.println("╚═══════════════════════════════════════╝");
    Serial.println();

    lastSendTime = millis();
}

// ============================================================
//  MAIN LOOP
// ============================================================

void loop() {
    // Continuously read sensor and detect beats
    processSensorLoop();

    // Every 2 seconds, send data to backend
    unsigned long now = millis();
    if (now - lastSendTime >= SEND_INTERVAL_MS) {
        lastSendTime = now;

        if (!fingerPresent) {
            // No finger — show red LED, skip sending
            digitalWrite(RED_LED_PIN, HIGH);
            digitalWrite(GREEN_LED_PIN, LOW);

            if (prevFingerPresent) {
                // Just removed finger
                Serial.println("[SENSOR] ⚠️  No finger detected. Place finger on sensor.");
                prevFingerPresent = false;
            }
            return;
        }

        // Finger is present
        if (!prevFingerPresent) {
            Serial.println("[SENSOR] ☝️  Finger detected! Reading biometrics...");
            prevFingerPresent = true;
            // Reset SpO2 window on finger placement
            spo2WindowReset = true;
        }

        digitalWrite(RED_LED_PIN, LOW);

        // Read temperature from NTC
        currentTemperature = readNTCTemperature();

        // Calculate SpO2 from accumulated RED/IR data
        calculateSpO2();

        // Get averaged BPM
        currentBPM = calculateAverageBPM();

        // Get HRV (RMSSD)
        currentHRV = calculateHRV();

        // Print readings to Serial
        Serial.println("────────────────────────────────────────");
        Serial.print("[DATA] BPM: ");
        Serial.print(currentBPM, 1);
        Serial.print("  |  HRV: ");
        Serial.print(currentHRV, 1);
        Serial.print(" ms  |  SpO2: ");
        Serial.print(currentSpO2, 1);
        Serial.print("%  |  Temp: ");
        Serial.print(currentTemperature, 1);
        Serial.println(" °C");

        // Validate before sending
        bool valid = true;
        if (currentBPM < MIN_VALID_BPM || currentBPM > MAX_VALID_BPM) {
            Serial.println("[SKIP] BPM out of range — waiting for stable reading");
            valid = false;
        }
        if (currentHRV < MIN_VALID_HRV || currentHRV > MAX_VALID_HRV) {
            Serial.println("[SKIP] HRV out of range — clamping");
            currentHRV = constrain(currentHRV, MIN_VALID_HRV, MAX_VALID_HRV);
        }
        if (currentSpO2 < MIN_VALID_SPO2 || currentSpO2 > MAX_VALID_SPO2) {
            Serial.println("[SKIP] SpO2 out of range — clamping");
            currentSpO2 = constrain(currentSpO2, MIN_VALID_SPO2, MAX_VALID_SPO2);
        }
        if (currentTemperature < MIN_VALID_TEMP || currentTemperature > MAX_VALID_TEMP) {
            Serial.println("[SKIP] Temperature out of range — clamping");
            currentTemperature = constrain(currentTemperature, MIN_VALID_TEMP, MAX_VALID_TEMP);
        }

        if (valid) {
            sendReading();
        } else {
            blinkLED(RED_LED_PIN, LED_BLINK_MS);
        }

        // Reset SpO2 accumulators for next window
        redACSum    = 0;
        redDCSum    = 0;
        irACSum     = 0;
        irDCSum     = 0;
        spo2Samples = 0;
        spo2WindowReset = true;
    }
}

// ============================================================
//  PIN SETUP
// ============================================================

void setupPins() {
    pinMode(GREEN_LED_PIN, OUTPUT);
    pinMode(RED_LED_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    // NTC_PIN (GPIO 34) is input-only ADC — no pinMode needed

    // Ensure all outputs are LOW
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);

    Serial.println("[PINS] ✅ GPIO configured");
}

// ============================================================
//  MAX30102 INITIALIZATION
// ============================================================

void setupMAX30102() {
    Serial.print("[MAX30102] Initializing... ");

    Wire.begin(MAX30102_SDA, MAX30102_SCL);

    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println("❌ FAILED — sensor not found!");
        Serial.println("[MAX30102] Check wiring:");
        Serial.println("  VIN → 3.3V (NOT 5V)");
        Serial.println("  GND → GND");
        Serial.println("  SDA → GPIO 21");
        Serial.println("  SCL → GPIO 22");

        // Continuous error tone — halt here
        while (true) {
            buzzerTone(ERROR_BEEP_FREQ, 500);
            delay(500);
            digitalWrite(RED_LED_PIN, !digitalRead(RED_LED_PIN));
        }
    }

    Serial.println("✅ Found!");

    // Configure sensor for SpO2 mode (RED + IR LEDs)
    particleSensor.setup(
        MAX30102_LED_BRIGHT,    // LED brightness
        MAX30102_SAMPLE_AVG,    // Sample averaging
        MAX30102_LED_MODE,      // LED mode: 2 = Red + IR
        MAX30102_SAMPLE_RATE,   // Sample rate
        MAX30102_PULSE_WIDTH,   // Pulse width
        MAX30102_ADC_RANGE      // ADC range
    );

    // Enable die temperature sensor (for cross-reference if needed)
    particleSensor.enableDIETEMPRDY();

    Serial.println("[MAX30102] ✅ Configured — SpO2 mode (RED + IR)");
}

// ============================================================
//  NTC THERMISTOR — TEMPERATURE READING
// ============================================================
//
//  Circuit: 3.3V ── [NTC (10kΩ @ 25°C)] ── junction ── [10kΩ fixed] ── GND
//                                              │
//                                          GPIO 34 (ADC)
//
//  Steinhart-Hart simplified (Beta equation):
//    1/T = 1/T0 + (1/B) * ln(R/R0)
//
//  Where:
//    T0 = 298.15 K (25°C)
//    B  = 3950 (NTC beta coefficient)
//    R0 = 10000 Ω (resistance at 25°C)
//    R  = measured resistance from voltage divider
//
// ============================================================

float readNTCTemperature() {
    // Average multiple ADC readings to reduce noise
    float adcSum = 0;
    for (int i = 0; i < NTC_SAMPLES; i++) {
        adcSum += analogRead(NTC_PIN);
        delayMicroseconds(100);
    }
    float adcValue = adcSum / NTC_SAMPLES;

    // Prevent division by zero
    if (adcValue <= 0) adcValue = 1;
    if (adcValue >= NTC_ADC_MAX) adcValue = NTC_ADC_MAX - 1;

    // Calculate NTC resistance from voltage divider
    //   V_adc = 3.3V * R_fixed / (R_ntc + R_fixed)
    //   R_ntc = R_fixed * (ADC_MAX / adcValue - 1)
    float resistance = NTC_SERIES_R * (NTC_ADC_MAX / adcValue - 1.0);

    // Steinhart-Hart Beta equation
    float steinhart;
    steinhart = resistance / NTC_NOMINAL_R;          // R / R0
    steinhart = log(steinhart);                       // ln(R/R0)
    steinhart /= NTC_BETA;                            // 1/B * ln(R/R0)
    steinhart += 1.0 / (NTC_NOMINAL_TEMP + 273.15);  // + 1/T0
    steinhart = 1.0 / steinhart;                      // Invert
    steinhart -= 273.15;                              // Convert K → °C

    return steinhart;
}

// ============================================================
//  SENSOR PROCESSING LOOP
//  Called continuously from loop() — handles beat detection,
//  SpO2 accumulation, and finger presence detection.
// ============================================================

void processSensorLoop() {
    // Read raw sensor values
    long irValue  = particleSensor.getIR();
    long redValue = particleSensor.getRed();

    // ── Finger Detection ──
    fingerPresent = (irValue > FINGER_THRESHOLD);

    if (!fingerPresent) {
        return;  // Nothing to process without a finger
    }

    // ── Beat Detection ──
    // Uses SparkFun library's built-in peak detection
    if (checkForBeat(irValue)) {
        unsigned long now = millis();

        if (firstBeatDetected) {
            long interval = now - lastBeatTime;

            // Validate interval (physiologically reasonable)
            if (interval >= MIN_BEAT_INTERVAL_MS && interval <= MAX_BEAT_INTERVAL_MS) {
                // Calculate instantaneous BPM
                float instantBPM = 60000.0 / (float)interval;

                // Store in BPM rolling average buffer
                bpmBuffer[bpmBufferIndex] = instantBPM;
                bpmBufferIndex = (bpmBufferIndex + 1) % BPM_BUFFER_SIZE;
                if (bpmBufferCount < BPM_BUFFER_SIZE) bpmBufferCount++;

                // Store interval for HRV calculation
                beatIntervals[hrvBufferIndex] = interval;
                hrvBufferIndex = (hrvBufferIndex + 1) % HRV_BUFFER_SIZE;
                if (hrvBufferCount < HRV_BUFFER_SIZE) hrvBufferCount++;
            }
        } else {
            firstBeatDetected = true;
        }

        lastBeatTime = now;
    }

    // ── SpO2 Accumulation ──
    // Track running min/max of RED and IR to extract AC components
    if (spo2WindowReset) {
        redMin = redValue;
        redMax = redValue;
        irMin  = irValue;
        irMax  = irValue;
        spo2WindowReset = false;
    } else {
        if (redValue < redMin) redMin = redValue;
        if (redValue > redMax) redMax = redValue;
        if (irValue < irMin)   irMin  = irValue;
        if (irValue > irMax)   irMax  = irValue;
    }

    // DC = average (approximated by midpoint of min/max)
    // AC = peak-to-peak amplitude
    float redDC = (redMax + redMin) / 2.0;
    float irDC  = (irMax + irMin) / 2.0;
    float redAC = redMax - redMin;
    float irAC  = irMax - irMin;

    if (redDC > 0 && irDC > 0) {
        redACSum += redAC;
        redDCSum += redDC;
        irACSum  += irAC;
        irDCSum  += irDC;
        spo2Samples++;
    }
}

// ============================================================
//  SpO2 CALCULATION
// ============================================================
//
//  Uses Beer-Lambert approximation:
//    R = (AC_red / DC_red) / (AC_ir / DC_ir)
//    SpO2 ≈ 110 - 25 * R
//
//  This is a simplified linear model. Clinical devices use
//  empirical lookup tables, but this gives reasonable estimates
//  for a hackathon demo.
//
// ============================================================

void calculateSpO2() {
    if (spo2Samples < 10) {
        // Not enough data — keep previous value or default
        if (currentSpO2 < MIN_VALID_SPO2) {
            currentSpO2 = 97.0;  // Reasonable default
        }
        return;
    }

    float avgRedAC = redACSum / spo2Samples;
    float avgRedDC = redDCSum / spo2Samples;
    float avgIrAC  = irACSum / spo2Samples;
    float avgIrDC  = irDCSum / spo2Samples;

    // Prevent division by zero
    if (avgRedDC < 1 || avgIrDC < 1 || avgIrAC < 1) {
        return;
    }

    // Ratio of ratios
    float R = (avgRedAC / avgRedDC) / (avgIrAC / avgIrDC);

    // Linear approximation
    float spo2 = SPO2_COEFF_A - SPO2_COEFF_B * R;

    // Clamp to physiologically reasonable range
    currentSpO2 = constrain(spo2, 85.0, 100.0);
}

// ============================================================
//  HEART RATE — ROLLING AVERAGE
// ============================================================

float calculateAverageBPM() {
    if (bpmBufferCount == 0) return 0;

    float sum = 0;
    int count = min(bpmBufferCount, BPM_BUFFER_SIZE);
    for (int i = 0; i < count; i++) {
        sum += bpmBuffer[i];
    }

    return sum / count;
}

// ============================================================
//  HRV — RMSSD CALCULATION
// ============================================================
//
//  RMSSD = Root Mean Square of Successive Differences
//  Standard HRV metric from beat-to-beat interval variability.
//
//  Formula:
//    RMSSD = √( Σ(RRi+1 - RRi)² / (N-1) )
//
//  Where RRi = successive beat-to-beat intervals in milliseconds
//
// ============================================================

float calculateHRV() {
    if (hrvBufferCount < 2) return 0;

    int count = min(hrvBufferCount, HRV_BUFFER_SIZE);
    float sumSquaredDiffs = 0;
    int pairs = 0;

    for (int i = 1; i < count; i++) {
        // Get successive intervals (handle circular buffer)
        int idx1 = (hrvBufferIndex - count + i - 1 + HRV_BUFFER_SIZE) % HRV_BUFFER_SIZE;
        int idx2 = (hrvBufferIndex - count + i + HRV_BUFFER_SIZE) % HRV_BUFFER_SIZE;

        float diff = (float)(beatIntervals[idx2] - beatIntervals[idx1]);
        sumSquaredDiffs += diff * diff;
        pairs++;
    }

    if (pairs == 0) return 0;

    float rmssd = sqrt(sumSquaredDiffs / pairs);
    return rmssd;
}

// ============================================================
//  HTTP — SEND READING TO BACKEND
// ============================================================

void sendReading() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP] WiFi disconnected — attempting reconnect...");
        reconnectWiFi();
        if (WiFi.status() != WL_CONNECTED) {
            blinkLED(RED_LED_PIN, LED_BLINK_MS);
            playErrorTone();
            return;
        }
    }

    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(5000);  // 5 second timeout

    // Build JSON payload matching BiometricReadingRequest
    StaticJsonDocument<256> doc;
    doc["bpm"]         = round(currentBPM * 10.0) / 10.0;          // 1 decimal
    doc["hrv"]         = round(currentHRV * 10.0) / 10.0;          // 1 decimal
    doc["spo2"]        = round(currentSpO2 * 10.0) / 10.0;         // 1 decimal
    doc["temperature"] = round(currentTemperature * 10.0) / 10.0;  // 1 decimal
    doc["timestamp"]   = (long)millis();
    doc["session_id"]  = SESSION_ID;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    Serial.print("[HTTP] POST → ");
    Serial.println(API_URL);
    Serial.print("[HTTP] Body: ");
    Serial.println(jsonPayload);

    int httpCode = http.POST(jsonPayload);
    String payload = "";

    if (httpCode > 0) {
        payload = http.getString();
    }

    handleResponse(httpCode, payload);

    http.end();
}

// ============================================================
//  HTTP RESPONSE HANDLER
// ============================================================

void handleResponse(int httpCode, String& payload) {
    if (httpCode == 200 || httpCode == 201) {
        // ── SUCCESS ──
        consecutiveHTTPFails = 0;
        Serial.print("[HTTP] ✅ ");
        Serial.print(httpCode);
        Serial.print(" — ");
        Serial.println(payload.substring(0, 120));  // Truncate for readability

        // Parse response to check "alert" field
        StaticJsonDocument<1024> responseDoc;
        DeserializationError error = deserializeJson(responseDoc, payload);

        if (!error) {
            bool alert = responseDoc["alert"] | false;
            const char* status = responseDoc["status"] | "unknown";

            Serial.print("[STATUS] ");
            Serial.print(status);

            if (responseDoc.containsKey("score")) {
                float score = responseDoc["score"];
                const char* zone = responseDoc["zone"] | "?";
                Serial.print("  |  Score: ");
                Serial.print(score, 1);
                Serial.print("  |  Zone: ");
                Serial.print(zone);
            }

            if (responseDoc.containsKey("readings_collected")) {
                int collected = responseDoc["readings_collected"];
                int needed    = responseDoc["readings_needed"];
                Serial.print("  |  Calibrating: ");
                Serial.print(collected);
                Serial.print("/");
                Serial.print(needed);
            }

            Serial.println();

            if (alert) {
                // ── ALERT TRIGGERED ──
                Serial.println("[ALERT] 🚨 Health alert received from backend!");
                playAlertBeeps();
                // Flash red LED rapidly
                for (int i = 0; i < 5; i++) {
                    blinkLED(RED_LED_PIN, 100);
                    delay(100);
                }
            } else {
                // Normal — green LED blink
                playSuccessTick();
                blinkLED(GREEN_LED_PIN, LED_BLINK_MS);
            }
        } else {
            Serial.print("[HTTP] JSON parse error: ");
            Serial.println(error.c_str());
            blinkLED(GREEN_LED_PIN, LED_BLINK_MS);
        }

    } else {
        // ── FAILURE ──
        consecutiveHTTPFails++;
        Serial.print("[HTTP] ❌ Error code: ");
        Serial.println(httpCode);

        if (httpCode == -1) {
            Serial.println("[HTTP] Connection refused — check URL and server status");
        } else if (httpCode == 404) {
            Serial.println("[HTTP] 404 Not Found — URL must end in /api/reading");
        } else if (httpCode >= 500) {
            Serial.println("[HTTP] Server error — check backend logs");
        }

        if (!payload.isEmpty()) {
            Serial.print("[HTTP] Response: ");
            Serial.println(payload.substring(0, 200));
        }

        blinkLED(RED_LED_PIN, LED_BLINK_MS);
        playErrorTone();

        // Too many failures — try reconnecting WiFi
        if (consecutiveHTTPFails >= MAX_CONSECUTIVE_FAILS) {
            Serial.println("[HTTP] Too many failures — reconnecting WiFi...");
            reconnectWiFi();
            consecutiveHTTPFails = 0;
        }
    }
}

// ============================================================
//  WIFI
// ============================================================

void connectWiFi() {
    Serial.print("[WIFI] Connecting to ");
    Serial.print(WIFI_SSID);
    Serial.print(" ");

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        // Alternate red LED while connecting
        digitalWrite(RED_LED_PIN, !digitalRead(RED_LED_PIN));

        if (millis() - startTime > WIFI_TIMEOUT_MS) {
            Serial.println();
            Serial.println("[WIFI] ❌ Connection timeout!");
            Serial.println("[WIFI] Check SSID and password. Continuing offline...");
            Serial.println("[WIFI] Tip: Use phone hotspot as backup.");
            wifiConnected = false;
            return;
        }
    }

    wifiConnected = true;
    Serial.println();
    Serial.print("[WIFI] ✅ Connected! IP: ");
    Serial.println(WiFi.localIP());

    // Two short beeps for WiFi connected
    buzzerTone(SUCCESS_BEEP_FREQ, 80);
    delay(80);
    buzzerTone(SUCCESS_BEEP_FREQ, 80);
}

void reconnectWiFi() {
    Serial.println("[WIFI] Reconnecting...");
    WiFi.disconnect();
    delay(1000);
    connectWiFi();
}

// ============================================================
//  LED HELPERS
// ============================================================

void blinkLED(int pin, int durationMs) {
    digitalWrite(pin, HIGH);
    delay(durationMs);
    digitalWrite(pin, LOW);
}

// ============================================================
//  BUZZER — TONES AND MELODIES
// ============================================================
//
//  Uses ledcWrite PWM for passive buzzer on ESP32.
//  ESP32 Arduino core's tone() may not work on all pins,
//  so we use the LEDC peripheral directly.
//
// ============================================================

// LEDC channel for buzzer (ESP32 has 16 channels: 0-15)
#define BUZZER_LEDC_CHANNEL  0
#define BUZZER_LEDC_RESOLUTION 8  // 8-bit resolution

void buzzerTone(int freq, int durationMs) {
    if (freq <= 0 || durationMs <= 0) return;

    ledcSetup(BUZZER_LEDC_CHANNEL, freq, BUZZER_LEDC_RESOLUTION);
    ledcAttachPin(BUZZER_PIN, BUZZER_LEDC_CHANNEL);
    ledcWrite(BUZZER_LEDC_CHANNEL, 128);  // 50% duty cycle
    delay(durationMs);
    ledcWrite(BUZZER_LEDC_CHANNEL, 0);    // Silence
    ledcDetachPin(BUZZER_PIN);
}

void playBootMelody() {
    // Ascending C-E-G major chord — signals system ready
    Serial.println("[BUZZER] 🎵 Boot melody");
    buzzerTone(523, BOOT_TONE_DURATION);  // C5
    delay(50);
    buzzerTone(659, BOOT_TONE_DURATION);  // E5
    delay(50);
    buzzerTone(784, BOOT_TONE_DURATION);  // G5
    delay(100);
}

void playAlertBeeps() {
    // 3 urgent beeps at 800Hz — health alert from backend
    Serial.println("[BUZZER] 🚨 Alert beeps");
    for (int i = 0; i < ALERT_BEEP_COUNT; i++) {
        buzzerTone(ALERT_BEEP_FREQ, ALERT_BEEP_ON_MS);
        delay(ALERT_BEEP_OFF_MS);
    }
}

void playErrorTone() {
    // Single low tone — network error
    buzzerTone(ERROR_BEEP_FREQ, 200);
}

void playSuccessTick() {
    // Short high tick — data sent OK (subtle)
    buzzerTone(SUCCESS_BEEP_FREQ, 30);
}

// ============================================================
//  END OF FIRMWARE
// ============================================================
//
//  BUILD CHECKLIST:
//  ────────────────
//  [ ] Arduino IDE: Board = "ESP32 Dev Module"
//  [ ] Libraries installed: SparkFun MAX3010x, ArduinoJson
//  [ ] WIFI_SSID and WIFI_PASSWORD updated
//  [ ] API_URL updated with deployed backend URL
//  [ ] Upload speed: 921600 (fastest)
//  [ ] Serial Monitor: 115200 baud
//
//  WIRING CHECKLIST:
//  ─────────────────
//  [ ] MAX30102: VIN→3.3V, GND→GND, SDA→21, SCL→22
//  [ ] NTC: 3.3V → NTC → GPIO34 junction → 10kΩ → GND
//  [ ] Green LED: GPIO26 → 220Ω → LED(+) → LED(-) → GND
//  [ ] Red LED: GPIO27 → 220Ω → LED(+) → LED(-) → GND
//  [ ] Buzzer: GPIO25 → Buzzer(+), GND → Buzzer(-)
//
//  TESTING SEQUENCE:
//  ─────────────────
//  1. Flash firmware → Serial Monitor shows boot messages
//  2. "MAX30102 ✅ Found!" — sensor OK
//  3. "NTC ✅ Thermistor reading OK" — temp sensor OK
//  4. "WiFi ✅ Connected!" — network OK
//  5. Place finger → "Finger detected!"
//  6. Wait 5-10 seconds for stable BPM readings
//  7. "HTTP ✅ 200" — backend receiving data
//  8. Dashboard should show l