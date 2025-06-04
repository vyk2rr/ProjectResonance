import React from 'react'
import { Theme } from '@radix-ui/themes';
import PianoWithChordsHelper from "../app/pianos/PianoWithChordsHelper/PianoWithChordsHelper";

export default {
  title: "Components/PianoWithChordsHelper",
  component: PianoWithChordsHelper,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoWithChordsHelper {...args} />;

export const withoutArgs = Template.bind({});
withoutArgs.args = {
};

