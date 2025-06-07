import React from 'react'
import { Theme } from '@radix-ui/themes';
import SequencePlayground from "../app/pianos/SequencePlayground/SequencePlayground";

export default {
  title: "Components/SequencePlayground",
  component: SequencePlayground,
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ]
};

const Template = (args) => <SequencePlayground {...args} />;

export const withoutArgs = Template.bind({});

