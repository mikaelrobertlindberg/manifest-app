<CsoundSynthesizer>
<CsOptions>
-o reminder-bell-ultra.wav
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 128
nchnls = 1
0dbfs = 1

instr 1
    ; Enkel but natural bell
    ifreq = 523.25
    kenv linseg 0, 0.1, 1, 1.5, 0.5, 1.0, 0
    
    ; Bell harmonics
    a1 oscili 0.4, ifreq, 1
    a2 oscili 0.15, ifreq*2.76, 1  
    a3 oscili 0.08, ifreq*5.04, 1
    
    amix = a1 + a2 + a3
    arev reverb amix, 2.5
    
    out (amix + arev*0.4) * kenv * 0.6
endin
</CsInstruments>
<CsScore>
f1 0 8192 10 1
i1 0 3.0
e
</CsScore>
</CsoundSynthesizer>
