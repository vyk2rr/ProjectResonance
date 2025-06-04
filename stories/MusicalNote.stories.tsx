import React from 'react'
import MusicalNote from '../app/MusicalNote/MusicalNote'

export default {
  title: 'Components/MusicalNote',
  component: MusicalNote,
}

const Template = (args) => <MusicalNote {...args} />;

export const withNote = Template.bind({});
withNote.args = {
  note: "C4",
  size: "small",
};

export const withNoteMedium = Template.bind({});
withNoteMedium.args = {
  note: "C4",
  size: "medium",
};

export const withNoteLarge = Template.bind({});
withNoteLarge.args = {
  note: "C4",
  size: "large",
};

export const withNoteActive = Template.bind({});
withNoteActive.args = {
  note: "C4",
  size: "large",
  active: true,
};


