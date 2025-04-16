import type { Meta } from '@storybook/react';
import ButtonItem from './Button';

export const Button = (
  { variant, type, label,size }
  : { 
    label: string;
    type: 'button' | 'button-link' | 'text-link'; 
    variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; 
    size: 'small' | 'medium' | 'large';   // Added size prop s
  }) => (
  <ButtonItem
    label={label}
    type={type}
    variant={variant}  // Default variant
    size={size}  // Default size
  />
);

Button.args = {
  label: 'Button',
  type: 'button',
  variant: 'primary',  // Default variant
  size: 'medium',  // Default size
};


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
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
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
