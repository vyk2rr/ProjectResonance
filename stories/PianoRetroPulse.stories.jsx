import React from 'react'
import { PianoRetroPulse } from "../app/pianos/PianoRetroPulse";

export default {
  title: "Synths/PianoRetroPulse",
  component: PianoRetroPulse
};

const Template = (args) => <PianoRetroPulse {...args} />;

export const withoutChords = Template.bind({});