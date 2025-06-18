import React from 'react'
import { PianoQuartzEcho } from "../app/pianos/PianoQuartzEcho";

export default {
  title: "Synths/PianoQuartzEcho",
  component: PianoQuartzEcho
};

const Template = (args) => <PianoQuartzEcho {...args} />;

export const withoutChords = Template.bind({});