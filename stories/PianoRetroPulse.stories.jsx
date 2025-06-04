import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoRetroPulse} from "../app/pianos/PianoRetroPulse";

export default {
  title: "Components/PianoRetroPulse",
  component: PianoRetroPulse,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoRetroPulse {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
