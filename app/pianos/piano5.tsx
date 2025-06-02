import * as Tone from "tone";
import { PianoBase } from "../pianobase/pianobase";

export function PianoOption5() {
  return (
    <>
      <PianoBase
        octaves={1}
        createSynth={() => {
          const synth = new Tone.FMSynth({
            harmonicity: 8,
            modulationIndex: 2.5,
            oscillator: { type: "sine" },
            envelope: { attack: 1.2, decay: 0.2, sustain: 0.8, release: 4 },
            modulation: { type: "triangle" },
            modulationEnvelope: { attack: 0.5, decay: 0.1, sustain: 1, release: 2 }
          });
          // Mucho reverb para resonancia
          const reverb = new Tone.Reverb({ decay: 8, wet: 0.8 }).toDestination();
          // Chorus muy suave para darle “ancho”
          const chorus = new Tone.Chorus(0.8, 2.5, 0.2).start();

          synth.connect(chorus);
          chorus.connect(reverb);
          return synth;
        }}
      />
    </>
  );
}