import CardItem from "./Card";
import { Meta } from "@storybook/react-vite";

export const Card = (
  { animation, imageSrc, imageAlt, theme, heading, headingLevel, text, link, imageName, linkTitle, linkText, showButton, buttonSize }
  : { 
    heading: string;
    headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    text: string; 
    link: string;
    linkText: string;
    linkTitle: string;
    animation: boolean;
    imageName: string;
    imageSrc: string; 
    imageAlt: string;
    showButton: boolean;
    buttonSize?: 'small' | 'medium' | 'large';
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
      <CardItem
        heading={heading}
        headingLevel={headingLevel ?? 'h2'}
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
        buttonSize={buttonSize}
      />
    );

Card.args = {
  heading: 'This is a heading',
  headingLevel: 'h2',
  text: 'This is a primary card description.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  imageSrc: 'https://placehold.co/600x400',
  imageAlt: 'Placeholder Image',
  animation: false,  // Set to true to enable animation
  showButton: false, // Set show button to false
  buttonSize: 'small',
  imageName: '6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085',
  theme: 'primary', // Default value for card theme
};
// Default export for Storybook
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    heading: { 
      name: 'Heading',
      control: 'text',
      table: { category: 'Data' },
    },
    headingLevel: {
      name: 'Heading level',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' },
    },
    text: {
      name: 'Content',
      control: 'text',
      table: { category: 'Data' },
    },
    link: {
      name: 'Link url',
      control: 'text',
      table: { category: 'Data' },
    },
    linkText: { 
      name: 'Link text',
      control: 'text',
      table: { category: 'Data' },
    },
    linkTitle: { 
      name: 'Link title attribute (when hovering)',
      control: 'text',
      table: { category: 'Data' },
    },
    imageSrc: { 
      name: 'Image src',
      control: 'text',
      table: { category: 'Data' },
    },
    imageAlt: { 
      name: 'Image alt text',
      control: 'text',
      table: { category: 'Data' },
    },
    imageName: {
      table: {
        disable: true,
      },
    },
    animation: { 
      name: 'Enable animation',
      control: 'boolean',
      table: { category: 'Options' }, 
    },
    showButton: { 
      name: 'Show buttons',
      control: 'boolean' ,
      table: { category: 'Options' }, 
    },
    buttonSize: {
      name: 'Button size',
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      table: { category: 'Options' }, 
    },
  },
}
 
export default meta;
