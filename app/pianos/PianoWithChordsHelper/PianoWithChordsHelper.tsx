import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps } from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsHelper.css";

type PianoWithChordsHelperProps = PianoBaseProps & {
  chord: string[];
}

export default function PianoWithChordsHelper({ chord }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [selectedChordId, setSelectedChordId] = useState<string>("");

  const handleChordClick = (chord: ChordType) => {
    setCurrentChord(chord.notes);
    setSelectedChordId(chord.id);
  };

  const playNote = (note: string) => {
    setCurrentNote(note);
    setCurrentChord([note]);
  }

  const chords: ChordType[] = [
    { id: "cmaj", name: "C major: C E G", notes: ["C4", "E4", "G4"] },
    { id: "cmin", name: "C minor (m): C D G", notes: ["C4", "D#4", "G4"] },
    { id: "cdim", name: "C diminished (dim): C D# F#", notes: ["C4", "D#4", "F#4"] },
    { id: "caug", name: "C augmented (aug): C E G#", notes: ["C4", "E4", "G#4"] },
    { id: "cmaj7", name: "C major seventh (maj7): C E G B", notes: ["C4", "E4", "G4", "B4"] },
    { id: "cmin7", name: "C minor seventh (m7): C D# G A#", notes: ["C4", "D#4", "G4", "A#4"] },
    { id: "cdom7", name: "C dominant seventh (7): C E G A#", notes: ["C4", "E4", "G4", "A#4"] },
    { id: "cmaj9", name: "C major ninth (maj9): C E G B D", notes: ["C4", "E4", "G4", "B4", "D5"] }
  ];

  return (
    <>
      <PianoBase showChordOnThePiano={currentChord} />

      <ul className="chord-list">
        {chords.map(chord => (
          <li key={chord.id}>
            <button
              onClick={() => handleChordClick(chord)}
              className={selectedChordId === chord.id ? 'chord-button selected' : 'chord-button'}
            >
              {chord.name}
            </button>
          </li>
        ))}
      </ul>

      {/* falta tonos inversiones */}
    </>
  );
}