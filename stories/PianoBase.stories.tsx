import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import PianoBase from "../app/PianoBase/PianoBase";

const meta = {
  component: PianoBase,
  argTypes: {
    octaves: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    octave: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    }
  },
} satisfies Meta<typeof PianoBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const defaultOption: Story = {};

export const withEmptyChordMap: Story = {
  args: {
    chordMap: {},
  }
};

export const withDmajHighlightedOnThePiano: Story = {
  args: {
    octaves: 1,
    highlightOnThePiano: ["D4", "F#4", "A4"],
  }
};

export const inOctaveC1: Story = {
  args: {
    octaves: 1,
    octave: 1,
    chordMap: {}
  }
};

export const inOctaveC2: Story = {
  args: {
    octaves: 1,
    octave: 1,
    chordMap: {}
  }
}

export const inOctaveC3: Story = {
  args: {
    octave: 3,
    chordMap: {}
  }
}

export const inOctaveC4: Story = {
  args: {
    octave: 4,
    chordMap: {}
  }
}

export const inOctaveC5: Story = {
  args: {
    octave: 5,
    chordMap: {}
  }
}

export const with1Chord: Story = {
  args: {
    chordMap: {
      Cmaj: ["C4", "E4", "G4"],
    },
  }
}

export const with3Chords: Story = {
  args: {
    chordMap: {
      Cmaj: ["C4", "E4", "G4"],
      Dmin: ["D4", "F4", "A4"],
      G7: ["G3", "B3", "D4", "F4"],
    },
  }
}

export const with1Octave: Story = {
  args: {
    octaves: 1,
  }
}

export const with2Octaves: Story = {
  args: {
    octaves: 2,
  }
}

export const with3Octaves: Story = {
  args: {
    octaves: 3,
  }
}

export const with4Octaves: Story = {
  args: {
    octaves: 4,
  }
}

export const with5Octaves: Story = {
  args: {
    octaves: 5,
  }
}


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