import * as Tone from "tone";
import React, { useEffect, useState, useRef } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import { tNote, tChord, tSequenceToPlayProps } from "../../PianoBase/PianoBase.types";
import { PianoObserver } from "../../PianoObserver/PianoObserver";
import ChordDispatcher from "./../../ChordDispatcher/ChordDispatcher";

// Instancia única, puedes mover esto a un contexto si lo necesitas global
const pianoObserver = new PianoObserver();

export default function PianoMelody() {
  const pianoRef = useRef<typeof PianoBase>(null);
  // Estado para guardar las últimas notas presionadas
  const [recentNotes, setRecentNotes] = useState<tChord>(['B3', 'D4', 'F4', 'A4', 'C5'] as tChord);
  // Estado para guardar actual melodía en creación
  const [currentMelody, setCurrentMelody] = useState<ChordDispatcher>({
    events: [
      { pitches: ["D4", "F#4", "A4"], time: "0:0:0", duration: "4n", velocity: 0.8 },
      { pitches: ["E4", "G4", "B4"], time: "0:0:1", duration: "4n", velocity: 0.8 },
      { pitches: ["F#4", "A4", "C#5"], time: "0:0:2", duration: "4n", velocity: 0.8 },
      // silencio
      { pitches: ["G4", "B4", "D5"], time: "0:2:0", duration: "4n", velocity: 0.8 },
      { pitches: ["A4", "C#5", "E5"], time: "0:2:1", duration: "4n", velocity: 0.8 },
      { pitches: ["B4", "D5", "F#5"], time: "0:2:2", duration: "4n", velocity: 0.8 },
      // silencio
      { pitches: ["B4", "D5", "F#5"], time: "0:3:0", duration: "4n", velocity: 0.8 },
      { pitches: ["F#4", "A4", "C#5"], time: "0:3:1", duration: "4n", velocity: 0.8 },
      { pitches: ["E4", "G4", "B4"], time: "0:3:2", duration: "4n", velocity: 0.8 },
      // silencio
      { pitches: ["D4", "F#4", "A4"], time: "0:4:0", duration: "1n", velocity: 0.8 }
    ]
  });

  const pianoPlayer1: ChordDispatcher = {
    events: [
      { pitches: ["D4", "F#4", "A4"], time: "0:0:0", duration: "4n" },
      { pitches: ["E4", "G4", "B4"], time: "0:0:1", duration: "4n" },
    ],
    triggerNote: (event) => {
      console.log("Disparando nota desde dispatcher:", event);
    }
  };

  useEffect(() => {
    // Suscribirse a eventos de PianoObserver
    const unsubscribe = pianoObserver.subscribe(event => {
      if (event.type === "notePlayed") {
        setRecentNotes(prev => {
          // Mantén solo las últimas 5 notas (ajusta el número como quieras)
          const newNotes = [event.note, ...prev];
          return newNotes.slice(0, 5) as tChord;
        });
      }
    });
    // Limpia la suscripción al desmontar el componente
    return unsubscribe;
  }, []);

  // const playMelody = async () => {
  //   await Tone.start();
  //   const part = new Tone.Part((time, note) => {

  //     // Handle note triggering
  //     debugger;

  //   }, currentMelody.events);
  //   part.start();
  // };

const playMelody = async () => {
  if (!pianoRef.current) return;

  const scheduler = new PianoScheduler(pianoRef.current.playNoteExternally);
  await scheduler.startSequence(currentMelody.events);
};
  
  return (
    <div className="piano-mini-dashboard">
      <div>
        {recentNotes.join(", ") || "No hay teclas presionadas aún."}
      </div>

      <div>
        {currentMelody.events.map((event, index) => (
          <div key={index}>
            {event.pitches.join(", ")} - {event.duration}
          </div>
        ))}
      </div>

      <button onClick={playMelody}>Reproducir Melodía</button>

      {/* Aquí puedes agregar más controles para modificar la melodía */}

      <PianoBase
        pianoRef={pianoRef}
        pianoObserver={pianoObserver}
        chordDispatcher={[pianoPlayer1]}
        octave={3}
      />
    </div>
  );
}