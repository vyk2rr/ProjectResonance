import React from 'react'
import { Theme } from '@radix-ui/themes';
import PianoWithChordsCheatsheet from "../app/pianos/PianoWithChordsCheatsheet/PianoWithChordsCheatsheet";

export default {
  title: "Components/PianoWithChordsCheatsheet",
  component: PianoWithChordsCheatsheet,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoWithChordsCheatsheet {...args} />;

export const withoutArgs = Template.bind({});
withoutArgs.args = {
};

