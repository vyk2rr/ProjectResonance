import React from 'react'
import { PianoQuartzEcho } from "../app/pianos/PianoQuartzEcho";

export default {
  title: "Components/PianoQuartzEcho",
  component: PianoQuartzEcho
};

const Template = (args) => <PianoQuartzEcho {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
