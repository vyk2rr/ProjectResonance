import * as Tone from "tone";
import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps, OctaveRangeType, ChordType } from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsCheatsheet.css";

type PianoWithChordsHelperProps = PianoBaseProps & {
  chord: string[],
  octaves: OctaveRangeType
}

export default function PianoWithChordsHelper({ chord, octaves = 2, octave = 4 }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<string[]>([]);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string>("C");
  const [selectedOctave, setSelectedOctave] = useState<string>("4");

  const chordIntervals: Record<ChordType, number[]> = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    maj9: [0, 4, 7, 11, 14],
    m9: [0, 3, 7, 10, 14],
    dom9: [0, 4, 7, 10, 14],
    maj11: [0, 4, 7, 11, 14, 17],
    m11: [0, 3, 7, 10, 14, 17],
    dom11: [0, 4, 7, 10, 14, 17],
    maj13: [0, 4, 7, 11, 14, 17, 21],
    m13: [0, 3, 7, 10, 14, 17, 21],
    dom13: [0, 4, 7, 10, 14, 17, 21],
  };

  const noteOptions = ["C", "D", "E", "F", "G", "A", "B"];
  const octaveOptions = ["1", "2", "3", "4", "5"];

  const handleChordClick = (chord: ChordType) => {
    setCurrentChord(chord.notes);
    setSelectedChordId(chord.id);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const note = event.target.value;
    setSelectedNote(note);
    playNote(note + selectedOctave);
  };

  const handleOctaveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const octave = event.target.value;
    setSelectedOctave(octave);
    playNote(selectedNote + octave);
  };


  const playNote = (note: string) => {
    setCurrentChord([note]);
  }

  function getChord(note: string, type: ChordType): string[] {
    const base = Tone.Frequency(note);
    return chordIntervals[type].map(i => base.transpose(i).toNote());
  }

  function invertChord(notes: string[], inversion: number): string[] {
    const result = [...notes];
    for (let i = 0; i < inversion; i++) {
      const note = result.shift();
      if (note) {
        const octaveUp = Tone.Frequency(note).transpose(12).toNote();
        result.push(octaveUp);
      }
    }
    return result;
  }

  function buildChordInversions(note: string, type: ChordType, inversions: number) {
    const base = getChord(note, type);
    const result = [{ id: `${type}`, name: `${note} ${type} ` + base.join("-"), notes: base }];

    for (let i = 1; i <= inversions; i++) {
      const inverted = invertChord(base, i);
      result.push({
        id: `${type}_inv${i}`,
        name: `${note} ${type} (${i}st inversion) ` + inverted.join("-"),
        notes: inverted
      });
    }

    return result;
  }

  const chordNote = selectedNote + selectedOctave;

  const chords = [
    ...buildChordInversions(chordNote, "maj", 2),
    ...buildChordInversions(chordNote, "min", 2),
    ...buildChordInversions(chordNote, "dim", 2),
    ...buildChordInversions(chordNote, "aug", 2),
    ...buildChordInversions(chordNote, "maj7", 3),
    ...buildChordInversions(chordNote, "m7", 3),
    ...buildChordInversions(chordNote, "dom7", 2),
    ...buildChordInversions(chordNote, "maj9", 3),
    ...buildChordInversions(chordNote, "m9", 3),
    ...buildChordInversions(chordNote, "dom9", 3),
    ...buildChordInversions(chordNote, "maj11", 3),
    ...buildChordInversions(chordNote, "m11", 3),
    ...buildChordInversions(chordNote, "dom11", 3),
    ...buildChordInversions(chordNote, "maj13", 3),
    ...buildChordInversions(chordNote, "m13", 3),
    ...buildChordInversions(chordNote, "dom13", 3),
  ];

  return (
    <>
      <PianoBase 
        octaves={octaves}
        octave={octave}
        showChordOnThePiano={currentChord}
      />

      <h1>{selectedNote + selectedOctave}</h1>

      <select
        value={selectedNote}
        onChange={handleNoteChange}
        className="selected-note"
      >
        {noteOptions.map((note) => (
          <option key={note} value={note}>
            {note}
          </option>
        ))}
      </select>

      <select
        value={selectedOctave}
        onChange={handleOctaveChange}
        className="selected-octave"
      >
        {octaveOptions.map((octave) => (
          <option key={octave} value={octave}>
            {octave}
          </option>
        ))}
      </select>

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