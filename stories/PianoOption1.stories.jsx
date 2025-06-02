import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption1} from "../app/pianos/piano1";

export default {
  title: "Components/PianoOption1",
  component: PianoOption1,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption1 {...args} />;

export const SinAcordes = Template.bind({});
SinAcordes.args = {
  chordMap: {}, // sin acordes
};
