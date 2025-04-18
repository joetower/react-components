import HeadingItem from './Heading';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface HeadingProps {
  content: string; // Required prop for image source
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Added prop for heading level
  baseClass?: string;
  width?: 'content' | 'full';
  link?: string; // Added link prop
  linkTitle?: string; // Added link_title prop
  linkClass?: string; // Added link_class prop
}

export const Heading = ({ content, level = 'h2', baseClass = 'heading__item', width = 'content', link, linkTitle, linkClass ='heading__link' }: HeadingProps) => (
  <HeadingItem content={content} level={level} baseClass={baseClass} width={width} link={link} linkTitle={linkTitle} linkClass={linkClass}/>
);

Heading.args = {
  content: 'This is a heading',
  level: 'h2',
};

// Default export for Storybook
const meta: Meta<typeof Heading> = {
  title: 'Components/Text/Heading',
  component: Heading,
  argTypes: {
    content: { control: 'text' },
    baseClass: { control: 'text' },
    level: {
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
