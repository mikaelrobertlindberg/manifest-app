<CsoundSynthesizer>
<CsOptions>
-o success-piano-ultra.wav
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 64
nchnls = 1
0dbfs = 1

instr 1
    istart = p2
    idur = p3  
    ifreq = p4
    ivel = p5
    
    ; Piano hammer velocity -> dynamics
    iamp = ivel / 127
    kenv expseg 0.001, 0.02, iamp, 0.3, iamp*0.7, idur-1.5, iamp*0.01, 1.1, 0.001
    
    ; Piano string modeling med detune för chorus-effekt
    idetune1 = ifreq * 1.002
    idetune2 = ifreq * 0.998
    idetune3 = ifreq * 1.001
    
    ; Multiple string simulation (grand piano har 2-3 strängar per ton)
    ap1 pluck iamp*0.4, idetune1, idetune1, 0, 1, 0.1, 0.1
    ap2 pluck iamp*0.4, idetune2, idetune2, 0, 1, 0.1, 0.1  
    ap3 pluck iamp*0.3, idetune3, idetune3, 0, 1, 0.1, 0.1
    
    ; String coupling (sympathetic resonance)
    acoup1 comb ap1, 0.15, 1.0/idetune2
    acoup2 comb ap2, 0.15, 1.0/idetune1
    
    ; Soundboard resonance filters
    asb1 reson (ap1+ap2+ap3), ifreq*0.7, ifreq*0.2
    asb2 reson (ap1+ap2+ap3), ifreq*1.8, ifreq*0.1
    
    amix = (ap1 + ap2 + ap3 + acoup1*0.3 + acoup2*0.3 + asb1*0.1 + asb2*0.1)
    
    ; Piano sustain pedal resonance
    asust reverb amix, 1.5
    
    ; Natural room acoustic  
    aroom reverb amix, 3.5
    
    ; Gentle fade in/out
    kfade linen 1, 0.5, idur, 1.2
    
    out (amix + asust*0.2 + aroom*0.15) * kenv * kfade * 0.7
endin
</CsInstruments>
<CsScore>
; Realistic piano C major chord med human timing
i1 0.00 5.0 261.63 85   ; C4 - strong
i1 0.08 4.9 329.63 78   ; E4 - slightly softer  
i1 0.15 4.8 392.00 72   ; G4 - softer
i1 0.25 4.7 523.25 68   ; C5 - softest
e
</CsScore>
</CsoundSynthesizer>
