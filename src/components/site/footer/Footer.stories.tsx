import SiteFooter from "./Footer";
import { Meta } from "@storybook/react";

export const Footer = (
  { theme }
  : { 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <SiteFooter
    theme={theme}  // Default theme
  />
);

Footer.args = {
  theme: 'primary',  // Default theme
};

// Default export for Storybook
const meta: Meta<typeof Footer> = {
  title: 'Components/Site/Footer',
  component: Footer,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
