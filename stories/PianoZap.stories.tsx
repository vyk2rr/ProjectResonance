import React from 'react'
import PianoZap from "../app/pianos/PianoZap/PianoZap";

export default {
  title: "Experiments/PianoZap",
  component: PianoZap
};

const Template = (args) => <PianoZap {...args} />;

export const withoutArgs = Template.bind({});

