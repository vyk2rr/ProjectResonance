import React from 'react'
import { PianoUkulele } from "../app/pianos/PianoUkulele";

export default {
  title: "Ukulele/PianoUkulele",
  component: PianoUkulele
};

const Template = (args) => <PianoUkulele {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
