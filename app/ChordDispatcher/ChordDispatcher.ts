import * as Tone from "tone";
import type { tTime, tChord } from "./../PianoBase/PianoBase.types";

export interface iChordEvent {
  pitches: tChord;
  time: string;           // Tiempo musical (ej: "0:0:1", "1m", "4n")
  duration: tTime;
  velocity?: number;
  highlightGroup?: 1 | 2;
  scheduledPlayTime?: number; // Tiempo exacto del AudioContext para la reproducción (añadido por el scheduler)
}

export type tMelodySequence = iChordEvent[];

export default class ChordDispatcher {
  triggerNoteCallback: (event: iChordEvent) => void;
  private tempo: number;
  private noteDelay: number = 0.05; // Delay para arpegios en segundos (ajustado a 50ms)

  constructor(triggerNoteCallback: (event: iChordEvent) => void, tempo: number = 120) {
    this.triggerNoteCallback = triggerNoteCallback;
    this.tempo = tempo;
  }

  async startSequence(events: tMelodySequence) {
    if (!events || events.length === 0) return;

    await Tone.start(); // Asegura que el AudioContext está iniciado
    const transport = Tone.getTransport();
    
    transport.bpm.value = this.tempo;
    transport.stop();    // Detiene y
    transport.cancel();  // limpia eventos previos del transport

    events.forEach(originalEvent => {
      // Usamos el tiempo musical directamente, Tone.js lo convertirá.
      const musicalTime = originalEvent.time; 
      
      transport.scheduleOnce((scheduledAudioContextTime) => {
        // scheduledAudioContextTime es el tiempo exacto del AudioContext para este evento del transport
        if (Array.isArray(originalEvent.pitches)) {
          originalEvent.pitches.forEach((pitch, index) => {
            const actualPlayTime = scheduledAudioContextTime + (index * this.noteDelay);
            const adjustedEvent: iChordEvent = {
              ...originalEvent,
              pitches: [pitch], // Nota individual para reproducción y resaltado
              scheduledPlayTime: actualPlayTime, // Tiempo exacto para triggerAttackRelease
              // El 'time' original se mantiene para referencia, pero no se usa para el scheduling de la nota individual aquí
            };
            this.triggerNoteCallback(adjustedEvent);
          });
        } else {
           // Caso poco probable si pitches siempre es array, pero por si acaso
          this.triggerNoteCallback({
            ...originalEvent,
            scheduledPlayTime: scheduledAudioContextTime
          });
        }
      }, musicalTime); // Programar usando el tiempo musical del evento
    });

    transport.start();

    // Detener el transport después de que termine la secuencia
    const lastEvent = events[events.length - 1];
    if (lastEvent) {
        const lastEventStartTimeSeconds = Tone.Time(lastEvent.time).toSeconds();
        const lastEventDurationSeconds = Tone.Time(lastEvent.duration).toSeconds();
        const lastEventPitchCount = Array.isArray(lastEvent.pitches) ? lastEvent.pitches.length : 1;
        const arpeggioDurationOfLastEvent = lastEventPitchCount > 1 ? (lastEventPitchCount - 1) * this.noteDelay : 0;
        
        const totalSequenceDurationSeconds = lastEventStartTimeSeconds + lastEventDurationSeconds + arpeggioDurationOfLastEvent;
        
        setTimeout(() => {
          transport.stop();
          transport.cancel();
          console.log("Transport stopped after sequence.");
        }, (totalSequenceDurationSeconds + 0.5) * 1000); // +0.5s de margen
    }
  }
}