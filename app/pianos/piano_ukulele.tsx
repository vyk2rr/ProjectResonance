import * as Tone from "tone";
import PianoBase from "../pianobase/pianobase";
import type { PianoBaseProps, chordMapType } from "../pianobase/pianobase.types";

export function PianoUkulele({ chordMap, octaves = 1 }: PianoBaseProps) {
  return (
    <>
      <PianoBase
        octaves={1}
        createSynth={() => {
          return new Tone.PluckSynth({
            attackNoise: 1.2, // más percusivo
            dampening: 4000,  // más brillante
            resonance: 0.98,  // más sustain
          }).toDestination();
        }}

        chordMap={{
          Dmaj_4: ["G4", "C4", "E4", "C5"],
          Emin_4: ["G4", "E4", "G4", "B4"],
          Gbmin_4: ["G4", "D4", "G4", "B4"],
          Gmaj_4: ["G4", "D4", "B3", "G3"],
          // Amaj_4: ["A4", "E5", "C#6", "E6", "A6"],
          // Bmin_4: ["B4", "F#5", "D6", "F#6", "B6"],
          // Cdim_4: ["C#5", "G5", "E6", "G6", "C#7"],

          // Dmaj_5: ["D5", "A5", "F#6", "A6", "D7"],
        }}
      />
    </>
  );
}