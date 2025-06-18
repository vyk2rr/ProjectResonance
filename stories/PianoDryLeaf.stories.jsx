import React from 'react'
import { PianoDryLeaf } from "../app/pianos/PianoDryLeaf";

export default {
  title: "Synths/PianoDryLeaf",
  component: PianoDryLeaf
};

const Template = (args) => <PianoDryLeaf {...args} />;

export const withoutChords = Template.bind({});