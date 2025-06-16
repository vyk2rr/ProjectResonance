import * as Tone from "tone";
import type { tNoteWithOctave, tTime, tChord } from "./../PianoBase/PianoBase.types";

export interface iChordEvent {
  pitches: tChord;
  time: string;  // formato estilo Tone.js: "0:1:2"
  duration: tTime;
  velocity?: number;
}

export type tMelodySequence = iChordEvent[];

export interface iChordDispatcher {
  triggerNote: (event: iChordEvent) => void;
  events: tMelodySequence;
}

export class ChordDispatcher {
  constructor(private triggerNoteFn: (note: tNoteWithOctave, duration?: tTime) => void) {}

  async startSequence(events: tMelodySequence) {
    await Tone.start();
    const part = new Tone.Part((time, value) => {
      if (typeof value === "object" && value !== null && "pitches" in value) {
        for (const note of value.pitches) {
          this.triggerNoteFn(note, value.duration);
        }
      }
    }, events.map(event => [event.time, event]));

    part.start(0);
    const now = Tone.now();
    part.start(now);
    return part; // Puedes guardar esta instancia si deseas pararlo después
  }
}
