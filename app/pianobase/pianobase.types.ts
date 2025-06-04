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

export type PianoBaseProps = {
  createSynth?: () => SupportedSynth;
  chordMap?: chordMapType;
  octaves?: OctaveRangeType;
  showChordOnThePiano?: string[];
};

