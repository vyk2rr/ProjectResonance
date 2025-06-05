import * as Tone from "tone";
import type { ChordType } from "../../PianoBase/PianoBase.types";
import { chordIntervals } from "../../PianoBase/PianoBase.types";

function getChord(note: string, type: ChordType): string[] {
  const base = Tone.Frequency(note);
  return chordIntervals[type].map(i => base.transpose(i).toNote());
}

function invertChord(notes: string[], inversion: number): string[] {
  const result = [...notes];
  for (let i = 0; i < inversion; i++) {
    const note = result.shift();
    if (note) {
      const octaveUp = Tone.Frequency(note).transpose(12).toNote();
      result.push(octaveUp);
    }
  }
  return result;
}

export function simplifyNoteName(note: string): string {
  // Elimina el número de octava (ej: "C4" -> "C")
  return note.replace(/\d+/, '');
}

export function buildChordInversions(note: string, type: ChordType, inversions: number) {
  const base = getChord(note, type);

  // Simplificamos el nombre del acorde base
  const baseNoteName = simplifyNoteName(note);
  const simplifiedNotes = base.map(simplifyNoteName);

  const result = [{
    id: `${note}_${type}`,
    name: `${baseNoteName}${type}`, // Ej: "Cmaj"
    displayNotes: simplifiedNotes.join(" "), // Ej: "C E G"
    notes: base // Mantenemos las notas completas para la lógica del piano
  }];

  for (let i = 1; i <= inversions; i++) {
    const inverted = invertChord(base, i);
    const simplifiedInverted = inverted.map(simplifyNoteName);
    result.push({
      id: `${note}_${type}_inv${i}`,
      name: `${baseNoteName}${type} (${i}ª inv)`,
      displayNotes: `${simplifiedInverted.join(" ")}`,
      notes: inverted
    });
  }

  return result;
}

export const generateChordsForNote = (note: string, selectedOctave) => {
  const noteWithOctave = note + selectedOctave;
  return [
    ...buildChordInversions(noteWithOctave, "maj", 2),
    ...buildChordInversions(noteWithOctave, "min", 2),
    ...buildChordInversions(noteWithOctave, "dim", 2),
    ...buildChordInversions(noteWithOctave, "aug", 2),
    ...buildChordInversions(noteWithOctave, "sus2", 2),
    ...buildChordInversions(noteWithOctave, "sus4", 2),
    ...buildChordInversions(noteWithOctave, "maj7", 3),
    ...buildChordInversions(noteWithOctave, "m7", 3),
    ...buildChordInversions(noteWithOctave, "dom7", 2),
    ...buildChordInversions(noteWithOctave, "maj9", 3),
    ...buildChordInversions(noteWithOctave, "m9", 3),
    ...buildChordInversions(noteWithOctave, "dom9", 3),
    ...buildChordInversions(noteWithOctave, "maj11", 3),
    ...buildChordInversions(noteWithOctave, "m11", 3),
    ...buildChordInversions(noteWithOctave, "dom11", 3),
    ...buildChordInversions(noteWithOctave, "maj13", 3),
    ...buildChordInversions(noteWithOctave, "m13", 3),
    ...buildChordInversions(noteWithOctave, "dom13", 3),
  ];
};

export function chordToColor(notes: string[]): string {
  // Mapeo de notas a matices (hue) siguiendo el espectro del arcoíris
  const noteToHue: Record<string, number> = {
    'C': 0,    // Rojo (0)
    'C#': 20, 'Db': 20,  // Rojo-Naranja
    'D': 40,   // Naranja
    'D#': 50, 'Eb': 50,  // Naranja-Amarillo
    'E': 60,   // Amarillo
    'F': 120,  // Verde
    'F#': 150, 'Gb': 150, // Verde-Azulado
    'G': 180,  // Azul
    'G#': 200, 'Ab': 200, // Azul medio
    'A': 220,  // Azul oscuro
    'A#': 260, 'Bb': 260, // Azul-Violeta
    'B': 280   // Violeta
  };

  // Extract base note name without octave (e.g., "G4" -> "G")
  const extractBaseNote = (note: string): { noteName: string, octave: number } => {
    const match = note.match(/^([A-G][#b]?)(\d+)?/);
    if (!match) return { noteName: note, octave: 4 }; // default to octave 4 if not found
    return {
      noteName: match[1],
      octave: match[2] ? parseInt(match[2]) : 4
    };
  };

  // Convierte HSL a RGB (h: 0-360, s: 0-100, l: 0-100)
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Convierte RGB a HEX
  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  if (notes.length === 0) return '#000000';

  // Usar la nota raíz para el matiz base y calcular octava promedio
  const rootNoteInfo = extractBaseNote(notes[0]);
  const hue = noteToHue[rootNoteInfo.noteName];
  if (hue === undefined) throw new Error(`Nota no válida: ${rootNoteInfo.noteName}`);

  // Calcular la octava promedio del acorde
  const octaveSum = notes.reduce((sum, note) => {
    const { octave } = extractBaseNote(note);
    return sum + octave;
  }, 0);
  const averageOctave = octaveSum / notes.length;

  // Ajustar saturación y luminosidad basado en el tipo de acorde y octava
  let saturation = 100; // Máxima saturación para colores más vivos
  let lightness = 50;   // Luminosidad base

  // Ajustar luminosidad basada en la diferencia de octava con respecto a la octava 4 (base)
  const octaveDiff = averageOctave - 4;
  lightness += octaveDiff * 15; // Aumentar/disminuir 15% por cada octava de diferencia

  // Ajustar saturación basada en el número de notas (acordes extendidos)
  const baseNoteCount = 4; // Consideramos maj7 como base (4 notas)
  const extraNotes = Math.max(0, notes.length - baseNoteCount);
  saturation = Math.max(75, 100 - extraNotes * 8); // Reducir saturación gradualmente por cada nota extra

  // Si es un acorde menor (tiene una tercera menor)
  if (notes.length >= 3) {
    const intervals = notes.map(note => Tone.Frequency(note).toMidi());
    const thirdInterval = intervals[1] - intervals[0];
    if (thirdInterval === 3) { // Tercera menor
      lightness -= 12; // Más oscuro para acordes menores
    }
  }

  // Ajustar luminosidad progresivamente basado en el número de notas
  const luminosityChangePerNote = 6; // Cambio más notorio por nota
  lightness = Math.max(30, Math.min(70, lightness + extraNotes * luminosityChangePerNote));

  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return rgbToHex(r, g, b);
}

export const filterChords = (chords: any[], searchTerm: string) => {
  if (!searchTerm) return chords;

  // Normalizar el término de búsqueda
  const searchNotes = searchTerm
    .toUpperCase()
    .split(/[-\s]+/)  // Primero intentamos separar por guión o espacio
    .map(term => {
      // Si el término tiene múltiples caracteres sin separador, lo separamos en notas individuales
      if (term.length > 1) {
        return term.match(/[A-G][#b]?/g) || [term];
      }
      return [term];
    })
    .flat()
    .map(note => note.trim())
    .filter(note => note.length > 0); // Eliminar strings vacíos

  return chords.filter(chord => {
    const chordNotes = chord.notes.map(simplifyNoteName);

    // Verificar que todas las notas de búsqueda estén presentes en orden
    let currentIndex = 0;
    for (const searchNote of searchNotes) {
      while (currentIndex < chordNotes.length) {
        if (chordNotes[currentIndex] === searchNote) {
          break;
        }
        currentIndex++;
      }

      if (currentIndex >= chordNotes.length) {
        return false;
      }

      currentIndex++;
    }

    return true;
  });
};