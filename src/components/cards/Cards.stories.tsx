import CardCollection from './Cards.tsx';
import { Meta, StoryFn } from '@storybook/react-vite';

interface CardsProps {
  heading: string;
  text: string;
  cardsHeadingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // heading above card grid
  cardsLinkTitle: string;
  cardsLinkUrl: string;
  cardsLinkText: string;
  cardHeadingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // individual card
  animation?: boolean;
  gridCount?: '2' | '3' | '4';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  width?: 'content' | 'full';
  showButtons?: boolean;
}

const Template: StoryFn<CardsProps> = (args: CardsProps) => <CardCollection {...args} />;

export const Cards = Template.bind({});
// add default values in Storybook
Cards.args = {
  heading: 'Cards: Default Heading',
  text: 'Cards: Default Text Description',
  cardsLinkTitle: 'Cards: Default Link Title',
  cardsLinkText: 'Cards: Default Link Text',
  cardsLinkUrl: 'https://example.com',
  animation: false,
  theme: 'primary',
  width: 'content',
  showButtons: false,
  cardsHeadingLevel: 'h2',
  cardHeadingLevel: 'h3',
  gridCount: '4',
};

// Default export for Storybook
const meta: Meta<CardsProps> = {
  title: 'Components/Cards',
  component: CardCollection,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
    },
    width: {
      options: ['content', 'full'],
      control: { type: 'radio' },
    },
    heading: { control: 'text' },
    cardsHeadingLevel: {
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
    cardHeadingLevel: {
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
    gridCount: {
      options: ['2', '3', '4'],
      control: { type: 'select' },
    },
    text: { control: 'text' },
    animation: { control: 'boolean' },
    showButtons: { control: 'boolean' },
  },
}
 
export default meta;
