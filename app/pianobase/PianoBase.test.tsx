import { generateNotes } from "./PianoBase.utils";

jest.mock("tone", () => ({
  PolySynth: function () { return { triggerAttackRelease: () => {}, dispose: () => {}, chain: () => {} }; },
  Synth: function () {},
  Filter: function () { return { dispose: () => {} }; },
  Compressor: function () { return { dispose: () => {} }; },
  Reverb: function () { return { toDestination: () => {}, dispose: () => {} }; },
  Time: function () { return { toMilliseconds: () => 500 }; }
}));

describe("generateNotes", () => {
  it("should generate notes for 3 octaves starting from C4", () => {
    const result = generateNotes(3, 4);
    const expectedWhite = [
      "C4", "D4", "E4", "F4", "G4", "A4", "B4",
      "C5", "D5", "E5", "F5", "G5", "A5", "B5",
      "C6", "D6", "E6", "F6", "G6", "A6", "B6",
      "C7"
    ];
    const expectedBlack = [
      "C#4", "D#4", "F#4", "G#4", "A#4",
      "C#5", "D#5", "F#5", "G#5", "A#5",
      "C#6", "D#6", "F#6", "G#6", "A#6"
    ];
    expect(result.white).toEqual(expectedWhite);
    expect(result.black).toEqual(expectedBlack); 
  });
});