import React from 'react'
import { Theme } from '@radix-ui/themes';
import UkuleleFretboard from "../app/ukulele-fretboard/ukulele-fretboard";

export default {
  title: "Components/UkuleleFretboard",
  component: UkuleleFretboard
};

const Template = (args) => <UkuleleFretboard {...args} />;

export const withoutMarkers = Template.bind({});
withoutMarkers.args = {
  markers: []
};

export const with1MarkerCmajChord = Template.bind({});
with1MarkerCmajChord.args = {
  markers: [[4, 0], [3, 0], [2, 0], [1, 3]] 
};

export const with3MarkersEminChord = Template.bind({});
with3MarkersEminChord.args = {
  markers: [[4, 0], [3, 4], [2, 3], [1, 2]] 
};

export const with4MarkersBmajChord = Template.bind({});
with4MarkersBmajChord.args = {
  markers: [[4, 4], [3, 3], [2, 2], [1, 2]] 
};