import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption8} from "../app/pianos/piano8";

export default {
  title: "Components/PianoOption8",
  component: PianoOption8,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption8 {...args} />;

export const SinAcordes = Template.bind({});
SinAcordes.args = {
  chordMap: {}, // sin acordes
};
