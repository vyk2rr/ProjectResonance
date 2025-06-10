import * as Tone from "tone";
import type {
  tOctaveRange, tChordMap, tTime, tChordSequence,
  tNoteWithOctave, tPianoNotes, tPercentString,
  tNoteName, tChord, SupportedSynthType
} from "./PianoBase.types";
import { SHARP_TO_FLAT_MAP } from "./PianoBase.types";

export const DEFAULT_CHORD_MAP: tChordMap = {
  D4maj: ["D4", "A4", "F#5", "A5", "D6"],
  E4min: ["E4", "B4", "G5", "B5", "E6"],
  G4bmin: ["F#4", "C#5", "A5", "C#6", "F#6"],
  G4maj: ["G4", "D5", "B5", "D6", "G6"],
  A4maj: ["A4", "E5", "C#6", "E6", "A6"],
  B4min: ["B4", "F#5", "D6", "F#6", "B6"],
  C4dim: ["C#5", "G5", "E6", "G6", "C#7"],
  D5maj: ["D5", "A5", "F#6", "A6", "D7"],
};

export function generateNotes(octaves: tOctaveRange = 3, startOctave: tOctaveRange = 4): tPianoNotes {
  const white: tNoteWithOctave[] = [];
  const black: tNoteWithOctave[] = [];

  for (let i = 0; i < octaves; i++) {
    const currentOctave = startOctave + i;
    white.push(...["C", "D", "E", "F", "G", "A", "B"].map(n => `${n}${currentOctave}` as tNoteWithOctave));
    black.push(...["C#", "D#", "F#", "G#", "A#"].map(n => `${n}${currentOctave}` as tNoteWithOctave));
  }

  // Agrega la nota final del último do (ej. C6)
  white.push(`C${startOctave + octaves}` as tNoteWithOctave);

  return { white, black };
}

