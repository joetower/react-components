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
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  width?: 'components' | 'inner' | 'wide' | 'full';
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
  width: 'components',
  showButtons: false,
  cardsHeadingLevel: 'h2',
  cardHeadingLevel: 'h3',
};

// Default export for Storybook
const meta: Meta<CardsProps> = {
  title: 'Components/Cards',
  component: CardCollection,
  argTypes: {
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    animation: { 
      name: 'Enable animation',
      control: 'boolean', 
      table: { category: 'Options' }
    },
    showButtons: { 
      name: 'Show cta button',
      control: 'boolean',
      table: { category: 'Options' }
    },
    heading: { 
      name: 'Cards group title (above the card grid)',
      control: 'text',
      table: { category: 'Data' }
    },
    cardsHeadingLevel: {
      name: 'Cards group heading level (above the card grid)',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' }
    },
    cardHeadingLevel: {
      name: 'Card heading level',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' }
    },
    text: { 
      name: 'Card description',
      control: 'text',
      table: { category: 'Data' }
    },
    cardsLinkUrl: {
      name: 'Card link url',
      control: 'text',
      table: { category: 'Data' }   
    },
    cardsLinkText: {
      name: 'Card link text',
      control: 'text',
      table: { category: 'Data' }   
    },
    cardsLinkTitle: {
      name: 'Card link title attribute text (when hovering)',
      control: 'text',
      table: { category: 'Data' }   
    },
  },
}
 
export default meta;
