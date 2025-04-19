import SiteHeader from "./Header";
import { Meta } from "@storybook/react";

import { MemoryRouter } from "react-router-dom";

export const Header = (
  { theme }
  : { 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <MemoryRouter>
    <SiteHeader
      theme={theme}  // Default theme
    />
  </MemoryRouter>
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
