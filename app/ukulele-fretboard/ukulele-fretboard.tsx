import React from 'react';
import './ukulele.css';

export default function UkuleleFretboard({ markers = [] }) {
  const fretCount = 5;
  const stringCount = 4;

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
            style={{ top: `${(i + 0.5) * (100 / fretCount)}%` }}
          />
        ))}

        {markers.map(([humanString, fret], i) => {
          if (fret === 0) return null; // no mostrar si es al aire

          const string = 5 - humanString; // invertir para que 1 sea aguda y 4 grave
          const fretCount = 5;

          return (
            <div
              key={i}
              className="marker"
              style={{
                left: `${20 * string}%`,
                top: `${(fret - 0.5) * (100 / fretCount)}%`, // traste 1 = primer bloque
              }}
            />
          );
        })}

      </div>
    </div>
  );
}