export function getAlternativeNotation(note: tNoteWithOctave): tNoteWithOctave {
  const match = note.match(/^([A-G]#)(\d)$/);
  if (match) {
    const [, noteName, octave] = match;
    const flat = SHARP_TO_FLAT_MAP[noteName as keyof typeof SHARP_TO_FLAT_MAP];
    if (flat) {
      return `${flat}${octave}` as tNoteWithOctave;
    }
  }
  return "" as tNoteWithOctave;
}

export function getBlackKeyLeft(note: tNoteName, whiteNotes: tNoteName[]): tPercentString {
  const blackToWhiteBefore: Partial<Record<tNoteName, tNoteName>> = {
    "C#": "C",
    "D#": "D",
    "F#": "F",
    "G#": "G",
    "A#": "A",
  };

  const match = note.match(/^([A-G]#)(\d)$/);
  if (!match) return "0%";

  const [_, pitchClass, octave] = match;
  const whiteBefore = `${blackToWhiteBefore[pitchClass as tNoteName]}${octave}` as tNoteWithOctave;
  const whiteIndex = whiteNotes.indexOf(whiteBefore as tNoteName);

  if (whiteIndex === -1) return "0%";

  const whiteKeyWidth = 100 / whiteNotes.length;
  const left = (whiteIndex + 1) * whiteKeyWidth;

  return `${left}%`; // ya está centrado por transform: translateX(-50%)
}

export function getBlackKeyWidth(octaves: tOctaveRange): tPercentString {
  if (octaves <= 1) return "7%";
  if (octaves === 2) return "4%";
  if (octaves === 3) return "3%";
  if (octaves === 4) return "2%";
  return "1.4%";
}

export function createDefaultSynth(): SupportedSynthType {
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
    triggerAttackRelease(note: string | string[], duration: string | number): void {
      console.log('wrapper: triggerAttackRelease:');
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

export function playNote(
  note: tNoteWithOctave,
  synth: SupportedSynthType | null,
  duration: tTime = "4n"
): Promise<void> {
  if (!synth) return Promise.resolve();
  synth.triggerAttackRelease(note, duration);
  const ms = Tone.Time(duration).toMilliseconds();
  return new Promise(res => setTimeout(res, ms));
}

export async function playChord(
  notes: tChord,
  synth: SupportedSynthType | null,
  duration: tTime = "4n"
): Promise<void> {
  if (!synth) return;
  await Promise.all(notes.map(note => playNote(note, synth, duration)));
  for (const note of notes) {
    await playNote(note, synth, duration);
  }
}

export async function playChordSimultaneous(
  notes: tChord,
  synth: SupportedSynthType,
  duration: tTime = "2n"
) {
  await playNote(notes, synth, duration);
}

// Función auxiliar para convertir HSL a RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Función auxiliar para convertir RGB a HEX
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Mapa de notas a tonos base
const NOTE_TO_HUE: Record<string, number> = {
  'C': 0,    // Rojo
  'C#': 30,  // Naranja rojizo
  'D': 60,   // Naranja
  'D#': 90,  // Amarillo naranja
  'E': 120,  // Amarillo
  'F': 150,  // Amarillo verdoso
  'F#': 180, // Verde
  'G': 210,  // Verde azulado
  'G#': 240, // Azul
  'A': 270,  // Azul violáceo
  'A#': 300, // Violeta
  'B': 330   // Rojo violáceo
};

// Mapa de cualidades de acorde a modificadores de color
const CHORD_QUALITY_MODIFIERS: Record<string, { saturation: number, lightness: number, hueShift: number }> = {
  'maj': { saturation: 80, lightness: 50, hueShift: 0 },      // Colores vivos y brillantes
  'min': { saturation: 70, lightness: 45, hueShift: -15 },    // Colores más oscuros y menos saturados
  'dim': { saturation: 60, lightness: 40, hueShift: -30 },    // Colores más oscuros y menos saturados
  'aug': { saturation: 90, lightness: 55, hueShift: 15 },     // Colores más brillantes y saturados
  'sus2': { saturation: 75, lightness: 52, hueShift: 10 },    // Colores intermedios
  'sus4': { saturation: 75, lightness: 52, hueShift: -10 },   // Colores intermedios
  'maj7': { saturation: 85, lightness: 48, hueShift: 5 },     // Colores más saturados
  'm7': { saturation: 75, lightness: 43, hueShift: -5 },      // Colores más oscuros
  'dom7': { saturation: 80, lightness: 45, hueShift: 0 },     // Colores intermedios
  'maj9': { saturation: 90, lightness: 46, hueShift: 8 },     // Colores más saturados
  'm9': { saturation: 80, lightness: 41, hueShift: -8 },      // Colores más oscuros
  'dom9': { saturation: 85, lightness: 43, hueShift: 0 },     // Colores intermedios
  'maj11': { saturation: 95, lightness: 44, hueShift: 10 },   // Colores más saturados
  'm11': { saturation: 85, lightness: 39, hueShift: -10 },    // Colores más oscuros
  'dom11': { saturation: 90, lightness: 41, hueShift: 0 },    // Colores intermedios
  'maj13': { saturation: 100, lightness: 42, hueShift: 12 },  // Colores más saturados
  'm13': { saturation: 90, lightness: 37, hueShift: -12 },    // Colores más oscuros
  'dom13': { saturation: 95, lightness: 39, hueShift: 0 }     // Colores intermedios
};

export function chordToColor(chordName: string): string {
  // Extraer la nota base y la calidad del acorde
  const match = chordName.match(/^([A-G]#?)(\d+)?(.*)$/);
  if (!match) return '#808080'; // Gris por defecto

  const [, note, octave, quality] = match;
  const baseHue = NOTE_TO_HUE[note] || 0;
  const modifier = CHORD_QUALITY_MODIFIERS[quality] || CHORD_QUALITY_MODIFIERS['maj'];

  // Calcular el tono final con el desplazamiento
  const finalHue = (baseHue + modifier.hueShift + 360) % 360;

  // Convertir HSL a RGB y luego a HEX
  const [r, g, b] = hslToRgb(finalHue, modifier.saturation, modifier.lightness);
  return rgbToHex(r, g, b);
}


