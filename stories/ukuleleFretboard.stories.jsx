import React from 'react'
import UkuleleFretboard from "../app/UkuleleFretboard/UkuleleFretboard";

export default {
  title: "Components/UkuleleFretboard",
  component: UkuleleFretboard,
  decorators: [
    (Story) => (
      <div style={{ width: "150px" }}>
        <Story></Story>
      </div>
    ),
  ]
};

const Template = (args) => <UkuleleFretboard {...args} />;

export const withoutMarkers = Template.bind({});
withoutMarkers.args = {
  markers: []
};

export const with1MarkerCmajChord = Template.bind({});
with1MarkerCmajChord.args = {
  markers: ["G4", "C4", "E4", "C5"]
};

export const with3MarkersEminChord = Template.bind({});
with3MarkersEminChord.args = {
  markers: ["G4", "E4", "G4", "B4"]
};

export const with4MarkersBmajChord = Template.bind({});
with4MarkersBmajChord.args = {
  markers: ["B4", "D4", "F#4", "B4"]
};

export const withActiveTrue = Template.bind({});
withActiveTrue.args = {
  markers: ["B4", "D4", "F#4", "B4"],
  active: true
};