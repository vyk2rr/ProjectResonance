import React from 'react'
import { Theme } from '@radix-ui/themes';
import PianoWithSequenceButton from "../app/pianos/PianoWithSequenceButton/PianoWithSequenceButton";

export default {
  title: "Components/PianoWithSequenceButton",
  component: PianoWithSequenceButton,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoWithSequenceButton {...args} />;

export const withoutArgs = Template.bind({});

