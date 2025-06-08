import * as Tone from "tone";
import { OCTAVES_RANGE } from "../../PianoBase/PianoBase.types";
import type {
  tChord, tNote, tNoteWithOctave, tChordQualities,
  tChordWithName, tOctaveRange
} from "../../PianoBase/PianoBase.types";
import { CHORD_INTERVALS } from "../../PianoBase/PianoBase.types";

function calculateChordNotes(note: tNoteWithOctave, type: tChordQualities): tChord {
  const rootFrequency = Tone.Frequency(note);
  return CHORD_INTERVALS[type].map(i => rootFrequency.transpose(i).toNote() as tNoteWithOctave);
}

function invertChord(notes: tChord, inversion: number): tChord {
  debugger
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
  const result: t = [];
  const chord: tChord = baseChord.chord;

  for (let i = 1; i <= inversions; i++) {
    debugger
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

export function chordToColor(notes: tChord): string {
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
  const extractBaseNote = (note: tNoteWithOctave): { noteName: string, octave: number } => {
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
