import React from 'react'
import { Theme } from '@radix-ui/themes';
import PianoBase from "../app/PianoBase/pianobase";
import '@radix-ui/themes/styles.css';
// import type { StoryObj } from '@storybook/react'

// type Story = StoryObj<typeof PianoBase>;

export default {
  title: "Components/PianoBase",
  component: PianoBase,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoBase {...args} />;

export const defaultOption = Template.bind({});

export const withEmptyChordMap = Template.bind({});
withEmptyChordMap.args = {
  chordMap: {}, // sin acordes
};

export const with1Chord = Template.bind({});
with1Chord.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
  },
};

export const with3Chords = Template.bind({});
with3Chords.args = {
  chordMap: {
    Cmaj: ["C4", "E4", "G4"],
    Dmin: ["D4", "F4", "A4"],
    G7: ["G3", "B3", "D4", "F4"],
  },
};

export const with1Octave = Template.bind({});
with1Octave.args = {
  octaves: 1,
};

export const with2Octaves = Template.bind({});
with2Octaves.args = {
  octaves: 2,
};

export const with3Octaves = Template.bind({});
with3Octaves.args = {
  octaves: 3,
};

export const with4Octaves = Template.bind({});
with4Octaves.args = {
  octaves: 4,
};

export const with5Octaves = Template.bind({});
with5Octaves.args = {
  octaves: 5,
};




// export const FilledForm: Story = {
//   play: async ({ canvas, userEvent }) => {
//     // const emailInput = canvas.getByLabelText('email', {
//     //   selector: 'input',
//     // });

//     // await userEvent.type(emailInput, 'example-email@email.com', {
//     //   delay: 100,
//     // });

//     // const passwordInput = canvas.getByLabelText('password', {
//     //   selector: 'input',
//     // });

//     // await userEvent.type(passwordInput, 'ExamplePassword', {
//     //   delay: 100,
//     // });

//     // const submitButton = canvas.getByRole('button');
//     // await userEvent.click(submitButton);
//   },
// };