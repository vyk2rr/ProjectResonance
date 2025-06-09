import React from 'react'
import { PianoEchoSpatial } from "../app/pianos/PianoEchoSpatial";

export default {
  title: "Components/PianoEchoSpatial",
  component: PianoEchoSpatial
};

const Template = (args) => <PianoEchoSpatial {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
  octaves: 2
};
