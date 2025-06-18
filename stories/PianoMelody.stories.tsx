import React from 'react'
import PianoMelody from "../app/pianos/PianoMelody/PianoMelody";

export default {
  title: "Experiments/PianoMelody",
  component: PianoMelody
};

const Template = () => <PianoMelody />;

export const withoutArgs = Template.bind({});

