import HeadingItem from './Heading';
import { Meta } from '@storybook/react-vite';

interface HeadingProps {
  content: string;
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  baseClass?: string;
  width?: 'components' | 'inner' | 'wide' | 'full';
  link?: string;
  linkTitle?: string;
  linkClass?: string;
}

export const Heading = ({ content, level = 'h2', baseClass = 'heading__item', width = 'components', link, linkTitle, linkClass ='heading__link' }: HeadingProps) => (
  <HeadingItem content={content} level={level} baseClass={baseClass} width={width} link={link} linkTitle={linkTitle} linkClass={linkClass}/>
);

Heading.args = {
  content: 'This is a heading',
  level: 'h2',
  width: 'components',
  baseClass: 'heading__item',
};

const meta: Meta<typeof Heading> = {
  title: 'Components/Text/Heading',
  component: Heading,
  argTypes: {
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    content: { 
      name: 'Heading',
      control: 'text' ,
      table: { category: 'Data' }
    },
    baseClass: { 
      name: 'Base class',
      control: 'text',
      table: { category: 'Data' }
    },
    link: { 
      name: 'Heading link',
      control: 'text' ,
      table: { category: 'Data' }
    },
    linkTitle: { 
      name: 'Heading link title attribute (when hovering)',
      control: 'text' ,
      table: { category: 'Data' }
    },
    linkClass: {
      name: 'Heading link class',
      control: 'text' ,
      table: { category: 'Data' }
    },
    level: {
      name: 'Heading level',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' }
    },
  },
}
 
export default meta;
