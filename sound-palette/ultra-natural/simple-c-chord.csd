<CsoundSynthesizer>
<CsOptions>
-o success-c-chord-ultra.wav  
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 128
nchnls = 1
0dbfs = 1

instr 1
    ifreq = p4
    iamp = p5
    
    kenv linseg 0, 0.3, iamp, 2.0, iamp*0.3, 2.0, 0
    
    ; Piano-like pluck
    aplk pluck iamp*0.8, ifreq, ifreq, 0, 1
    arev reverb aplk, 2.0
    
    out (aplk + arev*0.3) * kenv
endin
</CsInstruments>
<CsScore>
; Natural C major chord timing
i1 0.0 4.5 261.63 0.8
i1 0.1 4.4 329.63 0.7  
i1 0.2 4.3 392.00 0.6
i1 0.3 4.2 523.25 0.5
e
</CsScore>
</CsoundSynthesizer>
