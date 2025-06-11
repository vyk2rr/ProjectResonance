import * as Tone from "tone";
import { CHORD_INTERVALS } from "../PianoBase/PianoBase.types";
import type {
  tChord, tNote, tNoteWithOctave, tChordQualities,
  tChordWithName, tOctaveRange, tNoteName
} from "../PianoBase/PianoBase.types";

function calculateChordNotes(note: tNoteWithOctave, type: tChordQualities): tChord {
  const rootFrequency = Tone.Frequency(note);
  return CHORD_INTERVALS[type].map(i => rootFrequency.transpose(i).toNote() as tNoteWithOctave);
}

function invertChord(notes: tChord, inversion: number): tChord {
  const result: tChord = [...notes];
  for (let i = 0; i < inversion; i++) {
    const note = result.shift();
    if (note) {
      const octaveUp: tNoteWithOctave = Tone.Frequency(note).transpose(12).toNote() as tNoteWithOctave;
      result.push(octaveUp);
    }
  }
  return result;
}

export function simplifyNoteName(note: tNoteWithOctave): tNote {
  return note.replace(/\d+/, '') as tNote;
}

// Mapa de notas a tonos base (colores más vivos para acordes mayores)
const NOTE_TO_HUE: Partial<Record<tNoteName, number>> = {
  'C': 0,       // Rojo
  'C#': 15,     // Rojo anaranjado (intermedio hacia D)
  'D': 30,      // Naranja
  'D#': 45,     // Naranja amarillento (intermedio hacia E)
  'E': 60,      // Amarillo
  'F': 120,     // Verde
  'F#': 150,    // Verde azulado (intermedio hacia G)
  'G': 180,     // Cian
  'G#': 210,    // Azul violáceo (intermedio hacia A)
  'A': 240,     // Azul
  'A#': 270,    // Violeta
  'B': 300      // Magenta
};

const CHORD_QUALITY_MODIFIERS: Record<tChordQualities, { saturation: number; lightness: number }> = {
  maj:    { saturation: 80,  lightness: 50 },
  min:    { saturation: 40,  lightness: 50 },
  dim:    { saturation: 25,  lightness: 50 },
  aug:    { saturation: 80,  lightness: 65 },
  sus2:   { saturation: 80,  lightness: 40 },
  sus4:   { saturation: 80,  lightness: 50 },

  maj7:   { saturation: 100, lightness: 50 },
  m7:     { saturation: 60,  lightness: 50 },
  dom7:   { saturation: 80,  lightness: 45 },

  maj9:   { saturation: 100, lightness: 55 },
  m9:     { saturation: 60,  lightness: 55 },
  dom9:   { saturation: 80,  lightness: 50 },

  maj11:  { saturation: 100, lightness: 60 },
  m11:    { saturation: 60,  lightness: 60 },
  dom11:  { saturation: 80,  lightness: 55 },

  maj13:  { saturation: 100, lightness: 65 },
  m13:    { saturation: 60,  lightness: 65 },
  dom13:  { saturation: 80,  lightness: 60 },
};

