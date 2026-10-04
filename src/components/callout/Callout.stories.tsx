import CalloutItem from "./Callout";
import { Meta } from "@storybook/react-vite";

export const Callout = (
  { animation, theme, heading, text, link, linkTitle, linkText, alignment, buttonSize }
  : { 
    heading: string; 
    text: string; 
    link: string;
    linkText: string;
    linkTitle: string; 
    animation: boolean;
    buttonSize?: 'small' | 'medium' | 'large';
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
    buttonSize={buttonSize}
  />
);

Callout.args = {
  heading: 'This is a heading',
  text: 'Some posit the matey sudan to be less than purplish. Extending this logic, the sorry deficit reveals itself as an agley degree to those who look.',
  link: '#',
  linkText: 'This is a link text',
  linkTitle: 'This is a link title',
  animation: false,  // Set to true to enable animation
  buttonSize: 'small',
  theme: 'primary',  // Default theme
  alignment: 'left', // Default alignment
};
// Default export for Storybook
const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
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
    text: { 
      name: 'Content',
      control: 'text',
      table: { category: 'Data' },
    },
    link: { 
      name: 'Callout link',
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
    animation: { 
      name: 'Enable animation',
      control: 'boolean',
      table: { category: 'Options' },
    },
    buttonSize: {
      name: 'Button size',
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    alignment: {
      name: 'Text alignment',
      options: ['left', 'center', 'right'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
  },
}
 
export default meta;
