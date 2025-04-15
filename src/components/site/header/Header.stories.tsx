import SiteHeader from "./Header";
import { Meta } from "@storybook/react";

export const Header = (
  { variant }
  : { 
    variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <SiteHeader
    variant={variant}  // Default variant
  />
);

Header.args = {
  variant: 'primary',  // Default variant
};

// Default export for Storybook
const meta: Meta<typeof Header> = {
  title: 'Components/Site/Header',
  component: Header,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
