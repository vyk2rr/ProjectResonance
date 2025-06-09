import * as Tone from "tone";
import React, { useState } from "react";
import type { PianoBaseProps } from "../../PianoBase/PianoBase";
import type {
  tOctaveRange, tChord, tNote, tChordWithName,
} from "../../PianoBase/PianoBase.types";
import { chordToColor, generateChordsForNote, filterChords } from "./PianoWithChordsCheatsheet.utils";
import "./PianoWithChordsCheatsheet.css";
import { PianoDryLeaf } from "../PianoDryLeaf";
import { PianoMetalicoLaser } from "../PianoMetalicoLaser";
import PianoBase from "../../PianoBase/PianoBase";

interface PianoWithChordsHelperProps extends PianoBaseProps {
  chord: string[],
  octaves: tOctaveRange
}

export default function PianoWithChordsHelper({ chord, octaves = 2, octave = 4 }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<tChord>([]);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string>("C");
  const [selectedOctave, setSelectedOctave] = useState<tOctaveRange>(4);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showInversions, setShowInversions] = useState<boolean>(false);

  const notes: tNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // const handlePlayNote = (note: tNoteWithOctave) => {
  //   const chord: tChord = [note];
  //   // const sequence: tChordSequence = [chord]
  //   setCurrentChord(chord);
  // }

  const handleChordClick = (chord: tChordWithName) => {
    setCurrentChord(chord.chord);
    setCurrentColor(chordToColor(chord.chord));
    setSelectedChordId(chord.id);
  };

  return (
    <>
      <div style={{ backgroundColor: currentColor, padding: "10px" }}>
        <PianoMetalicoLaser
          octaves={octaves}
          octave={octave}
          highlightOnThePiano={currentChord}
        />
      </div>

      <div className="search-container">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter chords (e.g. 'C', 'C E', 'C-E')"
          className="chord-search"
        />
      </div>

      <button onClick={() => setShowInversions(prev => !prev)}>
        {showInversions ? "Ocultar inversiones" : "Mostrar inversiones"}
      </button>

      <div className="chord-columns">
        {notes.map(note => {
          const chordsForNote: tChordWithName[] = generateChordsForNote(note, selectedOctave);
          const filteredChords = filterChords(chordsForNote, searchFilter)
            .filter(chord => showInversions || !chord.id.includes('_inv'));

          // Solo mostrar la columna si tiene acordes que coincidan con el filtro
          if (filteredChords.length === 0 && searchFilter) return null;

          return (
            <div key={note} className="chord-column">
              <h2>{note} Chords</h2>
              {filteredChords.map(chord => (
                <button
                  key={chord.id}
                  onClick={() => handleChordClick(chord)}
                  style={{ backgroundColor: chordToColor(chord.chord) }}
                  className={`chord-button ${chord.id.includes('_inv') ? 'inverted' : ''} ${selectedChordId === chord.id ? 'selected' : ''}`}
                >
                  <div className="chord-name">{chord.name}</div>
                  <div className="chord-notes">{chord.displayNotes}</div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}