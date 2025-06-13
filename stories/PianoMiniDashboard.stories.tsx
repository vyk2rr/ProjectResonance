import type { Meta, StoryObj } from '@storybook/react';
import PianoMiniDashboard from '../app/pianos/PianoMiniDashboard/PianoMiniDashboard';

const meta = {
  title: "Experiments/Piano Mini Dashboard",
  component: PianoMiniDashboard,
} satisfies Meta<typeof PianoMiniDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const defaultOption: Story = {};

export const withEmptyChordMap: Story = {};