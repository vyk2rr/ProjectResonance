import * as Tone from "tone";
import { OCTAVES_RANGE } from "../PianoBase/PianoBase.types";
import type {
  tChord, tNote, tNoteWithOctave, tChordQualities,
  tChordWithName, tOctaveRange
} from "../PianoBase/pianobase.types";
import { CHORD_INTERVALS } from "../PianoBase/PianoBase.types";

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
const NOTE_TO_HUE: Record<tNote, number> = {
  'C': 0,     // Rojo vivo
  'D': 30,    // Naranja brillante
  'E': 60,    // Amarillo intenso
  'F': 120,   // Verde esmeralda
  'G': 195,   // Azul cielo
  'A': 240,   // Azul profundo
  'B': 270    // Morado intenso
};

// Mapa de cualidades de acorde a modificadores de color
const CHORD_QUALITY_MODIFIERS: Record<string, { saturation: number, lightness: number, hueShift: number }> = {
  'maj': { saturation: 100, lightness: 50, hueShift: 0 },      // Colores vivos y brillantes
  'maj7': { saturation: 100, lightness: 60, hueShift: 5 },     // Versión rica
  'maj9': { saturation: 100, lightness: 78, hueShift: 8 },     // Versión rica
  'maj11': { saturation: 100, lightness: 80, hueShift: 10 },   // Versión rica
  'maj13': { saturation: 100, lightness: 90, hueShift: 12 },   // Versión rica

  'min': { saturation: 80, lightness: 40, hueShift: -5 },      // Versión más oscura y menos saturada
  'm7': { saturation: 85, lightness: 40, hueShift: -5 },       // Versión oscura
  'm9': { saturation: 90, lightness: 45, hueShift: -8 },       // Versión oscura
  'm11': { saturation: 95, lightness: 50, hueShift: -10 },     // Versión oscura
  'm13': { saturation: 100, lightness: 60, hueShift: -12 },    // Versión oscura

  'dim': { saturation: 80, lightness: 30, hueShift: 28 },     // Versión apagada y oscura
  'aug': { saturation: 100, lightness: 60, hueShift: 5 },      // Versión más brillante del color base

  'sus2': { saturation: 90, lightness: 52, hueShift: 5 },      // Versión suave
  'sus4': { saturation: 90, lightness: 52, hueShift: -5 },     // Versión suave

  'dom7': { saturation: 95, lightness: 45, hueShift: 0 },      // Versión intermedia
  'dom9': { saturation: 95, lightness: 43, hueShift: 0 },      // Versión intermedia
  'dom11': { saturation: 100, lightness: 41, hueShift: 0 },    // Versión intermedia
  'dom13': { saturation: 100, lightness: 39, hueShift: 0 }     // Versión intermedia
};

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

export function chordToColor(notes: tChord): string {
  if (notes.length === 0) return '#808080';

  // Extraer la nota base y la calidad del acorde
  const rootNote = notes[0];
  const baseNote = simplifyNoteName(rootNote);
  const naturalNote = getNaturalNote(baseNote);
  const baseHue = NOTE_TO_HUE[naturalNote];

  // Determinar la calidad del acorde basado en los intervalos
  const intervals = notes.map(note => Tone.Frequency(note).toMidi());
  const rootInterval = intervals[0];
  const relativeIntervals = intervals.map(i => i - rootInterval);

  // Identificar la calidad del acorde basado en los intervalos
  let quality = 'maj';
  if (relativeIntervals.includes(3)) { // Tercera menor
    quality = 'min';
  }
  if (relativeIntervals.includes(6)) { // Quinta disminuida
    quality = 'dim';
  }
  if (relativeIntervals.includes(8)) { // Quinta aumentada
    quality = 'aug';
  }
  if (relativeIntervals.includes(2)) { // Sus2
    quality = 'sus2';
  }
  if (relativeIntervals.includes(5)) { // Sus4
    quality = 'sus4';
  }
  if (relativeIntervals.includes(11)) { // Séptima mayor
    quality = 'maj7';
  }
  if (relativeIntervals.includes(10)) { // Séptima menor
    quality = 'm7';
  }
  if (relativeIntervals.includes(14)) { // Novena mayor
    quality = 'maj9';
  }
  if (relativeIntervals.includes(13)) { // Novena menor
    quality = 'm9';
  }
  if (relativeIntervals.includes(17)) { // Undécima
    quality = 'maj11';
  }
  if (relativeIntervals.includes(21)) { // Decimotercera
    quality = 'maj13';
  }

  const modifier = CHORD_QUALITY_MODIFIERS[quality as keyof typeof CHORD_QUALITY_MODIFIERS] || CHORD_QUALITY_MODIFIERS['maj'];

  // Calcular el color final
  const finalHue = (baseHue + modifier.hueShift + 360) % 360;
  const [r, g, b] = hslToRgb(finalHue, modifier.saturation, modifier.lightness);
  return rgbToHex(r, g, b);
}

// convierte la búsqueda a mayúsculas
export function extractNotesFromSearchTerm(term: string): string[] {
  return (term.match(/([A-G][#b]?)/gi) || []).map(n => n.toUpperCase());
}

export const filterChords = (chords: tChordWithName[], searchTerm: string): tChordWithName[] => {
  if (!searchTerm) return chords;

  const upperTerm = searchTerm.toUpperCase();
  const searchNotes = extractNotesFromSearchTerm(upperTerm);

  // Si contiene notas (por ejemplo "FACE")
  if (searchNotes.length > 0) {
    return chords.filter(chord => {
      const chordNotes = chord.chord.map(simplifyNoteName);
      return searchNotes.every(n => chordNotes.includes(n));
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
    id: `${note}_${type}`,
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