import React, { useState } from "react";
import type { tChordWithName, tNote, tOctaveRange, tChord } from "../PianoBase/pianobase.types";
import {
  generateChordsForNote, filterChords, chordToColor, buildBaseChord
} from "./ChordPalette.utils";
import "./ChordPalette.css"; 

type ChordPaletteParams = {
  currentChord: tChord;
  setCurrentChord: (chord: tChord) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  octave: tOctaveRange;
};

export default function ChordPalette({ params }: { params: ChordPaletteParams }) {
  const {
    currentChord, setCurrentChord,
    currentColor, setCurrentColor,
    octave
  } = params;

  const notes: tNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [showInversions, setShowInversions] = useState<boolean>(false);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const handleChordClick = (chord: tChordWithName) => {
    setCurrentChord(chord.chord);
    setCurrentColor(chordToColor(chord.chord));
    setSelectedChordId(chord.id);
  };

  // Drag and drop handlers
  const handleDragStart = (event: React.DragEvent, chord: tChordWithName) => {
    event.dataTransfer.setData('application/json', JSON.stringify(chord));
  };

  return (
    <>
      <button onClick={() => setShowInversions(prev => !prev)}>
        {showInversions ? "Ocultar inversiones" : "Mostrar inversiones"}
      </button>

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
          const chordsForNote: tChordWithName[] = generateChordsForNote(note, octave);
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
                  draggable
                  onDragStart={e => handleDragStart(e, chord)}
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