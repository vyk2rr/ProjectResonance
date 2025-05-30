import './pianobase.css';
import * as Tone from "tone";
import React, { useState } from "react";

type PianoBaseProps = {
  createSynth?: () => Tone.Synth | Tone.DuoSynth;
};

export function PianoBase({ createSynth }: PianoBaseProps) {
  const synthRef = React.useRef<Tone.Synth | Tone.DuoSynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  React.useEffect(() => {
    const synth = createSynth
      ? createSynth()
      : new Tone.Synth().toDestination(); // synth por defecto
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

  return (
    <div>
      <button onClick={() => playChord(["C4", "E4", "G4"])}>Play C major chord</button>
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