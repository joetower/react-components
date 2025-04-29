import CardItem from "./Card";
import { Meta } from "@storybook/react";

export const Card = (
  { animation, imageSrc, imageAlt, theme, heading, text, link, imageName, linkTitle, linkText, showButton }
  : { 
    heading: string; 
    text: string; 
    link: string;
    linkText: string;
    linkTitle: string;
    animation: boolean;
    imageName: string;
    imageSrc: string; 
    imageAlt: string;
    showButton: boolean;
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
      <CardItem
        heading={heading}
        text={text}
        link={link}
        linkTitle={linkTitle}
        linkText={linkText}
        imageName={imageName}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        animation={animation}  // Set to true to enable animation
        theme={theme}  // Default theme
        showButton={showButton} // Set show button to false
      />
    );

Card.args = {
  heading: 'This is a heading',
  text: 'This is a primary card description.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  imageSrc: 'https://placehold.co/600x400',
  imageAlt: 'Placeholder Image',
  animation: false,  // Set to true to enable animation
  showButton: false, // Set show button to false
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
    linkText: { control: 'text' },
    linkTitle: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    animation: { control: 'boolean' },
    showButton: { control: 'boolean' },
  },
}
 
export default meta;
