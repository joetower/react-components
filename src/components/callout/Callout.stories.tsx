import CalloutItem from "./Callout";
import { Meta } from "@storybook/react";

export const Callout = (
  { animation, theme, heading, text, link, linkTitle, linkText, alignment }
  : { 
    heading: string; 
    text: string; 
    link: string;
    linkText: string;
    linkTitle: string; 
    animation: boolean;  
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; 
    alignment?: 'left' | 'center' | 'right'; // Optional prop for callout alignment
  }) => (
  <CalloutItem
    heading={heading}
    text={text}
    link={link}
    linkTitle={linkTitle}
    linkText={linkText}
    animation={animation}  // Set to true to enable animation
    theme={theme}  // Default theme
    alignment={alignment} // Default alignment
  />
);

Callout.args = {
  heading: 'This is a heading',
  text: 'Some posit the matey sudan to be less than purplish. Extending this logic, the sorry deficit reveals itself as an agley degree to those who look.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  animation: false,  // Set to true to enable animation
  theme: 'primary',  // Default theme
  alignment: 'left', // Default alignment
};
// Default export for Storybook
const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
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
    animation: { control: 'boolean' },  // Set to true to enable animation
    alignment: {
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
