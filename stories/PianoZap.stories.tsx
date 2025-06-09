import React from 'react'
import { Theme } from '@radix-ui/themes';
import PianoZap from "../app/pianos/PianoZap/PianoZap";

export default {
  title: "Components/PianoZap",
  component: PianoZap,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoZap {...args} />;

export const withoutArgs = Template.bind({});

