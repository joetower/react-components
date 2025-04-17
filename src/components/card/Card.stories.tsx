import CardItem from "./Card";
import { Meta } from "@storybook/react";

export const Card = (
  { animation, imageSrc, imageAlt, theme, heading, text, link, link_title, link_text }
  : { 
    heading: string; 
    text: string; 
    link: string;
    link_text: string;
    link_title: string; 
    animation: boolean; 
    imageSrc: string; 
    imageAlt: string; 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <CardItem
    heading={heading}
    text={text}
    link={link}
    link_title={link_title}
    link_text={link_text}
    imageSrc={imageSrc}
    imageAlt={imageAlt}
    animation={animation}  // Set to true to enable animation
    theme={theme}  // Default theme
  />
);

Card.args = {
  heading: 'This is a heading',
  text: 'This is a primary card description.',
  link: '#',
  link_text: 'This is a link text',
  link_title: 'This is a link title',
  imageSrc: 'https://placehold.co/600x400',
  imageAlt: 'Placeholder Image',
  animation: false,  // Set to true to enable animation
  theme: 'primary',  // Default theme
};
// Default export for Storybook
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
    heading: { control: 'text' },
    text: { control: 'text' },
    link: { control: 'text' },
    link_text: { control: 'text' },
    link_title: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    animation: { control: 'boolean' },  // Set to true to enable animation
  },
}
 
export default meta;
