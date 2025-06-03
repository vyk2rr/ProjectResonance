import * as Tone from "tone";
import PianoBase from "../pianobase/PianoBase";
import type { PianoBaseProps } from "../pianobase/PianoBase.types";

export function PianoOption3({ chordMap, octaves = 1 }: PianoBaseProps) {
  return (
    <>
      <PianoBase
        chordMap={chordMap}
        octaves={octaves}
        createSynth={() => {
          const synth = new Tone.DuoSynth({
            vibratoAmount: 0.7,
            vibratoRate: 6,
            harmonicity: 1.5,
            voice0: {
              oscillator: { type: "square" },
              envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.8 }
            },
            voice1: {
              oscillator: { type: "triangle" },
              envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8 }
            }
          });
          // Chorus para efecto espacial
          const chorus = new Tone.Chorus(4, 2.5, 0.5).start();
          // Reverb para profundidad
          const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();

          synth.connect(chorus);
          chorus.connect(reverb);

          return synth;
        }}
      />
    </>
  );
}