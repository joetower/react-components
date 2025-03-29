import CardCollection from './Cards.tsx';
import { Meta, StoryFn } from '@storybook/react';

interface CardsProps {
  heading: string;
  text: string;
  link: string;
  imageSrc?: string; // Optional prop for image source
  imageAlt?: string; // Optional prop for image alt text
  animation?: boolean; // Optional prop for animation class
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional prop for card variant
}

const Template: StoryFn = (args) => <CardCollection {...args} />;

export const Cards = Template.bind({});
Cards.args = {
  heading: 'Default Heading',
  text: 'Default Text',
  link: 'https://example.com',
  animation: false,
  imageSrc: 'https://via.placeholder.com/150',
  imageAlt: 'Default Image Alt Text',
  variant: 'primary', // Default value for card variant
};

// Default export for Storybook
const meta: Meta<CardsProps> = {
  title: 'Components/Cards',
  component: CardCollection,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'radio' },
    },
    heading: { control: 'text' },
    text: { control: 'text' },
    link: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    animation: { control: 'boolean' },
  },
}
 
export default meta;
