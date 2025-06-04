import React from 'react'
import { Theme } from '@radix-ui/themes';
import { PianoUkulele } from "../app/pianos/PianoUkulele";

export default {
  title: "Components/PianoUkulele",
  component: PianoUkulele,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoUkulele {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
