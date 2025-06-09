import React from 'react'
import PianoSequenceCreator from "../app/pianos/PianoSequenceCreator/PianoSequenceCreator";

export default {
  title: "Components/PianoSequenceCreator",
  component: PianoSequenceCreator
};

const Template = (args) => <PianoSequenceCreator {...args} />;

export const withoutArgs = Template.bind({});
withoutArgs.args = {
};

