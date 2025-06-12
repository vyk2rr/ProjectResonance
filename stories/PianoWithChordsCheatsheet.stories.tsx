import React from 'react'
import PianoWithChordsCheatsheet from "../app/pianos/PianoWithChordsCheatsheet/PianoWithChordsCheatsheet";
import type { PianoWithChordsHelperProps } from "../app/pianos/PianoWithChordsCheatsheet/PianoWithChordsCheatsheet";

export default {
  title: "Experiments/PianoWithChordsCheatsheet",
  component: PianoWithChordsCheatsheet
};

const Template = (args: PianoWithChordsHelperProps) => <PianoWithChordsCheatsheet {...args} />;

export const withoutArgs = Template.bind({});
