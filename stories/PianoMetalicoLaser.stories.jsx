import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoMetalicoLaser} from "../app/pianos/PianoMetalicoLaser";

export default {
  title: "Components/PianoMetalicoLaser",
  component: PianoMetalicoLaser,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoMetalicoLaser {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
