import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoBase} from "../app/pianobase/PianoBase";

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

export const withoutChordMap = Template.bind({});
withoutChordMap.args = {
  chordMap: {}, // sin acordes
};

export const withOneChord = Template.bind({});
withOneChord.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
  },
};

export const withMulipleChords = Template.bind({});
withMulipleChords.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
    Dmin: ["D4", "F4", "A4"],
    G7: ["G3", "B3", "D4", "F4"],
  },
};
