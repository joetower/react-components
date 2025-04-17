import ParagraphItem from './Paragraph';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface ParagraphProps {
  content: string; // Required prop for image source
  style: 'default' | 'emphasized' ;
}

export const Paragraph = ({ content, style }: ParagraphProps) => (
  <ParagraphItem content={content} style={style} baseClass='text'/>
);


Paragraph.args = {
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'default',
};

// Default export for Storybook
const meta: Meta<typeof Paragraph> = {
  title: 'Components/Paragraph',
  component: Paragraph,
  argTypes: {
    content: { control: 'text' },
    style: {
      options: ['default', 'emphasized'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
