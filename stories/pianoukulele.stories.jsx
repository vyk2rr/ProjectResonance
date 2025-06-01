import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoUkulele} from "../app/pianos/piano_ukulele";

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

export const SinAcordes = Template.bind({});
SinAcordes.args = {
  chordMap: {}, // sin acordes
};
