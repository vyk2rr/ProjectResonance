import React from 'react'
import { PianoHu } from "../app/pianos/PianoHu";

export default {
  title: "Synths/PianoHu",
  component: PianoHu
};

const Template = (args) => <PianoHu {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
