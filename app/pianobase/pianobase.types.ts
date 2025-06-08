import * as Tone from "tone";

export const OCTAVES_RANGE = [1, 2, 3, 4, 5, 6, 7] as const;
export const NOTES = [
  'Ab', 'A', 'A#', 'Bb', 'B', 'B#', 'Cb', 'C', 'C#', 'Db',
  'D', 'D#', 'Eb', 'E', 'E#', 'Fb', 'F', 'F#', 'Gb', 'G', 'G#'
] as const;
export const SHARP_TO_FLAT_MAP: Partial<Record<tNoteName, tNoteName>> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb"
};
export const CHORD_QUALITIES = [
  'maj', 'min', 'dim', 'aug',
  'sus2', 'sus4',
  'maj7', 'm7', 'dom7',
  'maj9', 'm9', 'dom9',
  'maj11', 'm11', 'dom11',
  'maj13', 'm13', 'dom13'
] as const;
export const MAJOR_SCALE_CHORD_QUALITIES = [
  'maj', 'min', 'dim', 'aug',
  'sus2', 'sus4',
  'maj7', 'm7', 'dom7',
  'maj9', 'm9', 'dom9',
  'maj11', 'm11', 'dom11',
  'maj13', 'm13', 'dom13'
] as const;
export const MINOR_SCALE_CHORD_QUALITIES = [
  'min', 'dim', 'aug',
  'sus2', 'sus4',
  'm7', 'dom7',
  'm9', 'dom9',
  'm11', 'dom11',
  'm13', 'dom13'
] as const;

export const MODES = [
  'ionian', 'dorian', 'phrygian',
  'lydian', 'mixolydian', 'aeolian',
  'locrian'
] as const;

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],
  dom9: [0, 4, 7, 10, 14],
  maj11: [0, 4, 7, 11, 14, 17],
  m11: [0, 3, 7, 10, 14, 17],
  dom11: [0, 4, 7, 10, 14, 17],
  maj13: [0, 4, 7, 11, 14, 17, 21],
  m13: [0, 3, 7, 10, 14, 17, 21],
  dom13: [0, 4, 7, 10, 14, 17, 21],
};

export type tOctaveRange = typeof OCTAVES_RANGE[number]; // example: 1, 2, 3, 4, 5
export type tChordQualities = typeof CHORD_QUALITIES[number]; // "maj", "min", "dim", etc.
export type tMajorScaleChordQualities = typeof MAJOR_SCALE_CHORD_QUALITIES[number]; // "maj", "min"...
export type tMinorScaleChordQualities = typeof MINOR_SCALE_CHORD_QUALITIES[number]; // "min", "dim"...

export type tMode = typeof MODES[number]; // example: "ionian", "dorian", etc.
export type tNoteName = typeof NOTES[number]; // example: "C", "Db", "E#", etc.
export type tNoteWithOctave = `${tNoteName}${tOctaveRange}`; // example: "C4", "D#5", "Bb3", etc.
export type tNoteWQuality = `${tNoteName}${tChordQualities}`; // example: "Cmaj", "Dmin", "E#sus4", etc.
export type tNoteWOCtaveQuality = `${tNoteName}${tOctaveRange}${tChordQualities}`; // example: "C3maj", "Dmin", "E#sus4", etc.
export type tPercentString = `${number}%`; // example: "Cmaj", "Dmin", "E#sus4", etc.

export type tChord = tNoteWithOctave[]
export type tChordSequence = tChord[]

export type SupportedSynthType =
  | Tone.Synth
  | Tone.DuoSynth
  | Tone.PolySynth
  | Tone.MonoSynth
  | Tone.FMSynth
  | Tone.PluckSynth;

export type tChordMap = Record<string, tNoteWithOctave[]>;

export type tPianoNotes = {
  white: tNoteWithOctave[];
  black: tNoteWithOctave[];
};

// Examples: 
// const octaveRange: tOctaveRange = 4;
// const chordQualities: tChordQualities = 'maj';
// const majorScaleChordQualities: tMajorScaleChordQualities = 'maj';
// const minorScaleChordQualities: tMinorScaleChordQualities = 'min';

// const mode: tMode = 'ionian';
// const noteName: tNoteName = 'C';
// const noteWithOctave: tNoteWithOctave = 'D4';
// const noteWQuality: tNoteWQuality = 'Abmaj13'
// const noteWOCtaveQuality: tNoteWOCtaveQuality = 'A#5dom11'
// const percentString: tPercentString = '50%';

// const chord: tChord = ['C4', 'E4', 'G4'];
// const chordSequence: tChordSequence = [
//   ['C4', 'E4', 'G4'],
//   ['D4', 'F#4', 'A4']
// ];
// const chordMap:tChordMap =  {
//   'Cmaj': ['C4', 'E4', 'G4'],
//   'Dmin': ['D4', 'F4', 'A4'],
//   'E#sus4': ['E#4', 'A#4', 'B#4']
// } 
// const pianoNotes: tPianoNotes = {
//   white: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
//   black: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4']
// };