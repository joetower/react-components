import type { Meta } from '@storybook/react-vite';
import ButtonItem from './Button';

export const Button = (
  { theme, type, label, size, href, title, baseClass }
  : { 
    label: string;
    type: 'button' | 'button-link' | 'text-link'; 
    theme: 'inherit' | 'primary' | 'secondary' | 'tertiary' | 'quaternary'; 
    size: 'small' | 'medium' | 'large';   // Added size prop
    href?: string;
    title?: string;
    baseClass?: string;
  }) => (
  <ButtonItem
    label={label}
    type={type}
    theme={theme}  // Default theme
    size={size}  // Default size
    href={href}
    title={title}
    baseClass={baseClass}
  />
);

Button.args = {
  label: 'Button',
  type: 'button',
  theme: 'primary',  // Default theme
  size: 'medium',  // Default size
  href: '#',
  title: 'Button Title',
  baseClass: 'button',
};


const meta = {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary'], // Add valid options here
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'button-link', 'text-link'], // Add valid options here
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'], // Add valid options here
    }
  },
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
