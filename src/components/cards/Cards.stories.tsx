import CardCollection from './Cards.tsx';
import { Meta, StoryFn } from '@storybook/react';

interface CardsProps {
  heading: string;
  text: string;
  cards_link_title: string;
  cards_link_url: string;
  cards_link_text: string;
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional prop for card variant
}

const Template: StoryFn<CardsProps> = (args: CardsProps) => <CardCollection {...args} />;

export const Cards = Template.bind({});
Cards.args = {
  heading: 'Cards: Default Heading',
  text: 'Cards: Default Text Description',
  cards_link_title: 'Cards: Default Link Title',
  cards_link_text: 'Cards: Default Link Text',
  cards_link_url: 'https://example.com',
  animation: false,
  variant: 'primary', // Default value for card variant
  gridCount: '4', // Default value for grid count
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
    animation: { control: 'boolean' },
  },
}
 
export default meta;
