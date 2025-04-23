import BlockquoteItem from './Blockquote';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface BlockquoteProps {
  content: string; // Required prop for image source
  style: 'quote' | 'bar' ;
  width?: 'content' | 'full';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for card theme
  baseClass?: string | 'blockquote';
  author?: string; // Optional prop for author name
  align?: 'left' | 'center' | 'right';
}

export const Blockquote = ({content, style = 'quote', width = 'content', align = 'left', theme = 'primary', author = 'Author', baseClass = 'quote' }: BlockquoteProps) => (
  <BlockquoteItem style={style} baseClass={baseClass} width={width} align={align} theme={theme} author={author} content={content} />
);


Blockquote.args = {
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'quote',
  width: 'content',
  align: 'left',
  theme: 'primary',
  baseClass: 'quote',
  author: 'Person Namerton'
};

// Default export for Storybook
const meta: Meta<typeof Blockquote> = {
  title: 'Components/Text/Blockquote',
  component: Blockquote,
  argTypes: {
    content: { control: 'text' },
    style: {
      options: ['quote', 'bar'],
      control: { type: 'radio' },
    },
    width: {
      options: ['content', 'full'],
      control: { type: 'radio' },
    },
    align: {
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
    },
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
    author: { control: 'text' },
    baseClass: { control: 'text' },
  }
}
 
export default meta;
