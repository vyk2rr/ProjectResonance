import * as Tone from "tone";
import { PianoBase } from "../pianobase/pianobase";

export function PianoUkulele() {
  return (
    <>
      <PianoBase
        createSynth={() => {
          return new Tone.PluckSynth({
            attackNoise: 1.2, // más percusivo
            dampening: 4000,  // más brillante
            resonance: 0.98,  // más sustain
          }).toDestination();
        }}
      />
    </>
  );
}