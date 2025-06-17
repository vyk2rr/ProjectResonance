import React from 'react'
import { PianoEtherealStrings } from "../app/pianos/PianoEtherealStrings";

export default {
  title: "Synths/PianoEtherealStrings",
  component: PianoEtherealStrings,
};

const Template = (args) => <PianoEtherealStrings {...args} />;

export const withoutChords = Template.bind({});