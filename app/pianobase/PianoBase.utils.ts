import * as Tone from "tone";
import type { OctaveRangeType, chordMapType } from "./PianoBase.types";

export const defaultChordMap: chordMapType = {
  D4maj: ["D4", "A4", "F#5", "A5", "D6"],
  E4min: ["E4", "B4", "G5", "B5", "E6"],
  G4bmin: ["F#4", "C#5", "A5", "C#6", "F#6"],
  G4maj: ["G4", "D5", "B5", "D6", "G6"],
  A4maj: ["A4", "E5", "C#6", "E6", "A6"],
  B4min: ["B4", "F#5", "D6", "F#6", "B6"],
  C4dim: ["C#5", "G5", "E6", "G6", "C#7"],
  D5maj: ["D5", "A5", "F#6", "A6", "D7"],
};

export const sharpToFlatMap: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb"
};

export function generateNotes(octaves: OctaveRangeType = 3, startOctave: OctaveRangeType = 4) {
  const white = [];
  const black = [];

  for (let i = 0; i < octaves; i++) {
    const currentOctave = startOctave + i;
    white.push(...["C", "D", "E", "F", "G", "A", "B"].map(n => `${n}${currentOctave}`));
    black.push(...["C#", "D#", "F#", "G#", "A#"].map(n => `${n}${currentOctave}`));
  }

  // Agrega la nota final del último do (ej. C6)
  white.push(`C${startOctave + octaves}`);

  return { white, black };
}

export function getAlternativeNotation(note: string): string {
  const [, noteName, octave] = note.match(/([A-G]#)(\d)/) || [];
  if (noteName && sharpToFlatMap[noteName]) {
    return `${sharpToFlatMap[noteName]}${octave}`;
  }
  return "";
}

export function getBlackKeyLeft(note: string, whiteNotes: string[]): string {
  const blackToWhiteBefore: Record<string, string> = {
    "C#": "C",
    "D#": "D",
    "F#": "F",
    "G#": "G",
    "A#": "A",
  };

  const match = note.match(/^([A-G]#)(\d)$/);
  if (!match) return "0%";

  const [_, pitchClass, octave] = match;
  const whiteBefore = `${blackToWhiteBefore[pitchClass]}${octave}`;
  const whiteIndex = whiteNotes.indexOf(whiteBefore);

  if (whiteIndex === -1) return "0%";

  const whiteKeyWidth = 100 / whiteNotes.length;
  const left = (whiteIndex + 1) * whiteKeyWidth;

  return `${left}%`; // ya está centrado por transform: translateX(-50%)
}

export function getBlackKeyWidth(octaves: OctaveRangeType): string {
  if (octaves <= 1) return "7%";
  if (octaves === 2) return "4%";
  if (octaves === 3) return "3%";
  if (octaves === 4) return "2%";
  return "1.4%";
}

export function createDefaultSynth() {
  // Sintetizador principal para el tono del piano
  const synth = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    envelope: {
      attack: 0.002,    // Ataque muy rápido para el golpe de martillo
      decay: 0.5,       // Decay moderado
      sustain: 0.15,    // Sustain bajo para simular las cuerdas del piano
      release: 1.5      // Release largo para la resonancia natural
    },
    oscillator: {
      type: "sine"      // Onda sinusoidal para un tono más puro
    }
  });

  // Filtro para dar forma al sonido del piano
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 5000,    // Frecuencia de corte alta para mantener brillo
    Q: 1               // Resonancia suave
  });

  // Compressor para controlar la dinámica
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.003,
    release: 0.25
  });

  // Reverb sutil para simular la caja de resonancia del piano
  const reverb = new Tone.Reverb({
    decay: 1.5,        // Decay moderado
    wet: 0.2          // Mezcla sutil
  }).toDestination();

  // Conectamos la cadena de efectos
  synth.chain(filter, compressor, reverb);

  // Retornamos un objeto compatible con la interfaz esperada
  return {
    triggerAttackRelease(note: string, duration: string | number) {
      synth.triggerAttackRelease(note, duration);
    },
    dispose() {
      synth.dispose();
      filter.dispose();
      compressor.dispose();
      reverb.dispose();
    }
  } as unknown as Tone.PolySynth;
}

export function playNote(note: string, synth: Tone.PolySynth | null) {
  if (!synth) return;
  synth.triggerAttackRelease(note, "4n");
}

export function playChord(notes: string[], synth: Tone.PolySynth | null) {
  if (!synth) return;
  notes.forEach(note => synth.triggerAttackRelease(note, "2n"));
}

export function playSequence(
  notesOrName: string[] | string, 
  synth: Tone.PolySynth | null, 
  chordMap: chordMapType = defaultChordMap, 
  delay = 200
) {
  if (!synth) return;
  
  const notes = Array.isArray(notesOrName)
    ? notesOrName
    : chordMap[notesOrName] || [];

  if (notes.length === 0) return;

  notes.forEach((note, i) => {
    setTimeout(() => {
      synth.triggerAttackRelease(note, "8n");
    }, i * delay);
  });
}
