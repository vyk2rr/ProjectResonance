import * as Tone from "tone";
import type { tNoteWithOctave, tTime, tChord } from "./../PianoBase/PianoBase.types";

export interface iChordEvent {
  pitches: tChord;
  time: string;
  duration: tTime;
  velocity?: number;
}

export type tMelodySequence = iChordEvent[];

export interface iChordDispatcher {
  triggerNote: (event: iChordEvent) => void;
  events: tMelodySequence;
}

export default class ChordDispatcher {
  triggerNote: (event: iChordEvent) => void;
  private tempo: number;

  constructor(triggerNote: (event: iChordEvent) => void, tempo: number = 85) {
    this.triggerNote = triggerNote;
    this.tempo = tempo;
  }

  async startSequence(events: tMelodySequence) {
    if (!events || events.length === 0) return;

    await Tone.start();
    const now = Tone.now();
    const transport = Tone.getTransport();
    
    // Establecer un tempo más lento
    transport.bpm.value = this.tempo;

    // Asegurarnos de que el transport esté detenido y reiniciado
    transport.stop();
    transport.cancel();

    events.forEach(event => {
      // Multiplicamos el tiempo por 2 para hacerlo más espaciado
      const time = Tone.Time(event.time).toSeconds() * 2;
      
      transport.scheduleOnce((t) => {
        // Añadimos un pequeño delay entre notas
        const noteDelay = 0.1;
        if (Array.isArray(event.pitches)) {
          event.pitches.forEach((pitch, index) => {
            const adjustedEvent = {
              ...event,
              pitches: [pitch],
              time: (t + (index * noteDelay)).toString()
            };
            this.triggerNote(adjustedEvent);
          });
        } else {
          this.triggerNote(event);
        }
      }, now + time);
    });

    transport.start();

    // Detener el transport después de que termine la secuencia
    const lastEvent = events[events.length - 1];
    const lastTime = Tone.Time(lastEvent.time).toSeconds() * 2 + 
                    Tone.Time(lastEvent.duration).toSeconds();
    
    setTimeout(() => {
      transport.stop();
      transport.cancel();
    }, (lastTime + 1) * 1000);
  }
}