# 🌱 NATURLIGA LJUD - MANIFEST APP

## Mikes önskemål: 
**"Mer naturtrogna ljud, vad finns det då? Gå igenom listan och gör fler ljud!"**

---

## 🔔 NATURLIGA REMINDER CHIMES (7 varianter)

### 🥁 **MARIMBA** - Träklockspel (CSOUND fysikalisk modell)
- **Fil:** `csound/reminder-marimba-v1.m4a`
- **Känsla:** Varm träinstrument med naturlig resonans
- **Teknik:** Prepiano-algoritm för realistisk träklang

### 🎎 **TIBETAN BOWL** - Klangskål (CSOUND overtoner) 
- **Fil:** `csound/reminder-bowl-v1.m4a`
- **Känsla:** Mediativ metallklang med naturliga harmonier
- **Teknik:** Multipla resonansfrekvenser (2.76x, 5.4x, 8.9x grundton)

### 🪘 **KALIMBA** - Thumb Piano (CSOUND pluck-modell)
- **Fil:** `csound/reminder-kalimba-v1.m4a` 
- **Känsla:** Afrikansk lamellofon med mjuk metallresonans
- **Teknik:** Pluck-algoritm + comb-filter för metallisk efterklang

### 🌊 **OCEAN WAVE** - Havsvåg (SOX naturligt brus)
- **Fil:** `sox/reminder-ocean-v1.m4a`
- **Känsla:** Lugnande vågrörelser, perfekt för mindfulness
- **Teknik:** Brown noise + bandfilter + tremolo för våg-simulation

### 🐦 **BIRD CHIRP** - Fågelkvitter (SOX organisk tremolo)
- **Fil:** `sox/reminder-bird-v1.m4a`
- **Känsla:** Lätt och vänligt som morgonfåglar  
- **Teknik:** Multipla sine-vågor + snabb tremolo för chirping

### 🪵 **WOODEN BLOCK** - Träblock (SOX naturlig attack)
- **Fil:** `sox/reminder-wood-v1.m4a`
- **Känsla:** Varm träklang, enkelt men organiskt
- **Teknik:** Square-våg + bandfilter för träig timbre

### 🏞️ **FOREST STREAM** - Porlande bäck (CSOUND random)
- **Fil:** `csound/reminder-stream-v1.m4a`  
- **Känsla:** Lugnt vattenljud med naturlig variation
- **Teknik:** Noise + random modulation + multipla bandfilter

---

## ✨ NATURLIGA SUCCESS HARMONIES (4 varianter)

### 🎐 **WIND CHIMES** - Vindspel (CSOUND metallrör)
- **Fil:** `csound/success-windchimes-v1.m4a`
- **Känsla:** Pentatonisk sekvens som äkta vindspel
- **Teknik:** C-pentatonisk + inharmoniska overtoner + lång reverb

### 🪕 **HARP GLISSANDO** - Harpa (CSOUND string-modell)
- **Fil:** `csound/success-harp-v1.m4a`
- **Känsla:** Eleganta arpeggio som klassisk harpa
- **Teknik:** Pluck-modell + comb-resonans för strängkaraktär

### 🔮 **CRYSTAL BELL** - Kristallskål (CSOUND harmonisk serie)
- **Fil:** `csound/success-crystal-v1.m4a`
- **Känsla:** Naturliga harmonier som kristallskål
- **Teknik:** Fullständig harmonisk serie (1x-6x grundton) + lång sustain

### 🌧️ **RAIN DROPS** - Regndroppar (SOX ambient)
- **Fil:** `sox/success-rain-v1.m4a`
- **Känsla:** Mjukt regn som skapar lugn stämning  
- **Teknik:** Noise + tremolo + reverb för droppsimulation

---

## 📊 JÄMFÖRELSE: Naturliga vs Digitala

### 🌱 NATURLIGA FÖRDELAR:
- **Organiska overtoner** istället för rena sinustoner
- **Fysikalisk modellering** av verkliga instrument  
- **Random variation** som imiterar naturens oregelbundenhet
- **Mjuka attack/decay** som instrumentens naturliga beteende
- **Komplexare timbre** med realistiska resonanser

### 📱 DIGITALA KÄNNETECKEN:
- Perfekta matematiska förhållanden
- Statiska, repeterbara ljud
- Skarpa attack/release
- Rena frekvenser utan "färgning"
- MIDI/synth-karaktär

---

## 🎯 REKOMMENDERADE KOMBINATIONER:

### 🧘 **MINDFULNESS-PAKET:**
- Reminder: Ocean Wave 🌊
- Success: Rain Drops 🌧️

### 🌍 **WORLD-MUSIC-PAKET:**  
- Reminder: Kalimba 🪘
- Success: Wind Chimes 🎐

### 🏛️ **KLASSISKT-PAKET:**
- Reminder: Tibetan Bowl 🎎  
- Success: Harp Glissando 🪕

### 🌲 **NATUR-PAKET:**
- Reminder: Forest Stream 🏞️
- Success: Crystal Bell 🔮

---

## 🔧 Teknisk Implementation:
- **Format:** M4A (React Native-kompatibel)
- **Sample Rate:** 44.1kHz  
- **Channels:** Mono (mindre filstorlek)
- **Duration:** 1.2-5.0 sekunder beroende på ljud
- **Volume:** Balanserat för mobil-användning

**🌐 Lyssna på alla:** http://192.168.1.224:8084/sound-palette.html