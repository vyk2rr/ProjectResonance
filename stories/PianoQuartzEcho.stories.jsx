import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoQuartzEcho} from "../app/pianos/PianoQuartzEcho";

export default {
  title: "Components/PianoQuartzEcho",
  component: PianoQuartzEcho,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoQuartzEcho {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
