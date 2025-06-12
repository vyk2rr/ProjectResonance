import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Theme } from '@radix-ui/themes';
import PianoBase from "./PianoBase";

import { generateNotes, getBlackKeyLeft } from "./PianoBase.utils";
import type {
  tOctaveRange, tChordQualities, tMode, tNoteName, tNoteWithOctave,
  tNoteWQuality, tNoteWOCtaveQuality, tPercentString, tChord, tChordSequence,
  tChordMap, tPianoNotes, tChordWithName, tSequenceToPlayProps
} from "./PianoBase.types";

jest.mock("tone", () => ({
  PolySynth: function () { return { triggerAttackRelease: () => { }, dispose: () => { }, chain: () => { } }; },
  Synth: function () { },
  Filter: function () { return { dispose: () => { } }; },
  Compressor: function () { return { dispose: () => { } }; },
  Reverb: function () { return { toDestination: () => { }, dispose: () => { } }; },
  Time: function () { return { toMilliseconds: () => 500 }; }
}));

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

  //   it("opens chord dropdown and displays chord options", async () => {
  //     const { container } = render(
  //       <Theme>
  //         <PianoBase />
  //       </Theme>
  //     );
  //   // Haz click en el botón del menú (por aria-label)
  //   fireEvent.click(container.getElementsByTagName('button')[0]); // Asumiendo que el primer botón es el del menú
  //   // Espera a que aparezca el item en el DOM (Radix puede usar portal)
  //   screen.debug();
  //   debugger;
  //   const item = await screen.findByText(/show D Major buttons/i, {}, { timeout: 2000 });
  //   expect(item).toBeInTheDocument();
  // debugger;
  //     fireEvent.click(screen.getByRole("button"));
  //     fireEvent.click(item)
  // debugger
  //     const showDMajorBtnsBtn = screen.getByText(/show D Major buttons/i);
  //     fireEvent.click(showDMajorBtnsBtn);
  //     fireEvent.mouseOver(screen.getByText(/Play a D major Chord/i));
  //     expect(screen.getAllByText(/Play /i).length).toBeGreaterThan(0);
  //   });

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

describe("getBlackKeyLeft", () => {
  it("should calculate the correct left position for black keys with 4 octaves", () => {
    const octaves = 4;
    const startOctave = 4;
    const { white } = generateNotes(octaves, startOctave);
    expect(getBlackKeyLeft("C#4", white)).toBe("3.4482758620689653%");
    expect(getBlackKeyLeft("D#4", white)).toBe("6.896551724137931%");
    expect(getBlackKeyLeft("E#4", white)).toBe("0%");
    expect(getBlackKeyLeft("F#4", white)).toBe("13.793103448275861%");
    expect(getBlackKeyLeft("G#4", white)).toBe("17.241379310344826%");
    expect(getBlackKeyLeft("A#4", white)).toBe("20.689655172413794%");
    expect(getBlackKeyLeft("B#4", white)).toBe("0%");
  });

  it("should calculate the correct left position for black keys with 4 octaves", () => {
    const octaves = 4;
    const startOctave = 3;
    const { white } = generateNotes(octaves, startOctave);
    expect(getBlackKeyLeft("C#4", white)).toBe("27.586206896551722%");
    expect(getBlackKeyLeft("D#4", white)).toBe("31.034482758620687%");
    expect(getBlackKeyLeft("E#4", white)).toBe("0%");
    expect(getBlackKeyLeft("F#4", white)).toBe("37.93103448275862%");
    expect(getBlackKeyLeft("G#4", white)).toBe("41.37931034482759%");
    expect(getBlackKeyLeft("A#4", white)).toBe("44.82758620689655%");
    expect(getBlackKeyLeft("B#4", white)).toBe("0%");
  });

  it("should calculate the correct left position for black keys with 4 octaves", () => {
    const octaves = 4;
    const startOctave = 2;
    const { white } = generateNotes(octaves, startOctave);
    expect(getBlackKeyLeft("C#4", white)).toBe("51.72413793103448%");
    expect(getBlackKeyLeft("D#4", white)).toBe("55.172413793103445%");
    expect(getBlackKeyLeft("E#4", white)).toBe("0%");
    expect(getBlackKeyLeft("F#4", white)).toBe("62.068965517241374%");
    expect(getBlackKeyLeft("G#4", white)).toBe("65.51724137931033%");
    expect(getBlackKeyLeft("A#4", white)).toBe("68.9655172413793%");
    expect(getBlackKeyLeft("B#4", white)).toBe("0%");
  });

  it("should calculate the correct left position for black keys with 4 octaves", () => {
    const octaves = 4;
    const startOctave = 1;
    const { white } = generateNotes(octaves, startOctave);
    expect(getBlackKeyLeft("C#4", white)).toBe("75.86206896551724%");
    expect(getBlackKeyLeft("D#4", white)).toBe("79.3103448275862%");
    expect(getBlackKeyLeft("E#4", white)).toBe("0%");
    expect(getBlackKeyLeft("F#4", white)).toBe("86.20689655172413%");
    expect(getBlackKeyLeft("G#4", white)).toBe("89.6551724137931%");
    expect(getBlackKeyLeft("A#4", white)).toBe("93.10344827586206%");
    expect(getBlackKeyLeft("B#4", white)).toBe("0%");
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




