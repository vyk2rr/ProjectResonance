import React from 'react'
import { PianoEchoSpatial } from "../app/pianos/PianoEchoSpatial";

export default {
  title: "Synths/PianoEchoSpatial",
  component: PianoEchoSpatial
};

const Template = (args) => <PianoEchoSpatial {...args} />;

export const withoutChords = Template.bind({});