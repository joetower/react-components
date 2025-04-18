import CardCollection from './Cards.tsx';
import { Meta, StoryFn } from '@storybook/react';

interface CardsProps {
  heading: string;
  text: string;
  cardsLinkTitle: string;
  cardsLinkUrl: string;
  cardsLinkText: string;
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for card theme
  width?: 'content' | 'full';
  showButtons?: boolean; // Optional prop to show buttons
}

const Template: StoryFn<CardsProps> = (args: CardsProps) => <CardCollection {...args} />;

export const Cards = Template.bind({});
Cards.args = {
  heading: 'Cards: Default Heading',
  text: 'Cards: Default Text Description',
  cardsLinkTitle: 'Cards: Default Link Title',
  cardsLinkText: 'Cards: Default Link Text',
  cardsLinkUrl: 'https://example.com',
  animation: false,
  theme: 'primary', // Default value for card theme
  gridCount: '4', // Default value for grid count
  width: 'content', // Default value for width
  showButtons: false, // Default value for show button
};

// Default export for Storybook
const meta: Meta<CardsProps> = {
  title: 'Components/Cards',
  component: CardCollection,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
    heading: { control: 'text' },
    text: { control: 'text' },
    animation: { control: 'boolean' },
    showButtons: { control: 'boolean' },
  },
}
 
export default meta;
