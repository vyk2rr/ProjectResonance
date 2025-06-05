import * as Tone from "tone";
import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps, OctaveRangeType, ChordType } from "../../PianoBase/PianoBase.types";
import { chordToColor, generateChordsForNote, filterChords } from "./PianoWithChordsCheatsheet.utils";
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
  const [currentColor, setCurrentColor] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const handlePlayNote = (note: string) => {
    setCurrentChord([note]);
  }

  const handleChordClick = (chord: ChordType) => {
    setCurrentChord(chord.notes);
    setCurrentColor(chordToColor(chord.notes));
    setSelectedChordId(chord.id);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const note = event.target.value;
    setSelectedNote(note);
    handlePlayNote(note + selectedOctave);
  };

  const handleOctaveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const octave = event.target.value;
    setSelectedOctave(octave);
    handlePlayNote(selectedNote + octave);
  };

  return (
    <>
      <div style={{ backgroundColor: currentColor, padding: "10px" }}>
        <PianoBase
          octaves={octaves}
          octave={octave}
          showChordOnThePiano={currentChord}
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

      <div className="chord-columns">
        {notes.map(note => {
          const chordsForNote = generateChordsForNote(note, selectedOctave);
          const filteredChords = filterChords(chordsForNote, searchFilter);
          
          // Solo mostrar la columna si tiene acordes que coincidan con el filtro
          if (filteredChords.length === 0 && searchFilter) return null;
          
          return (
            <div key={note} className="chord-column">
              <h2>{note} Chords</h2>
              {filteredChords.map(chord => (
                <button
                  key={chord.id}
                  onClick={() => handleChordClick(chord)}
                  style={{ backgroundColor: chordToColor(chord.notes) }}
                  className={`
                  chord-button ${chord.id.includes('_inv') ? 'inverted' : ''} 
                  ${selectedChordId === chord.id ? 'selected' : ''}`}
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