import BannerItem from "./Banner";
import { Meta } from "@storybook/react";

export const Banner = (
  { animation, imageSrc, imageAlt, theme, heading, text, link, imageName, linkTitle, linkText, buttonSize }
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
    buttonSize: string;
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
      <BannerItem
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
        buttonSize={buttonSize}
      />
    );

Banner.args = {
  heading: 'This is a heading',
  text: 'This is a primary banner description.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  imageSrc: 'https://placehold.co/600x400',
  imageAlt: 'Placeholder Image',
  buttonSize: 'small',
  animation: false,  // Set to true to enable animation
  imageName: '6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085',
  theme: 'primary', // Default value for banner theme
};
// Default export for Storybook
const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
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
    buttonSize: { 
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    animation: { control: 'boolean' },
  },
}
 
export default meta;
