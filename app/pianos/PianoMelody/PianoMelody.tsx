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
    // Frase 1
    { pitches: ["D4"], time: "0:0:0", duration: "4n", velocity: 0.9 },
    { pitches: ["E4"], time: "0:0:1", duration: "4n", velocity: 0.8 },
    { pitches: ["F#4"], time: "0:0:2", duration: "4n", velocity: 0.8 },
    // descanso implícito en 0:0:3

    // Acorde 1 (resumen de D-E-F#)
    { pitches: ["D4", "E4", "F#4"], time: "0:1:0", duration: "1n", velocity: 0.7 },

    // Frase 2
    { pitches: ["G4"], time: "0:2:0", duration: "4n", velocity: 0.8 },
    { pitches: ["A4"], time: "0:2:1", duration: "4n", velocity: 0.8 },
    { pitches: ["B4"], time: "0:2:2", duration: "4n", velocity: 0.8 },
    // descanso en 0:2:3

    // Acorde 2 (resumen de G-A-B → sugiere G mayor)
    { pitches: ["G4", "B4", "D5"], time: "0:3:0", duration: "1n", velocity: 0.7 },

    // Acorde disonante (tétrada de 5 notas)
    { pitches: ["C#4", "D#4", "F4", "G4", "A#4"], time: "1:0:0", duration: "1n", velocity: 0.6 },

    // Frase 3
    { pitches: ["C#5"], time: "1:1:0", duration: "4n", velocity: 0.85 },
    { pitches: ["B4"], time: "1:1:1", duration: "4n", velocity: 0.85 },
    { pitches: ["A4"], time: "1:1:2", duration: "4n", velocity: 0.8 },
    // descanso en 1:1:3

    // Frase 4
    { pitches: ["G4"], time: "1:2:0", duration: "4n", velocity: 0.8 },
    { pitches: ["F#4"], time: "1:2:1", duration: "4n", velocity: 0.8 },
    { pitches: ["E4"], time: "1:2:2", duration: "4n", velocity: 0.8 },
    // descanso en 1:2:3

    // Frase 5
    { pitches: ["D4"], time: "1:3:0", duration: "4n", velocity: 0.9 },
    { pitches: ["E4"], time: "1:3:1", duration: "4n", velocity: 0.8 },
    { pitches: ["F#4"], time: "1:3:2", duration: "4n", velocity: 0.8 },
    // descanso en 1:3:3

    // Cierre
    { pitches: ["D4"], time: "2:0:0", duration: "1n", velocity: 1.0 }
  ]);

  const playMelody = async () => {
    if (!pianoRef.current) return;
    await Tone.start();

    if (!pianoRef.current.triggerChordEvent) {
      console.error("triggerChordEvent debe estar definido en pianoRef.current");
      return;
    }

    if (typeof pianoRef.current.triggerChordEvent !== "function") {
      console.error("playNoteExternally no es una función válida");
      return;
    }

    const scheduler = new ChordDispatcher(pianoRef.current.triggerChordEvent);
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