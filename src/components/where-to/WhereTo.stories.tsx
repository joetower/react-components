import Places from './WhereTo';
import { Meta } from '@storybook/react';


interface WhereToProps {
  baseClass?: string | 'where-to';
  width?: 'components' | 'inner';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for callout theme
  whereToContent?: string; // Optional prop for image source
  whereToHeading?: string; // Optional prop for image name
  children?: React.ReactNode; // Optional prop for children
}


export const WhereTo = ({ baseClass, width, theme, whereToContent, whereToHeading, children}: WhereToProps) => (
  <Places
  whereToHeading={whereToHeading}
  whereToContent={whereToContent}
  baseClass={baseClass}
  width={width}
  theme={theme}
  >
    {children}
  </Places>
);

WhereTo.args = {
  width: 'components',
  theme: 'secondary',
  baseClass: 'places',
  whereToHeading: 'Where would you like to go?',
  whereToContent: "Let's go somewhere. This field will search a flag API for the state or country you enter and then it will display the flag for that place.",
}

// Default export for Storybook
const meta: Meta<typeof Places> = {
  title: 'Components/Where To',
  component: Places,
  argTypes: {
    whereToHeading: { control: 'text' },
    whereToContent: { control: 'text' },
    baseClass: { control: 'text' },
    children: { control: 'text' },
    theme: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
    },
    width: {
      options: ['components', 'inner'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
