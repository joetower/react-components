import TextItem from './Text';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface TextProps {
  content: string; // Required prop for image source
  style: 'default' | 'emphasized' ;
}

export const Text = ({ content, style }: TextProps) => (
  <TextItem content={content} style={style} baseClass='text'/>
);


Text.args = {
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'default',
};

// Default export for Storybook
const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    content: { control: 'text' },
    style: {
      options: ['default', 'emphasized'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
