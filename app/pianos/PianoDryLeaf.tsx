import React from "react";
import PianoBase from "../PianoBase/PianoBase";
import type { PianoBaseProps } from "../PianoBase/PianoBase";
import * as Tone from "tone"; 

interface PianoDryLeafProps extends PianoBaseProps {
  id?: string;
  showDescription?: boolean;
};

export function PianoDryLeaf({ showDescription = false, ...props }: PianoDryLeafProps) {
  return (
    <>
      {showDescription ? <span>Piano crujiente como pisando hojas secas en otoño</span> : null}
      <PianoBase
        {...props}
        createSynth={() => {
          // PolySynth con el mismo tipo de voz
          const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.005, decay: 0.18, sustain: 0.05, release: 0.5 }
          });

          // Un poco de ruido para el toque de aire
          const noise = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }
          });

          // Mezcla ambos en un canal
          const gain = new Tone.Gain(0.25);
          synth.connect(gain);
          noise.connect(gain);

          // Reverb para ambiente etéreo
          // 1. Create the Reverb instance
          const reverbInstance = new Tone.Reverb({ decay: 3.5, wet: 0.35 });
          // 2. Connect the gain to the Reverb instance
          gain.connect(reverbInstance);
          // 3. Connect the Reverb instance to the destination
          reverbInstance.toDestination(); 

          // Devuelve un objeto compatible con PianoBase
          return {
            triggerAttackRelease(note: string | string[], duration: string | number) {
              synth.triggerAttackRelease(note, duration);
              // Opcional: aleatoriza el volumen del ruido para más realismo
              noise.volume.value = -10 + Math.random() * 6;
              noise.triggerAttackRelease(duration);
            },
            dispose() {
              synth.dispose();
              noise.dispose();
              gain.dispose();
              reverbInstance.dispose(); // Call dispose on the actual Reverb instance
            }
          } as Tone.PolySynth;
        }}
      />
    </>
  );
}