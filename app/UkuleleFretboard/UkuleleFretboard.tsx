import React from 'react';
import './UkuleleFretboard.css';

// Notas por cuerda desde el traste 0 hasta el 4
const fretboardNotes = {
  4: ["G4", "G#4", "A4", "A#4", "B4"],
  3: ["C4", "C#4", "D4", "D#4", "E4"],
  2: ["E4", "F4", "F#4", "G4", "G#4"],
  1: ["A4", "A#4", "B4", "C5", "C#5"]
};

// Devuelve [cuerda, traste] para una nota (si existe)
function findNotePosition(note) {
  for (let string in fretboardNotes) {
    const fret = fretboardNotes[string].indexOf(note);
    if (fret !== -1) {
      return [parseInt(string), fret];
    }
  }
  return null;
}

export default function UkuleleFretboard({ markers = [], active = false }) {
  const fretCount = 5;
  const stringCount = 4;

  const marks = markers
  .map((note, i) => {
    const string = 4 - i;
    const fret = fretboardNotes[string]?.indexOf(note);
    if (fret > 0) {
      return [string, fret];
    }
    return null;
  })
  .filter(Boolean);

  return (
    <div className="ukulele">
      <div className="fret-labels">
        {Array.from({ length: fretCount }, (_, i) => (
          <div key={i} className="fret-label">{i + 1}</div>
        ))}
      </div>

      <div className="strings">
        {Array.from({ length: stringCount }, (_, i) => (
          <div key={i} className={`string string-${stringCount - i}`} />
        ))}

        {Array.from({ length: fretCount }, (_, i) => (
          <div
            key={i}
            className="fret-line"
            style={{ top: `${i * (100 / fretCount)}%` }}
          />
        ))}

        {marks.map(([humanString, fret], i) => {
          const string = 5 - humanString;

          return (
            <div
              key={i}
              className={`marker ${active ? "marker-active" : ""}`}
              style={{
                left: `${20 * string}%`,
                top: `${(fret - 0.5) * (100 / fretCount)}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
