import SiteHeader from "./Header";
import { Meta } from "@storybook/react-vite";

import { MemoryRouter } from "react-router-dom";

export const Header = (
  { theme }
  : { 
    theme: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; }) => (
  <MemoryRouter>
    <SiteHeader
      theme={theme}
    />
  </MemoryRouter>
);

Header.args = {
  theme: 'primary',
};

const meta: Meta<typeof Header> = {
  title: 'Components/Site/Header',
  component: Header,
  argTypes: {
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
    },
  },
}
 
export default meta;
