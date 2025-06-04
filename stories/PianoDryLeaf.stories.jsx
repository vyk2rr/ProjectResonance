import React from 'react'
import { Theme } from '@radix-ui/themes';
import {PianoDryLeaf} from "../app/pianos/PianoDryLeaf";

export default {
  title: "Components/PianoDryLeaf",
  component: PianoDryLeaf,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <PianoDryLeaf {...args} />;

export const withoutChords = Template.bind({});
withoutChords.args = {
  chordMap: {}, // sin acordes
};
