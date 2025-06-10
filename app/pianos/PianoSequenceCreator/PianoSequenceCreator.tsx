import * as Tone from "tone";
import React, { useState } from "react";
import type {
  tOctaveRange, tChord, tNote, tChordWithName,
} from "../../PianoBase/PianoBase.types";
import "./PianoSequenceCreator.css";
import { PianoDryLeaf } from "../PianoDryLeaf";
import { PianoMetalicoLaser } from "../PianoMetalicoLaser";
import { PianoHu } from "../PianoHu";
import PianoBase from "../../PianoBase/PianoBase";
import ChordPalette from "./../../ChordPalette/ChordPalette";
import { chordToColor } from "./../../ChordPalette/ChordPalette.utils";


export default function PianoSequenceCreator() {
  const octave: tOctaveRange = 4; // Default octave
  const [chordSequence, setChordSequence] = useState<tChordWithName[]>([]);
  const notes: tNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentChord, setCurrentChord] = useState<tChord>([]);
  const [currentColor, setCurrentColor] = useState<string>("");

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
        <PianoHu
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

      <ChordPalette params={{
        currentChord: currentChord,
        setCurrentChord: setCurrentChord,
        currentColor: currentColor,
        setCurrentColor: setCurrentColor,
        octave: octave
      }} />
    </>
  );
}