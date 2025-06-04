import React from 'react'
import { Theme } from '@radix-ui/themes';
import { PianoEchoSpatial } from "../app/pianos/PianoEchoSpatial";

export default {
  title: "Components/PianoEchoSpatial",
  component: PianoEchoSpatial,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoEchoSpatial {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
  octaves: 2
};
