import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps, OctaveRangeType } from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsHelper.css";

type PianoWithChordsHelperProps = PianoBaseProps & {
  chord: string[],
  octaves: OctaveRangeType
}

export default function PianoWithChordsHelper({ chord, octaves = 2}: PianoWithChordsHelperProps) {
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
    { id: "cmaj_first", name: "C major (1st inversion): E G C", notes: ["E4", "G4", "C5"] },
    { id: "cmaj_second", name: "C major (2nd inversion): G E C", notes: ["G4", "C5", "E5"] },

    { id: "cmin", name: "C minor (m): C D# G", notes: ["C4", "D#4", "G4"] },
    { id: "cmin_first", name: "C minor (m) (1st inversion): D# G C", notes: ["D#4", "G4", "C5"] },
    { id: "cmin_second", name: "C minor (m) (2nd inversion): G C D", notes: ["G4", "C5", "D#5"] },

    { id: "cdim", name: "C diminished (dim): C D# F#", notes: ["C4", "D#4", "F#4"] },
    { id: "cdim_first", name: "C diminished (dim) (1st inversion): D# F# C", notes: ["D#4", "F#4", "C5"] },
    { id: "cdim_second", name: "C diminished (dim) (2nd inversion): F# C D", notes: ["F#4", "C5", "D#5"] },

    { id: "caug", name: "C augmented (aug): C E G#", notes: ["C4", "E4", "G#4"] },
    { id: "caug_first", name: "C augmented (aug) (1st inversion): E G# C", notes: ["E4", "G#4", "C5"] },
    { id: "caug_second", name: "C augmented (aug) (2nd inversion): G# C E", notes: ["G#4", "C5", "E5"] },

    { id: "cmaj7", name: "C major seventh (maj7): C E G B", notes: ["C4", "E4", "G4", "B4"] },
    { id: "cmin7", name: "C minor seventh (m7): C D# G A#", notes: ["C4", "D#4", "G4", "A#4"] },
    { id: "cdom7", name: "C dominant seventh (7): C E G A#", notes: ["C4", "E4", "G4", "A#4"] },
    { id: "cmaj9", name: "C major ninth (maj9): C E G B D", notes: ["C4", "E4", "G4", "B4", "D5"] }
  ];

  return (
    <>
      <PianoBase octaves={octaves} showChordOnThePiano={currentChord} />

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