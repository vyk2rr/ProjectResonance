import React from 'react'
import PianoBase from "../app/PianoBase/PianoBase";

export default {
  title: "Components/PianoBase",
  component: PianoBase
};

const Template = (args) => <PianoBase {...args} />;

export const defaultOption = Template.bind({});

export const withEmptyChordMap = Template.bind({});
withEmptyChordMap.args = {
  chordMap: {}, // sin acordes
};

export const withDmajHighlightedOnThePiano = Template.bind({});
withDmajHighlightedOnThePiano.args = {
  octaves: 1,
  showChordOnThePiano: ["D4", "F#4", "A4"],
};


export const inOctaveC1 = Template.bind({});
inOctaveC1.args = {
  octave: 1,
  chordMap: {}
}

export const inOctaveC2 = Template.bind({});
inOctaveC2.args = {
  octave: 1,
  chordMap: {}
}

export const inOctaveC3 = Template.bind({});
inOctaveC3.args = {
  octave: 3,
  chordMap: {}
}

export const inOctaveC4 = Template.bind({});
inOctaveC4.args = {
  octave: 4,
  chordMap: {}
}

export const inOctaveC5 = Template.bind({});
inOctaveC5.args = {
  octave: 5,
  chordMap: {}
}

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