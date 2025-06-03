export type OctaveRangeType = 1 | 2 | 3 | 4 | 5;
export type chordMapType = Record<string, string[]>;

export type PianoBaseProps = {
  createSynth?: () => Tone.Synth | Tone.DuoSynth;
  chordMap?: chordMapType;
  octaves?: OctaveRangeType;
};

