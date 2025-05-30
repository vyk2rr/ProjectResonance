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

  const chordMap: Record<string, string[]> = {
    Dmaj: ["D4", "A4", "F#5", "A5", "D6"],
    Emin: ["E4", "B4", "G5", "B5", "E6"],
    Abmin: ["F#4", "C#5", "A5", "C#6", "F#6"],
    Gmaj: ["G4", "D5", "B5", "D6", "G6"],
    Amaj: ["A4", "E5", "C#6", "E6", "A6"],
    Bmin: ["B4", "F#5", "D6", "F#6", "B6"],
    Cdim: ["C#5", "G5", "E6", "G6", "C#7"],
  };

  const playSequence = (notesOrName: string[] | string, delay = 200) => {
    const notes = Array.isArray(notesOrName)
      ? notesOrName
      : chordMap[notesOrName] || [];

    if (notes.length === 0) return;

    setActiveNotes(notes);
    playChord(notes);

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
      <Button onClick={() => playSequence("Dmaj")} variant='classic' color='orange'>Play D major</Button>
      <Button onClick={() => playSequence("Emin")} variant='classic' color='yellow'>Play E minor</Button>
      <Button onClick={() => playSequence("Abmin")} variant='classic' color='green'>Play F# minor</Button>
      <Button onClick={() => playSequence("Gmaj")} variant='classic' color='blue'>Play G major</Button>
      <Button onClick={() => playSequence("Amaj")} variant='classic' color='indigo'>Play A major</Button>
      <Button onClick={() => playSequence("Bmin")} variant='classic' color='purple'>Play B minor</Button>
      <Button onClick={() => playSequence("Cdim")} variant='classic' color='red'>Play C diminished</Button>


      <div className="piano">
        <div className="white-keys">
          {[
            "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5",
            "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6"
          ].map(note => (
            <div
              key={note}
              className={`white-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
            />
          ))}
        </div>
        <div className="black-keys">
          {[
            "C#4", "D#4", "F#4", "G#4", "A#4",
            "C#5", "D#5", "F#5", "G#5", "A#5",
            "C#6"
          ].map(note => (
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