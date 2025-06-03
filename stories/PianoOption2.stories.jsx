import React from 'react'
import { Theme } from '@radix-ui/themes';
import { PianoOption2 } from "../app/pianos/PianoOption2";

export default {
  title: "Components/PianoOption2",
  component: PianoOption2,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption2 {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
  octaves: 2
};
