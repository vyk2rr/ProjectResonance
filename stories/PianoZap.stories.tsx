import React from 'react'
import PianoZap from "../app/pianos/PianoZap/PianoZap";

export default {
  title: "Experiments/PianoZap",
  component: PianoZap
};

const Template = () => <PianoZap />;

export const withoutArgs = Template.bind({});