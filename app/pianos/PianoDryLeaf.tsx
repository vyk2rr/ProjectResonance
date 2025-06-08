import * as Tone from "tone";
import PianoBase from "../PianoBase/PianoBase";
import type { PianoBaseProps } from "../PianoBase/PianoBase";

interface PianoDryLeafProps extends PianoBaseProps {
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
          const reverb = new Tone.Reverb({ decay: 3.5, wet: 0.35 }).toDestination();
          gain.connect(reverb);

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
              reverb.dispose();
            }
          } as Tone.PolySynth;
        }}
      />
    </>
  );
}