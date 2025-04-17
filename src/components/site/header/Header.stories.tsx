import SiteHeader from "./Header";
import { Meta } from "@storybook/react";

export const Header = (
  { theme }
  : { 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <SiteHeader
    theme={theme}  // Default theme
  />
);

Header.args = {
  theme: 'primary',  // Default theme
};

// Default export for Storybook
const meta: Meta<typeof Header> = {
  title: 'Components/Site/Header',
  component: Header,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
