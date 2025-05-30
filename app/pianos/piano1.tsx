import * as Tone from "tone";
import { PianoBase } from "../pianobase/pianobase";

export function PianoOption1() {
  return (
    <>
      <PianoBase
        createSynth={() => {
          const synth = new Tone.DuoSynth({
            vibratoAmount: 0.1,
            vibratoRate: 5,
            harmonicity: 1.2,
            voice0: {
              oscillator: { type: "triangle" },
              envelope: { attack: 0.005, decay: 0.08, sustain: 0.15, release: 0.25 }
            },
            voice1: {
              oscillator: { type: "sine" },
              envelope: { attack: 0.005, decay: 0.09, sustain: 0.1, release: 0.22 }
            }
          });
          const chorus = new Tone.Chorus(4, 2.5, 0.5).start();
          const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
          synth.connect(chorus);
          chorus.connect(reverb);
          return synth;
        }}
      />
    </>
  );
}