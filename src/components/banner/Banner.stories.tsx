import BannerItem from "./Banner";
import { Meta } from "@storybook/react";

export const Banner = (
  { animation, theme, heading, headingLevel, text, link, linkTitle, linkText, style, buttonSize }
  : { 
    heading: string;
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    text: string; 
    link: string;
    linkText: string;
    linkTitle: string;
    animation: boolean;
    imageAlt: string;
    style?: 'default' | 'compressed';
    buttonSize?: 'small' | 'medium' | 'large';
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
      <BannerItem
        heading={heading}
        headingLevel={headingLevel ?? 'h2'}
        text={text}
        style={style ?? 'default'}
        link={link}
        linkTitle={linkTitle}
        linkText={linkText}
        animation={animation}  // Set to true to enable animation
        theme={theme}  // Default theme
        buttonSize={buttonSize}
      />
    );

Banner.args = {
  heading: 'This is a heading',
  headingLevel: 'h2',
  text: 'This is a primary banner description.',
  style: 'default',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  imageAlt: 'Placeholder Image',
  buttonSize: 'small',
  animation: false,  // Set to true to enable animation
  theme: 'primary', // Default value for banner theme
};
// Default export for Storybook
const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  parameters: {
    controls: { exclude: ['imageName'] },
  },
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
    },
    heading: { control: 'text' },
    headingLevel: {
      options: ['h1','h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
    },
    text: { control: 'text' },
    style: {
      options: ['default', 'compressed'],
      control: { type: 'select' },
    },
    link: { control: 'text' },
    linkText: { control: 'text' },
    linkTitle: { control: 'text' },
    buttonSize: { 
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    animation: { control: 'boolean' },
  },
}
 
export default meta;
