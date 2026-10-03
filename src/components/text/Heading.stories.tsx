import HeadingItem from './Heading';
import { Meta } from '@storybook/react-vite';

interface HeadingProps {
  content: string;
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  baseClass?: string;
  width?: 'content' | 'full';
  link?: string;
  linkTitle?: string;
  linkClass?: string;
}

export const Heading = ({ content, level = 'h2', baseClass = 'heading__item', width = 'content', link, linkTitle, linkClass ='heading__link' }: HeadingProps) => (
  <HeadingItem content={content} level={level} baseClass={baseClass} width={width} link={link} linkTitle={linkTitle} linkClass={linkClass}/>
);

Heading.args = {
  content: 'This is a heading',
  level: 'h2',
  width: 'content',
  baseClass: 'heading__item',
};

const meta: Meta<typeof Heading> = {
  title: 'Components/Text/Heading',
  component: Heading,
  argTypes: {
    content: { control: 'text' },
    baseClass: { control: 'text' },
    level: {
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
    width: {
      options: ['content', 'full'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
