import React from 'react'
import { Theme } from '@radix-ui/themes';
import { PianoHu } from "../app/pianos/PianoHu";

export default {
  title: "Components/PianoHu",
  component: PianoHu,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoHu {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
