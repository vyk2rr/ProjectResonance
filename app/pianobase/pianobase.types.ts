import * as Tone from "tone";
export type OctaveRangeType = 1 | 2 | 3 | 4 | 5;
export type chordMapType = Record<string, string[]>;

export type SupportedSynth =
  | Tone.Synth
  | Tone.DuoSynth
  | Tone.PolySynth
  | Tone.MonoSynth
  | Tone.FMSynth
  | Tone.PluckSynth;

export type ChordType =
  | "maj" | "min" | "dim" | "aug"
  | "maj7" | "m7" | "dom7"
  | "maj9" | "m9" | "dom9"
  | "maj11" | "m11" | "dom11"
  | "maj13" | "m13" | "dom13";

export type PianoBaseProps = {
  createSynth?: () => SupportedSynth;
  chordMap?: chordMapType;
  octave?: OctaveRangeType;
  octaves?: OctaveRangeType;
  showChordOnThePiano?: string[];
};


export const chordIntervals: Record<ChordType, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
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

