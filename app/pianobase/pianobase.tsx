import './pianobase.css';
import * as Tone from "tone";
import React, { useState } from "react";
import { Button } from "@radix-ui/themes";

type PianoBaseProps = {
  createSynth?: () => Tone.Synth | Tone.DuoSynth;
};

export function PianoBase({ createSynth }: PianoBaseProps) {
  const synthRef = React.useRef<Tone.Synth | Tone.DuoSynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

React.useEffect(() => {
  const synth = createSynth
    ? createSynth()
    : new Tone.PolySynth(Tone.Synth).toDestination(); // synth polifónico por defecto
  synthRef.current = synth;
  return () => synth.dispose();
}, [createSynth]);

  const playNote = (note: string) => {
    setActiveNotes([note]);
    synthRef.current?.triggerAttackRelease(note, "8n");
    setTimeout(() => setActiveNotes([]), 180);
  };

  const playChord = (notes: string[]) => {
    setActiveNotes(notes);
    notes.forEach(note => synthRef.current?.triggerAttackRelease(note, "8n"));
    setTimeout(() => setActiveNotes([]), 180);
  };
  
  const playSequence = (notes: string[], delay = 200) => {
  setActiveNotes(notes);
  notes.forEach((note, i) => {
    setTimeout(() => {
      synthRef.current?.triggerAttackRelease(note, "8n");
      setActiveNotes([note]);
    }, i * delay);
  });
  setTimeout(() => setActiveNotes([]), notes.length * delay + 180);
};

  return (
    <div>
      <Button onClick={() => playSequence(["D4", "A4", "F#4", "A4", "D5"])} variant='classic' color='orange'>Play D major</Button>
      {/* <Button onClick={() => playSequence(["E4", "B4", "F#4", "B4", "E5"])}>Play E minor</Button>
      <Button onClick={() => playSequence(["F#4", "A4", "C#5", "A4", "F#5"])}>Play F# minor</Button>
      <Button onClick={() => playSequence(["G4", "B4", "D5", "B4", "G4"])}>Play Gmajor</Button>
      <Button onClick={() => playSequence(["A4", "C#5", "E5", "C#5", "A4"])}>Play Amajor</Button>
      <Button onClick={() => playSequence(["B4", "D5", "F#5", "D5", "B4"])}>Play Bmin</Button>
      <Button onClick={() => playSequence(["C5", "D#5", "F#5", "D#5", "C5"])}>Play Cdim</Button> */}
      
      <div className="piano">
        <div className="white-keys">
          {["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"].map(note => (
            <div
              key={note}
              className={`white-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
            />
          ))}
        </div>
        <div className="black-keys">
          {["C#4", "D#4", "F#4", "G#4", "A#4"].map(note => (
            <div
              key={note}
              className={`black-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
              style={{ pointerEvents: "auto" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}