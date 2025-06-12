import React from 'react'
import PianoSequenceCreator from "../app/pianos/PianoSequenceCreator/PianoSequenceCreator";

export default {
  title: "Experiments/PianoSequenceCreator",
  component: PianoSequenceCreator
};

const Template = () => <PianoSequenceCreator />;

export const withoutArgs = Template.bind({});

