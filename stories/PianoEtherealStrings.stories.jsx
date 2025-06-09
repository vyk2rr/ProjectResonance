import React from 'react'
import { PianoEtherealStrings } from "../app/pianos/PianoEtherealStrings";

export default {
  title: "Components/PianoEtherealStrings",
  component: PianoEtherealStrings,
};

const Template = (args) => <PianoEtherealStrings {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
