import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoOption3} from "../app/pianos/PianoOption3";

export default {
  title: "Components/PianoOption3",
  component: PianoOption3,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoOption3 {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
