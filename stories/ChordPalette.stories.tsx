import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ChordPalette from "./../app/ChordPalette/ChordPalette";
import type { tChord, tChordWithName } from "../app/PianoBase/PianoBase.types";

// Mock data for the story
const mockChord: tChord = ["C4", "E4", "G4"];
// const mockChordWithName: tChordWithName = {
//   id: "Cmaj",
//   name: "Cmaj",
//   displayNotes: "C E G",
//   chord: ["C4", "E4", "G4"]
// };

const meta: Meta<typeof ChordPalette> = {
  title: "ChordPalette",
  component: ChordPalette,
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof ChordPalette>;

export const Default: Story = {
  render: () => {
    const [currentChord, setCurrentChord] = useState<tChord>(mockChord);
    const [currentColor, setCurrentColor] = useState<string>("#ffe");

    return (
      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: 4,
        }}
      />
    );
  },
};

export const withoutNotes: Story = {
  render: () => {
    const [currentChord, setCurrentChord] = useState<tChord>(mockChord);
    const [currentColor, setCurrentColor] = useState<string>("#ffe");

    return (
      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: 4,
        }}
        showNotes={false}
      />
    );
  },
};

export const withoutChordName: Story = {
  render: () => {
    const [currentChord, setCurrentChord] = useState<tChord>(mockChord);
    const [currentColor, setCurrentColor] = useState<string>("#ffe");

    return (
      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: 4,
        }}
        showName={false}
      />
    );
  },
};

export const onlyColor: Story = {
  render: () => {
    const [currentChord, setCurrentChord] = useState<tChord>(mockChord);
    const [currentColor, setCurrentColor] = useState<string>("#ffe");

    return (
      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: 4,
        }}
        showName={false}
        showNotes={false}
      />
    );
  },
};

export const withDebuggerActivated: Story = {
  render: () => {
    const [currentChord, setCurrentChord] = useState<tChord>(mockChord);
    const [currentColor, setCurrentColor] = useState<string>("#ffe");

    return (
      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: 4,
        }}
        showName={false}
        showNotes={false}
        debug={true}
      />
    );
  },
};