import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption1} from "../app/pianos/PianoOption1";

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

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
