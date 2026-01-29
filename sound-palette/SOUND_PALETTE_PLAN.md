# 🎵 SOUND PALETTE PLAN - Manifest App

## Målsättning:
Skapa flera alternativ för varje ljud så Mike kan välja vilka som låter bäst.

## Ljud att skapa:

### 1. 🔔 Reminder Chime (påminnelser)
**Mål:** Mjuk, diskret påminnelse som inte skrämmer

### 2. ✨ Success Harmony (sparad tacksamhet)
**Mål:** Positiv, upplyftande bekräftelse

## Verktyg & Varianter:

### 📦 SOX (Harmoniska systemljud)
**Styrkor:** Snabbt, direkta toner, bra för systemljud
- Variant 1: Enkel C5 med reverb
- Variant 2: C-dur triad med fade
- Variant 3: Pentatonisk sekvens
- Variant 4: Mjuk bell-simulation

### 🎼 CSOUND (Proffsyntes)
**Styrkor:** Avancerad ljudsyntes, mycket kontroll
- Variant 1: FM-synthesis bell
- Variant 2: Subtractive synthesis pad  
- Variant 3: Physical modeling bell
- Variant 4: Granular texture

### 🎹 FLUIDSYNTH (MIDI Soundfonts)
**Styrkor:** Realistiska instrument, rika harmonier
- Variant 1: Piano C-dur ackord
- Variant 2: Marimba/bell resonans
- Variant 3: Harp arpeggios  
- Variant 4: Soft strings pad

### 🎯 TIMIDITY++ (MIDI Simple)
**Styrkor:** Enkelt, förutsägbart, lätt att justera
- Variant 1: GM Bell sound
- Variant 2: GM Piano ackord
- Variant 3: GM Marimba
- Variant 4: GM Soft pad

### 💡 BEEP (Minimalistisk)
**Styrkor:** Systemintegrerat, minimalt, snabbt
- Variant 1: Enkelt C5 beep
- Variant 2: Triad-sekvens med beep
- Variant 3: Mjukt modulerat beep

### 🔬 PUREDATA (Modulär)
**Styrkor:** Experimentell, unik, mycket flexibel  
- Variant 1: Oscillator med envelope
- Variant 2: Physical modeling 
- Variant 3: Granular synthesis
- Variant 4: Delay-based resonance

## Output Structure:
```
sound-palette/
├── sox/
│   ├── reminder-chime-v1.m4a ... v4.m4a  
│   └── success-harmony-v1.m4a ... v4.m4a
├── csound/
│   ├── reminder-chime-v1.m4a ... v4.m4a
│   └── success-harmony-v1.m4a ... v4.m4a  
├── fluidsynth/
├── timidity/
├── beep/  
├── puredata/
└── comparison.html (interactive player)
```

## Selection Interface:
- HTML-fil med audio players
- Kategoriserat efter verktyg
- A/B testing mellan versioner
- Mike kan rösta för favoriter