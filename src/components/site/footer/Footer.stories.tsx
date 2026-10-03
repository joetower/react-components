import SiteFooter from "./Footer";
import { Meta } from "@storybook/react-vite";

export const Footer = (
  { theme }
  : { 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <SiteFooter
    theme={theme}
  />
);

Footer.args = {
  theme: 'primary',
};

const meta: Meta<typeof Footer> = {
  title: 'Components/Site/Footer',
  component: Footer,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
    },
  },
}
 
export default meta;
