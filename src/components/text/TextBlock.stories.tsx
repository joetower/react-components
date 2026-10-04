import TextBlockItem from './TextBlock';
import { Meta } from '@storybook/react-vite';

// Default export for Storybook
interface TextBlockProps {
  children?: React.ReactNode;
  style: 'default' | 'emphasized' ;
  width?: 'components' | 'inner' | 'wide' | 'full';
}

export const TextBlock = ({ children, style = 'default', width = 'components' }: TextBlockProps) => (
  <TextBlockItem style={style} baseClass='text' width={width}>
    <p>{children}</p>
  </TextBlockItem>
);


TextBlock.args = {
  children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: 'default',
  width: 'components',
};

// Default export for Storybook
const meta: Meta<typeof TextBlock> = {
  title: 'Components/Text/TextBlock',
  component: TextBlock,
  argTypes: {
    children: { 
      name: 'Content',
      control: 'text',
      table: { category: 'Data' }
    },
    style: {
      name: 'Style',
      options: ['default', 'emphasized'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
  },
}
 
export default meta;
