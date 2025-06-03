import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption6} from "../app/pianos/PianoOption6";

export default {
  title: "Components/PianoOption6",
  component: PianoOption6,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption6 {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
