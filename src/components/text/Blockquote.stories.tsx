import BlockquoteItem from './Blockquote';
import { Meta } from '@storybook/react-vite';

interface BlockquoteProps {
  content: string;
  style: 'quote' | 'bar' ;
  width?: 'components' | 'inner' | 'wide' | 'full';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  baseClass?: string | 'blockquote';
  author?: string;
  align?: 'left' | 'center' | 'right';
}

export const Blockquote = ({content, style = 'quote', width = 'components', align = 'left', theme = 'primary', author = 'Author', baseClass = 'quote' }: BlockquoteProps) => (
  <BlockquoteItem style={style} baseClass={baseClass} width={width} align={align} theme={theme} author={author} content={content} />
);


Blockquote.args = {
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'quote',
  width: 'components',
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
    content: { 
      name: 'Quote text',
      control: 'text',
      table: { category: 'Data' }
    },
    style: {
      name: 'Quote style',
      options: ['quote', 'bar'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
    width: {
      name: 'Quote width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
    align: {
      name: 'Quote alignment',
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
    theme: {
      name: 'Quote theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
    author: { 
      name: 'Quote author',
      control: 'text',
      table: { category: 'Data' }
    },
    baseClass: { 
      name: 'Quote base class',
      control: 'text',
      table: { category: 'Data' }
    },
  }
}
 
export default meta;
