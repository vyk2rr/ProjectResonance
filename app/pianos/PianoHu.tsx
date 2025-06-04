import * as Tone from "tone";
import PianoBase from "../PianoBase/pianobase";
import type { PianoBaseProps } from "../PianoBase/PianoBase.types";

type PianoHuProps = PianoBaseProps & {
  showDescription: boolean;
};

export function PianoHu({ chordMap, octaves = 1, showDescription = false }: PianoHuProps) {
  return (
    <>
      {showDescription?<span>Piano tipo "hu"</span>:null}
      <PianoBase
        chordMap={chordMap}
        octaves={octaves}
        createSynth={() => {
          // PolySynth para varias voces
          const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.12, decay: 0.2, sustain: 0.5, release: 0.7 }
          });

          // Filtro para dar forma vocal
          const filter = new Tone.Filter({
            type: "lowpass",
            frequency: 900,
            Q: 1.2
          });

          // Chorus para efecto de varias voces
          const chorus = new Tone.Chorus(2.5, 1.8, 0.5).start();

          // Reverb para ambiente de coro
          const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();

          synth.chain(filter, chorus, reverb);

          return synth;
        }}
      />
    </>
  );
}