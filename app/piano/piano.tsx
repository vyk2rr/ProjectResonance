import './piano.css';
import * as Tone from "tone";
import React, { useState } from "react";

export function Piano() {
  const synthRef = React.useRef<Tone.DuoSynth | null>(null);
  const reverbRef = React.useRef<Tone.Reverb | null>(null);
  const chorusRef = React.useRef<Tone.Chorus | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  React.useEffect(() => {
    // DuoSynth para un sonido digital retro
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

    synthRef.current = synth;
    reverbRef.current = reverb;
    chorusRef.current = chorus;

    return () => {
      synthRef.current?.dispose();
      reverbRef.current?.dispose();
      chorusRef.current?.dispose();
    };
  }, []);

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
          {["C4","D4","E4","F4","G4","A4","B4","C5"].map(note => (
            <div
              key={note}
              className={`white-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
            />
          ))}
        </div>
        <div className="black-keys">
          {["C#4","D#4","F#4","G#4","A#4"].map(note => (
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