import * as Tone from "tone";
import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps, OctaveRangeType, ChordType } from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsCheatsheet.css";

type PianoWithChordsHelperProps = PianoBaseProps & {
  chord: string[],
  octaves: OctaveRangeType
}

function chordToColor(notes: string[]): string {
  // Mapeo de notas a matices (hue) siguiendo el espectro del arcoíris
  const noteToHue: Record<string, number> = {
    'C': 0,    // Rojo (0)
    'C#': 20, 'Db': 20,  // Rojo-Naranja
    'D': 40,   // Naranja
    'D#': 50, 'Eb': 50,  // Naranja-Amarillo
    'E': 60,   // Amarillo
    'F': 120,  // Verde
    'F#': 150, 'Gb': 150, // Verde-Azulado
    'G': 180,  // Azul
    'G#': 200, 'Ab': 200, // Azul medio
    'A': 220,  // Azul oscuro
    'A#': 260, 'Bb': 260, // Azul-Violeta
    'B': 280   // Violeta
  };

  // Extract base note name without octave (e.g., "G4" -> "G")
  const extractBaseNote = (note: string): string => {
    const match = note.match(/^[A-G][#b]?/);
    return match ? match[0] : note;
  };

  // Convierte HSL a RGB (h: 0-360, s: 0-100, l: 0-100)
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Convierte RGB a HEX
  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  if (notes.length === 0) return '#000000';

  // Usar la nota raíz para el matiz base
  const rootNote = extractBaseNote(notes[0]);
  const hue = noteToHue[rootNote];
  if (hue === undefined) throw new Error(`Nota no válida: ${rootNote}`);

  // Ajustar saturación y luminosidad basado en el tipo de acorde
  let saturation = 100; // Máxima saturación para colores más vivos
  let lightness = 50;   // Luminosidad base

  // Si es un acorde menor (tiene una tercera menor)
  if (notes.length >= 3) {
    const intervals = notes.map(note => Tone.Frequency(note).toMidi());
    const thirdInterval = intervals[1] - intervals[0];
    if (thirdInterval === 3) { // Tercera menor
      lightness = 40; // Más oscuro para acordes menores
    }
  }

  // Ajustar luminosidad basado en el número de notas
  lightness = Math.max(30, lightness - (notes.length - 3) * 3);

  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return rgbToHex(r, g, b);
}


export default function PianoWithChordsHelper({ chord, octaves = 2, octave = 4 }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<string[]>([]);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string>("C");
  const [selectedOctave, setSelectedOctave] = useState<string>("4");
  const [currentColor, setCurrentColor] = useState<string>("");

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
    setCurrentColor(chordToColor(chord.notes));
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
      <div style={{ backgroundColor: currentColor, padding: "10px" }}>
        <PianoBase
          octaves={octaves}
          octave={octave}
          showChordOnThePiano={currentChord}
        />
      </div>

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
    </>
  );
}