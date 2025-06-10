import React from 'react'
import SequencePlayground from "../app/pianos/SequencePlayground/SequencePlayground";

export default {
  title: "Experiments/SequencePlayground",
  component: SequencePlayground,
};

const Template = (args) => <SequencePlayground {...args} />;

export const withoutArgs = Template.bind({});

