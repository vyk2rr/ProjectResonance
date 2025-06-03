import * as Tone from "tone";
import PianoBase from "../PianoBase/pianobase";
import type { PianoBaseProps } from "../PianoBase/PianoBase.types";

export function PianoOption6({ chordMap, octaves = 1 }: PianoBaseProps) {
  return (
    <>
      <PianoBase 
        chordMap={chordMap}
        octaves={octaves}
        createSynth={() => {
          // Synth melódico tipo campanilla de madera
          const synth = new Tone.Synth({
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
          const reverb = new Tone.Reverb({ decay: 3.5, wet: 0.35 }).toDestination();
          gain.connect(reverb);

          // Devuelve un objeto compatible con PianoBase
          return {
            triggerAttackRelease(note: string, duration: string | number) {
              synth.triggerAttackRelease(note, duration);
              // Opcional: aleatoriza el volumen del ruido para más realismo
              noise.volume.value = -10 + Math.random() * 6;
              noise.triggerAttackRelease(duration);
            },
            dispose() {
              synth.dispose();
              noise.dispose();
              gain.dispose();
              reverb.dispose();
            }
          } as unknown as Tone.Synth;
        }}
      />
    </>
  );
}