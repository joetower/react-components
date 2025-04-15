import SiteFooter from "./Footer";
import { Meta } from "@storybook/react";

export const Footer = (
  { variant }
  : { 
    variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <SiteFooter
    variant={variant}  // Default variant
  />
);

Footer.args = {
  variant: 'primary',  // Default variant
};

// Default export for Storybook
const meta: Meta<typeof Footer> = {
  title: 'Components/Site/Footer',
  component: Footer,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
