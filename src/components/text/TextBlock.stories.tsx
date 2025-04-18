import TextBlockItem from './TextBlock';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface TextBlockProps {
  content: string; // Required prop for image source
  style: 'default' | 'emphasized' ;
  width?: 'content' | 'full';
}

export const TextBlock = ({ content, style = 'default', width = 'content' }: TextBlockProps) => (
  <TextBlockItem style={style} baseClass='text' width={width}>
    {content}
  </TextBlockItem>
);


TextBlock.args = {
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'default',
};

// Default export for Storybook
const meta: Meta<typeof TextBlock> = {
  title: 'Components/Text/TextBlock',
  component: TextBlock,
  argTypes: {
    content: { control: 'text' },
    style: {
      options: ['default', 'emphasized'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
