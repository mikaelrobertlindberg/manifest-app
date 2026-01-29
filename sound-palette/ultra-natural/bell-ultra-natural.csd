<CsoundSynthesizer>
<CsOptions>
-o reminder-bell-ultra.wav
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 64
nchnls = 1
0dbfs = 1

instr 1
    ; Ultra-realistic bell med micro-variations
    ifreq = 523.25
    
    ; Natural attack envelope med subtle random
    kattack randi 0.02, 2, 0.5
    kenv expseg 0.001, 0.1+kattack, 1, 1.8, 0.001
    
    ; Pitch micro-variations som äkta klocka
    kpitch randi 2, 0.3, ifreq
    
    ; Physical bell harmonics (naturliga proportioner)
    a1 oscil 0.4, ifreq+kpitch, 1          ; Fundamental
    a2 oscil 0.15, ifreq*2.76+kpitch, 1    ; Major sixth
    a3 oscil 0.08, ifreq*5.04+kpitch, 1    ; Minor third 
    a4 oscil 0.04, ifreq*6.99+kpitch, 1    ; Minor seventh
    a5 oscil 0.02, ifreq*9.56+kpitch, 1    ; Major second
    
    ; Metallic resonance simulation
    amix = a1 + a2 + a3 + a4 + a5
    
    ; Multiple resonant filters (bell cavity resonance)
    afilt1 reson amix, ifreq*1.2, ifreq*0.05
    afilt2 reson amix, ifreq*3.8, ifreq*0.03
    acomb = afilt1 + afilt2*0.3
    
    ; Natural reverb (cathedral-like)
    arev1 reverb acomb, 3.2
    arev2 reverb acomb, 1.8
    
    ; Gentle fade in/out
    kfade linen 1, 0.3, p3, 0.8
    
    out (acomb + arev1*0.4 + arev2*0.2) * kenv * kfade * 0.6
endin
</CsInstruments>
<CsScore>
f1 0 8192 10 1 0.5 0.3 0.25 0.2 0.166 0.14 0.125
i1 0 3.5
e
</CsScore>
</CsoundSynthesizer>
