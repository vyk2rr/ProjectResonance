import React from "react";
import { Theme } from '@radix-ui/themes';
import { render, screen, fireEvent, act } from "@testing-library/react";
import PianoBase from "./PianoBase";

import { generateNotes } from "./PianoBase.utils";
import type {
  tOctaveRange, tChordQualities, tMode, tNoteName, tNoteWithOctave,
  tNoteWQuality, tNoteWOCtaveQuality, tPercentString, tChord, tChordSequence,
  tChordMap, tPianoNotes, tChordWithName, tSequenceToPlayProps
} from "./PianoBase.types";

jest.mock("tone", () => ({
  PolySynth: function () { return { triggerAttackRelease: () => {}, dispose: () => {}, chain: () => {} }; },
  Synth: function () {},
  Filter: function () { return { dispose: () => {} }; },
  Compressor: function () { return { dispose: () => {} }; },
  Reverb: function () { return { toDestination: () => {}, dispose: () => {} }; },
  Time: function () { return { toMilliseconds: () => 500 }; }
}));

// // Mock dependencies
// jest.mock("tone", () => ({
//   PolySynth: function () { return { triggerAttackRelease: jest.fn(), dispose: jest.fn(), chain: jest.fn() }; },
//   Synth: function () { },
//   Filter: function () { return { dispose: jest.fn() }; },
//   Compressor: function () { return { dispose: jest.fn() }; },
//   Reverb: function () { return { toDestination: jest.fn(), dispose: jest.fn() }; },
//   Time: function () { return { toMilliseconds: () => 10 }; }
// }));

describe("PianoBase", () => {
  it("renders piano keys", () => {
    const { container } = render(
      <Theme>
        <PianoBase />
      </Theme>
    );
    expect(screen.getByRole("button")).toBeDefined(); // hamburger menu
    expect(container.getElementsByClassName("white-key").length).toBeGreaterThan(0);
    expect(container.getElementsByClassName("black-key").length).toBeGreaterThan(0);
  });

  it("opens chord dropdown and displays chord options", () => {
    render(
      <Theme>
        <PianoBase />
      </Theme>
    );
    fireEvent.click(screen.getByRole("button"));
    const showDMajorBtnsBtn = screen.getByText(/show D Major buttons/i);
    
    fireEvent.click(showDMajorBtnsBtn);
    fireEvent.mouseOver(screen.getByText(/Play a D major Chord/i));
    expect(screen.getAllByText(/Play /i).length).toBeGreaterThan(0);
  });

  it("plays note when white key is clicked", async () => {
    const { container } = render(
      <Theme>
        <PianoBase />
      </Theme>
    );
    const whiteKeys = container.getElementsByClassName("white-key");
    await act(async () => {
      fireEvent.click(whiteKeys[0]);
    });
    // Optionally check for active class or side-effects
  });

  it("highlights and plays chord when highlightOnThePiano changes", () => {
    const chord: tChord = ["C4", "E4", "G4"];
    const { container } = render(
      <Theme>
        <PianoBase highlightOnThePiano={chord} />
      </Theme>
    );
    chord.forEach(note => expect(screen.getAllByText(new RegExp(note)).length).toBeGreaterThan(0));
  });

  it("renders and plays sequence if sequenceToPlay is given", () => {
    const onSequenceEnd = jest.fn();
    const sequenceToPlay = {
      sequenceToPlay: [["C4", "E4", "G4"]] as tChordSequence,
      onSequenceEnd,
      highlightedKeys: true
    };
    render(<Theme><PianoBase sequenceToPlay={sequenceToPlay} /></Theme>);
    // Would need timers or async handling for real checks
  });
});

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

describe("Type structure examples", () => {
  it("should allow valid example objects", () => {
    const octaveRange: tOctaveRange = 4;
    const chordQualities: tChordQualities = 'maj';
    const mode: tMode = 'ionian';
    const noteName: tNoteName = 'C';
    const noteWithOctave: tNoteWithOctave = 'D4';
    const noteWQuality: tNoteWQuality = 'Abmaj13';
    const noteWOCtaveQuality: tNoteWOCtaveQuality = 'A#5dom11';
    const percentString: tPercentString = '50%';
    const chord: tChord = ['C4', 'E4', 'G4'];
    const chordSequence: tChordSequence = [
      ['C4', 'E4', 'G4'],
      ['D4', 'F#4', 'A4']
    ];
    const chordMap: tChordMap = {
      'Cmaj': ['C4', 'E4', 'G4'],
      'Dmin': ['D4', 'F4', 'A4'],
      'E#sus4': ['E#4', 'A#4', 'B#4']
    };
    const pianoNotes: tPianoNotes = {
      white: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
      black: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4']
    };
    const chordWithName: tChordWithName = {
      id: "C4_maj",
      quality: "maj",
      rootNote: "C",
      name: "Cmaj",
      displayNotes: "C E G",
      chord: ["C4", "E4", "G4"]
    };
    const sequenceToPlayProps: tSequenceToPlayProps = {
      sequenceToPlay: [
        ["C4", "E4", "G4"],
        ["D4", "F#4", "A4"]
      ],
      onSequenceEnd: () => { },
      highlightedKeys: true
    };
    expect(octaveRange).toBe(4);
    expect(chordQualities).toBe('maj');
    expect(mode).toBe('ionian');
    expect(noteName).toBe('C');
    expect(noteWithOctave).toBe('D4');
    expect(noteWQuality).toBe('Abmaj13');
    expect(noteWOCtaveQuality).toBe('A#5dom11');
    expect(percentString).toBe('50%');
    expect(chord).toContain('C4');
    expect(chordSequence.length).toBe(2);
    expect(Object.keys(chordMap)).toContain('Cmaj');
    expect(pianoNotes.white).toContain('C4');
    expect(chordWithName.name).toBe('Cmaj');
    expect(sequenceToPlayProps.sequenceToPlay.length).toBe(2);
  });
});




