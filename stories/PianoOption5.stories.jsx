import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption5} from "../app/pianos/piano5";

export default {
  title: "Components/PianoOption5",
  component: PianoOption5,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption5 {...args} />;

export const SinAcordes = Template.bind({});
SinAcordes.args = {
  chordMap: {}, // sin acordes
};
