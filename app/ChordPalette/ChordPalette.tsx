import React, { useState } from "react";
import type { tChordWithName, tNote, tOctaveRange, tChord } from "../PianoBase/pianobase.types";
import { generateChordsForNote, filterChords, getChordColor } from "./chordPalette.utils.tsx";
import "./chordPalette.css";

type ChordPaletteParams = {
  currentChord: tChord;
  setCurrentChord: (chord: tChord) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  octave: tOctaveRange;
};

interface tChordPaletteProps {
  params: ChordPaletteParams;
  showNotes?: boolean;
  showName?: boolean;
  debug?: boolean;
}

export default function ChordPalette({ params, showNotes = true, showName = true, debug = false }: tChordPaletteProps) {
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
    setCurrentColor(getChordColor(chord.rootNote, chord.quality));
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

      {debug && (
        <>
          <h3>Debug Info</h3>
          currentChord: {currentChord.join(", ")}<br />
          currentColor: {currentColor}<br />
          showInversions: {showInversions ? "si" : "no"}<br />
          selectedChordId: {selectedChordId}<br />
          searchFilter: {searchFilter}<br />
        </>
      )}
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
                  style={{ backgroundColor: getChordColor(chord.rootNote, chord.quality) }}
                  className={`chord-button ${chord.id.includes('_inv') ? 'inverted' : ''} ${selectedChordId === chord.id ? 'selected' : ''}`}
                  draggable
                  onDragStart={e => handleDragStart(e, chord)}
                >
                  {showName ? <div className="chord-name">{chord.name}</div> : ''}
                  {showNotes ? <div className="chord-notes">{chord.displayNotes}</div> : ''}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}