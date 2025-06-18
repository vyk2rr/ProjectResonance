import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import PianoBase from "../app/PianoBase/PianoBase";

const meta = {
  component: PianoBase,
  tags: ["autodocs"],
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

export const withDmajHighlightedOnThePiano: Story = {
  args: {
    octaves: 1,
    highlightOnThePiano: ["D4", "F#4", "A4"],
  }
};

export const startingOctave1: Story = {
  args: { octaves: 2, octave: 1 }
};

export const startingOctave2: Story = {
  args: { octaves: 2, octave: 2 }
};

export const startingOctave3: Story = {
  args: { octaves: 2, octave: 3 }
};

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