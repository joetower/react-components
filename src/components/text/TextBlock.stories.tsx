import TextBlockItem from './TextBlock';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface TextBlockProps {
  style: 'default' | 'emphasized' ;
  width?: 'content' | 'full';
  children?: React.ReactNode;
}

export const TextBlock = ({ children, style = 'default', width = 'content' }: TextBlockProps) => (
  <TextBlockItem style={style} baseClass='text' width={width}>
    {children}
  </TextBlockItem>
);


TextBlock.args = {
  children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'default',
  width: 'content',
};

// Default export for Storybook
const meta: Meta<typeof TextBlock> = {
  title: 'Components/Text/TextBlock',
  component: TextBlock,
  argTypes: {
    children: { control: 'text' },
    style: {
      options: ['default', 'emphasized'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
