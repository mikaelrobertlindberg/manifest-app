<CsoundSynthesizer>
<CsOptions>
-o success-c-chord-ultra.wav
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 64
nchnls = 1
0dbfs = 1

; Piano/harp-like C major chord
instr 1
    istart = p2
    idur = p3
    ifreq = p4
    iamp = p5
    ipan = p6
    
    ; Natural attack med subtle random timing
    kattack randi 0.03, 1.5, 0.1
    kenv expseg 0.001, 0.05+kattack, iamp, idur-1.2, iamp*0.1, 1.1, 0.001
    
    ; Subtle pitch variations (string tuning imperfections)
    kpitch randi 1.5, 0.2, ifreq
    
    ; String physical modeling med harmonic series
    aplk pluck iamp*0.7, ifreq+kpitch, ifreq, 0, 1, 0.1, 0.05
    
    ; String resonance och sympathetic vibrations
    acomb1 comb aplk, 0.4, 1.0/ifreq
    acomb2 comb aplk, 0.2, 1.0/(ifreq*2)
    
    ; Body resonance (sound board simulation)
    ares1 reson aplk, ifreq*0.8, ifreq*0.1
    ares2 reson aplk, ifreq*1.6, ifreq*0.15
    
    amix = aplk + acomb1*0.3 + acomb2*0.2 + ares1*0.1 + ares2*0.1
    
    ; Natural room ambience
    arev reverb amix, 2.8
    
    ; Smooth fade envelope
    kfade linen 1, 0.4, idur, 1.0
    
    out (amix + arev*0.35) * kenv * kfade
endin
</CsInstruments>
<CsScore>
; Ultra-natural C major chord med perfect timing spreads
i1 0.0  4.5  261.63  0.8  0.5  ; C4
i1 0.05 4.4  329.63  0.7  0.3  ; E4 (slightly delayed)
i1 0.12 4.3  392.00  0.6  0.7  ; G4 (more delayed)  
i1 0.20 4.2  523.25  0.5  0.1  ; C5 (most delayed)
e
</CsScore>
</CsoundSynthesizer>
