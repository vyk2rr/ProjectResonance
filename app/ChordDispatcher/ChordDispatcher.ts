import * as Tone from "tone";
import type { tNoteWithOctave, tTime, tChord } from "./../PianoBase/PianoBase.types";

export interface iChordEvent {
  pitches: tChord;        // ejemplo: ["C4", "E4", "G4"]
  time: string;             // ejemplo: "0:0:0"
  duration: tTime;         // ejemplo: "4n"
  velocity?: number;        // opcional
}

export type tMelodySequence = iChordEvent[];

export interface iChordDispatcher {
  triggerNote: (event: iChordEvent) => void;
  events: tMelodySequence;
}

export default class ChordDispatcher {
  triggerNote: (event: iChordEvent) => void;

  constructor(triggerNote: (event: iChordEvent) => void) {
    this.triggerNote = triggerNote;
  }

  async startSequence(events: tMelodySequence) {
    if (!events || events.length === 0) return;

    await Tone.start();
    const now = Tone.now();
    const transport = Tone.getTransport(); 

    events.forEach(event => {
      const time = Tone.Time(event.time).toSeconds();
      transport.scheduleOnce((t) => { 
        this.triggerNote(event);
      }, now + time);
    });

    transport.start(); 
  }
}