export function getChordColor(
  rootNote: tNoteName,
  quality: tChordQualities
) {
  const base = NOTE_TO_HUE[rootNote] !== undefined
    ? { hue: NOTE_TO_HUE[rootNote] }
    : { hue: 0 }
  const mod = CHORD_QUALITY_MODIFIERS[quality] || { saturation: 100, lightness: 50 };
  const { hue } = base;
  const { saturation, lightness } = mod;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
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

// Función auxiliar para obtener la nota natural
function getNaturalNote(note: string): tNote {
  const naturalNote = note.replace(/[#b]/, '');
  if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(naturalNote)) {
    return naturalNote as tNote;
  }
  return 'C'; // Nota por defecto
}

// Función auxiliar para generar un degradado
function generateGradient(startHue: number, endHue: number, saturation: number, lightness: number): string {
  const steps = 5; // Aumentamos los pasos para un degradado más suave
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const hue = startHue + (endHue - startHue) * t;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    colors.push(rgbToHex(r, g, b));
  }

  return `linear-gradient(to right, ${colors.join(', ')})`;
}

// convierte la búsqueda a mayúsculas
export function extractNotesFromSearchTerm(term: string): string[] {
  return (term.match(/([A-G][#b]?)/gi) || []).map(n => n.toUpperCase());
}

export const filterChords = (chords: tChordWithName[], searchTerm: string): tChordWithName[] => {
  if (!searchTerm) return chords;

  const upperTerm = searchTerm.toUpperCase();
  const searchNotes:string[] = extractNotesFromSearchTerm(upperTerm);

  // Si contiene notas (por ejemplo "FACE")
  if (searchNotes.length > 0) {
    return chords.filter(chord => {
      const chordNotes = chord.chord.map(simplifyNoteName);
      return searchNotes.every(n => chordNotes.includes(n as tNote));
    });
  }

  // Si no contiene notas, buscar por nombre
  return chords.filter(chord =>
    chord.name.toUpperCase().includes(upperTerm) ||
    chord.displayNotes.toUpperCase().includes(upperTerm)
  );
};

// para construir un acorde base
export function buildBaseChord(note: tNoteWithOctave, type: tChordQualities): tChordWithName {
  const rootFrequency = calculateChordNotes(note, type);
  const baseNoteName: tNote = simplifyNoteName(note);
  const simplifiedNotes: tNote[] = rootFrequency.map(simplifyNoteName);

  return {
    id: `${note}_${type}`, // just an identifier, Ej: "A#5maj"
    quality: type, // Ej: "maj", "min", etc.
    rootNote: baseNoteName,
    name: `${baseNoteName}${type}`, // Ej: "Cmaj"
    displayNotes: simplifiedNotes.join(" "), // Ej: "C E G"
    chord: rootFrequency // Mantenemos las notas completas para la lógica del piano
  };
}

// para construir las inversiones de un acorde base
export function buildChordInversions(baseChord: ReturnType<typeof buildBaseChord>, inversions: number) {
  const result = [];
  const chord: tChord = baseChord.chord;

  for (let i = 1; i <= inversions; i++) {
    const inverted = invertChord(chord, i);
    const simplifiedInverted = inverted.map(simplifyNoteName);
    result.push({
      id: `${baseChord.id}_inv${i}`,
      rootNote: baseChord.rootNote,
      quality: baseChord.quality,
      name: `${baseChord.name} (${i}ª)`,
      displayNotes: simplifiedInverted.join(" "),
      chord: inverted
    });
  }

  return result;
}

// genera todas las combinaciones para una nota específica, ejemplo "D"
export const generateChordsForNote = (note: tNote, selectedOctave: tOctaveRange): tChordWithName[] => {
  const noteWithOctave: tNoteWithOctave = note + selectedOctave as tNoteWithOctave;

  return [
    buildBaseChord(noteWithOctave, "maj"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "maj"), 2),
    buildBaseChord(noteWithOctave, "min"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "min"), 2),
    buildBaseChord(noteWithOctave, "dim"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "dim"), 2),
    buildBaseChord(noteWithOctave, "aug"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "aug"), 2),
    buildBaseChord(noteWithOctave, "sus2"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "sus2"), 2),
    buildBaseChord(noteWithOctave, "sus4"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "sus4"), 2),
    buildBaseChord(noteWithOctave, "maj7"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "maj7"), 3),
    buildBaseChord(noteWithOctave, "m7"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "m7"), 3),
    buildBaseChord(noteWithOctave, "dom7"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "dom7"), 2),
    buildBaseChord(noteWithOctave, "maj9"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "maj9"), 3),
    buildBaseChord(noteWithOctave, "m9"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "m9"), 3),
    buildBaseChord(noteWithOctave, "dom9"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "dom9"), 3),
    buildBaseChord(noteWithOctave, "maj11"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "maj11"), 3),
    buildBaseChord(noteWithOctave, "m11"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "m11"), 3),
    buildBaseChord(noteWithOctave, "dom11"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "dom11"), 3),
    buildBaseChord(noteWithOctave, "maj13"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "maj13"), 3),
    buildBaseChord(noteWithOctave, "m13"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "m13"), 3),
    buildBaseChord(noteWithOctave, "dom13"),
    ...buildChordInversions(buildBaseChord(noteWithOctave, "dom13"), 3),
  ];


};
