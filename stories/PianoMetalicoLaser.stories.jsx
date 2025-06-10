import React from 'react'
import { PianoMetalicoLaser } from "../app/pianos/PianoMetalicoLaser";

export default {
  title: "Synths/PianoMetalicoLaser",
  component: PianoMetalicoLaser
};

const Template = (args) => <PianoMetalicoLaser {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
