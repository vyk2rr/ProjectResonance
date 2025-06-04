import React from 'react'
import { Theme } from '@radix-ui/themes';
import { PianoEtherealStrings } from "../app/pianos/PianoEtherealStrings";

export default {
  title: "Components/PianoEtherealStrings",
  component: PianoEtherealStrings,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoEtherealStrings {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
