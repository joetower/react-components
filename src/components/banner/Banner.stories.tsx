import BannerItem from "./Banner";
import { Meta } from "@storybook/react-vite";

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
        animation={animation}
        theme={theme}
        buttonSize={buttonSize}
      />
    );

Banner.args = {
  buttonSize: 'small',
  animation: false,
  theme: 'primary',
  style: 'default',
  heading: 'This is a heading',
  headingLevel: 'h2',
  text: 'This is a primary banner description.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  imageAlt: 'Placeholder Image',
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
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    heading: { 
      name: 'Heading',
      control: 'text' ,
      table: { category: 'Data' },
    },
    headingLevel: {
      name: 'Heading level',
      options: ['h1','h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' },
    },
    text: {
      name: 'Content',
      control: 'text',
      table: { category: 'Data' },
    },
    style: {
      name: 'Style',
      options: ['default', 'compressed'],
      control: { type: 'select' },
      table: { category: 'Options' },
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
    buttonSize: { 
      name: 'Button size',
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    animation: { 
      name: 'Enable animation',
      control: 'boolean',
      table: { category: 'Options' },
    },
    imageAlt: { 
      name: 'Image alt text',
      control: 'text',
      table: { category: 'Data' },
    },
  },
}
 
export default meta;
