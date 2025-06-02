import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoBase} from "../app/pianobase/PianoBase";
import '@radix-ui/themes/styles.css';

export default {
  title: "Components/PianoBase",
  component: PianoBase,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoBase {...args} />;

export const defaultOption = Template.bind({});

export const withEmptyChordMap = Template.bind({});
withEmptyChordMap.args = {
  chordMap: {}, // sin acordes
};

export const with1Chord = Template.bind({});
with1Chord.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
  },
};

export const with3Chords = Template.bind({});
with3Chords.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
    Dmin: ["D4", "F4", "A4"],
    G7: ["G3", "B3", "D4", "F4"],
  },
};
