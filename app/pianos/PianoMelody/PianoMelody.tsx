import * as Tone from "tone";
import React, { useState, useRef } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { iChordDispatcher, tMelodySequence } from "../../ChordDispatcher/ChordDispatcher";
import ChordDispatcher from "../../ChordDispatcher/ChordDispatcher";
import type { PianoBaseHandle } from "../../PianoBase/PianoBase";

export default function PianoMelody() {
  const pianoRef = useRef<PianoBaseHandle>(null);
  const pianoPlayer1: iChordDispatcher = {
    events: [
      // Reproduce el cargar si estos eventos están definidos
      // { pitches: ["D4", "F#4", "A4"], time: "0:0:0", duration: "4n" },
      // { pitches: ["E4", "G4", "B4"], time: "0:0:1", duration: "4n" },
    ],
    triggerNote: (event) => {
      console.log("Disparando nota desde dispatcher inicial!! yes!", event);
    }
  };

  // Estado para guardar actual melodía en creación
  const [currentMelody, setCurrentMelody] = useState<tMelodySequence>([
    // === PARTE 1: Tema Principal Original (0-8 segundos) ===
    // Tema principal - Primera frase
    { pitches: ["E5"], time: "0:0:0", duration: "16n", velocity: 0.9 },
    { pitches: ["E5"], time: "0:0:1", duration: "16n", velocity: 0.9 },
    { pitches: ["E5"], time: "0:0:2", duration: "8n", velocity: 0.9 },
    { pitches: ["C5"], time: "0:0:3", duration: "16n", velocity: 0.85 },
    { pitches: ["E5"], time: "0:1:0", duration: "8n", velocity: 0.9 },
    { pitches: ["G5"], time: "0:1:2", duration: "4n", velocity: 0.85 },
    { pitches: ["G4"], time: "0:2:0", duration: "4n", velocity: 0.8 },

    // === PARTE 2: Secuencia Underground (8-16 segundos) ===
    { pitches: ["C5"], time: "1:0:0", duration: "16n", velocity: 0.9 },
    { pitches: ["C5"], time: "1:0:1", duration: "16n", velocity: 0.9 },
    { pitches: ["C5"], time: "1:0:2", duration: "8n", velocity: 0.9 },
    { pitches: ["G4"], time: "1:0:3", duration: "16n", velocity: 0.85 },
    { pitches: ["Ab4"], time: "1:1:0", duration: "16n", velocity: 0.85 },
    { pitches: ["A4"], time: "1:1:1", duration: "16n", velocity: 0.9 },
    { pitches: ["F5"], time: "1:1:2", duration: "8n", velocity: 0.9 },
    { pitches: ["F5"], time: "1:1:3", duration: "16n", velocity: 0.9 },

    // === PARTE 3: Secuencia de Estrella (16-24 segundos) ===
    { pitches: ["C5"], time: "2:0:0", duration: "16n", velocity: 1.0 },
    { pitches: ["E5"], time: "2:0:1", duration: "16n", velocity: 1.0 },
    { pitches: ["G5"], time: "2:0:2", duration: "16n", velocity: 1.0 },
    { pitches: ["C6"], time: "2:0:3", duration: "16n", velocity: 1.0 },
    { pitches: ["G5"], time: "2:1:0", duration: "16n", velocity: 1.0 },
    { pitches: ["E5"], time: "2:1:1", duration: "16n", velocity: 1.0 },

    // === PARTE 4: Secuencia de Tuberías (24-32 segundos) ===
    { pitches: ["E5"], time: "3:0:0", duration: "16n", velocity: 0.9 },
    { pitches: ["C5"], time: "3:0:1", duration: "16n", velocity: 0.85 },
    { pitches: ["G4"], time: "3:0:2", duration: "16n", velocity: 0.8 },
    { pitches: ["F4"], time: "3:0:3", duration: "16n", velocity: 0.8 },
    { pitches: ["E4"], time: "3:1:0", duration: "8n", velocity: 0.9 },
    { pitches: ["G4"], time: "3:1:2", duration: "8n", velocity: 0.9 },

    // === PARTE 5: Secuencia de Castillo (32-40 segundos) ===
    { pitches: ["D5"], time: "4:0:0", duration: "16n", velocity: 0.85 },
    { pitches: ["D5"], time: "4:0:2", duration: "16n", velocity: 0.85 },
    { pitches: ["B4"], time: "4:1:0", duration: "16n", velocity: 0.8 },
    { pitches: ["C5"], time: "4:1:2", duration: "16n", velocity: 0.85 },
    { pitches: ["A4"], time: "4:2:0", duration: "8n", velocity: 0.8 },

    // === PARTE 6: Tema Principal Variación (40-48 segundos) ===
    { pitches: ["E5"], time: "5:0:0", duration: "16n", velocity: 0.9 },
    { pitches: ["E5"], time: "5:0:1", duration: "16n", velocity: 0.9 },
    { pitches: ["E5"], time: "5:0:2", duration: "8n", velocity: 0.9 },
    { pitches: ["C5"], time: "5:0:3", duration: "16n", velocity: 0.85 },
    { pitches: ["E5"], time: "5:1:0", duration: "8n", velocity: 0.95 },
    { pitches: ["G5"], time: "5:1:2", duration: "4n", velocity: 0.9 },

    // === PARTE 7: Secuencia de Victoria (48-56 segundos) ===
    { pitches: ["C6"], time: "6:0:0", duration: "16n", velocity: 1.0 },
    { pitches: ["G5"], time: "6:0:2", duration: "16n", velocity: 0.95 },
    { pitches: ["E5"], time: "6:1:0", duration: "16n", velocity: 0.9 },
    { pitches: ["C5"], time: "6:1:2", duration: "16n", velocity: 0.85 },
    { pitches: ["D5"], time: "6:2:0", duration: "8n", velocity: 0.9 },
    { pitches: ["G5"], time: "6:2:2", duration: "8n", velocity: 0.95 },

    // === PARTE 8: Final Épico (56-60 segundos) ===
    { pitches: ["C6"], time: "7:0:0", duration: "16n", velocity: 1.0 },
    { pitches: ["C6"], time: "7:0:1", duration: "16n", velocity: 1.0 },
    { pitches: ["C6"], time: "7:0:2", duration: "8n", velocity: 1.0 },
    { pitches: ["G5"], time: "7:1:0", duration: "4n", velocity: 0.95 },
    { pitches: ["E5"], time: "7:2:0", duration: "4n", velocity: 0.9 },
    { pitches: ["C5"], time: "7:3:0", duration: "2n", velocity: 1.0 },

    // Acorde armonioso inicial en E menor
    { pitches: ["E4", "G4", "B4"], time: "0:0:0", duration: "4n", velocity: 0.5 },

    // Acorde armonioso en C mayor
    { pitches: ["C4", "E4", "G4"], time: "0:1:0", duration: "4n", velocity: 0.5 },

    // Primera tetrada disonante
    { pitches: ["C4", "C#4", "D4", "D#4"], time: "1:0:0", duration: "4n", velocity: 0.4 },

    // Segunda tetrada disonante (más tensa)
    { pitches: ["F#4", "G4", "G#4", "A4"], time: "1:1:0", duration: "4n", velocity: 0.4 },

    // Tercera tetrada disonante (cluster)
    { pitches: ["B4", "C5", "C#5", "D5"], time: "1:2:0", duration: "4n", velocity: 0.4 },

    // Cuarta tetrada disonante (extrema)
    { pitches: ["E4", "F4", "F#4", "G#4"], time: "1:3:0", duration: "4n", velocity: 0.4 },

    // Regreso a armonía - Acorde de C mayor
    { pitches: ["C4", "E4", "G4"], time: "2:0:0", duration: "4n", velocity: 0.5 },

    // Acorde armonioso en G mayor
    { pitches: ["G4", "B4", "D5"], time: "2:1:0", duration: "4n", velocity: 0.5 },

    // Acorde armonioso en F mayor
    { pitches: ["F4", "A4", "C5"], time: "3:0:0", duration: "4n", velocity: 0.5 },

    // Quinta tetrada disonante (cluster móvil)
    { pitches: ["D4", "D#4", "E4", "F4", "F#4", "G4"], time: "4:0:0", duration: "4n", velocity: 0.4 },

    // Sexta tetrada disonante (cluster agudo)
    { pitches: ["A4", "Bb4", "B4", "C5", "C#5", "D5"], time: "4:1:0", duration: "4n", velocity: 0.4 },

    // Regreso a armonía - Acorde de E mayor
    { pitches: ["E4", "G#4", "B4"], time: "5:0:0", duration: "4n", velocity: 0.5 },

    // Acorde armonioso en A menor
    { pitches: ["A4", "C5", "E5"], time: "6:0:0", duration: "4n", velocity: 0.5 },

    // Acorde final triunfal en C mayor con séptima mayor
    { pitches: ["C4", "E4", "G4", "B4"], time: "7:0:0", duration: "2n", velocity: 0.6 }
  ]);

  const playMelody = async () => {
    if (!pianoRef.current) return;
    await Tone.start();

    if (!pianoRef.current.triggerChordEvent) {
      console.error("triggerChordEvent debe estar definido en pianoRef.current");
      return;
    }

    // Crear el scheduler con un tempo más lento
    const scheduler = new ChordDispatcher(pianoRef.current.triggerChordEvent, 180);
    await scheduler.startSequence(currentMelody);
  };

  return (
    <div className="piano-mini-dashboard">
      {/* <div>
        {currentMelody.map((event, index) => (
          <div key={index}>
            {event.time as string} chords: [{event.pitches.join(", ")}] duration: {event.duration as string} velocity: {event.velocity}
          </div>
        ))}
      </div> */}

      <button onClick={playMelody}>Reproducir Melodía</button>

      {/* Aquí puedes agregar más controles para modificar la melodía */}

      <PianoBase
        ref={pianoRef}
        chordDispatcherList={[
          pianoPlayer1
        ]}
        octave={3}
      />
    </div>
  );
}