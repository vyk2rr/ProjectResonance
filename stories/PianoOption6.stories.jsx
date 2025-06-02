import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption6} from "../app/pianos/piano6";

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

export const SinAcordes = Template.bind({});
SinAcordes.args = {
  chordMap: {}, // sin acordes
};
