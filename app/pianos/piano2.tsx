import * as Tone from "tone";
import { PianoBase } from "../pianobase/pianobase";

export function PianoOption2() {
  return (
    <>
      <h3>Piano2: espacial con eco y profundidad envolvente</h3>
      <PianoBase
        createSynth={() => {
          const synth = new Tone.DuoSynth({
            vibratoAmount: 0.7,
            vibratoRate: 6,
            harmonicity: 1.1,
            voice0: {
              oscillator: { type: "sine" },
              envelope: { attack: 0.03, decay: 0.2, sustain: 0.5, release: 1.5 }
            },
            voice1: {
              oscillator: { type: "triangle" },
              envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8 }
            }
          });
          // Chorus para efecto espacial
          const chorus = new Tone.Chorus({
            frequency: 0.8,
            delayTime: 4,
            depth: 0.8,
            feedback: 0.3,
            type: "sine",
            wet: 0.5
          }).start();

          const autoFilter = new Tone.AutoFilter("0.1n").start().toDestination();
          synth.connect(autoFilter);

          // Reverb para profundidad
          const reverb = new Tone.Reverb({ decay: 6, wet: 0.6 }).toDestination();

          const delay = new Tone.PingPongDelay("8n", 0.4);
          delay.wet.value = 0.4;
          chorus.connect(delay);
          delay.connect(reverb);

          synth.connect(chorus);
          chorus.connect(reverb);

          return synth;
        }}
      />
    </>
  );
}