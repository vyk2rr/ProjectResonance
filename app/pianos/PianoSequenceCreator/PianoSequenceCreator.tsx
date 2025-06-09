import * as Tone from "tone";
import React, { useState } from "react";
import type {
  tOctaveRange, tChord, tNote, tChordWithName,
} from "../../PianoBase/PianoBase.types";
import { chordToColor, generateChordsForNote, filterChords } from "./PianoSequenceCreator.utils";
import "./PianoSequenceCreator.css";
import { PianoDryLeaf } from "../PianoDryLeaf";
import { PianoMetalicoLaser } from "../PianoMetalicoLaser";
import PianoBase from "../../PianoBase/PianoBase";

export default function PianoSequenceCreator() {
  const octave: tOctaveRange = 4; // Default octave
  const [currentChord, setCurrentChord] = useState<tChord>([]);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [currentColor, setCurrentColor] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showInversions, setShowInversions] = useState<boolean>(false);
  const [chordSequence, setChordSequence] = useState<tChordWithName[]>([]);
  const notes: tNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [isPlaying, setIsPlaying] = useState(false);

  const handleChordClick = (chord: tChordWithName) => {
    setCurrentChord(chord.chord);
    setCurrentColor(chordToColor(chord.chord));
    setSelectedChordId(chord.id);
  };

  // Drag and drop handlers
  const handleDragStart = (event: React.DragEvent, chord: tChordWithName) => {
    event.dataTransfer.setData('application/json', JSON.stringify(chord));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');
    if (data) {
      const chord: tChordWithName = JSON.parse(data);
      setChordSequence(seq => [...seq, chord]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleClearSequence = () => {
    setChordSequence([]);
  };

  return (
    <>
      <div style={{ backgroundColor: currentColor, padding: "10px" }}>
        <PianoMetalicoLaser 
          highlightOnThePiano={currentChord}
          sequenceToPlay={{
            sequenceToPlay: chordSequence.map(chord => chord.chord),
            hihlightedKeys: true,
            onSequenceEnd: () => {
              // setChordSequence([]);
              // setIsPlaying(false);
          }
      }}
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

      <div
        className="chord-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <strong>Arrastra acordes aquí para construir una secuencia:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {chordSequence.map((chord, idx) => (
            <span
              key={idx}
              style={{
                background: chordToColor(chord.chord),
                padding: '4px 8px',
                borderRadius: 4,
                fontWeight: 500,
                minWidth: 40,
                textAlign: 'center',
              }}
            >
              {chord.name}
            </span>
          ))}
        </div>
        {chordSequence.length > 0 && (
          <>
            <button onClick={handleClearSequence} style={{ marginTop: 8 }}>Limpiar secuencia</button>
          </>
        )}
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