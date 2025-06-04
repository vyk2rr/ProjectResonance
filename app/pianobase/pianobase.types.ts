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

