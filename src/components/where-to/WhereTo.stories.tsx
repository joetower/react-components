import Places from './WhereTo';
import { Meta } from '@storybook/react-vite';


interface WhereToProps {
  baseClass?: string | 'where-to';
  width?: 'components' | 'inner' | 'wide' | 'full';
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
    whereToHeading: { 
      name: 'Heading',
      control: 'text',
      table: { category: 'Data' }
    },
    whereToContent: { 
      name: 'Intro content',
      control: 'text',
      table: { category: 'Data' }
    },
    flag: { 
      table: {
        disable: true,
      },
    },
    baseClass: { 
      name: 'Base class',
      control: 'text',
      table: { category: 'Data' }
    },
    children: { 
      name: 'Content',
      control: 'text',
      table: { category: 'Data' }
    },
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'radio' },
      table: { category: 'Options' }
    },
  },
}
 
export default meta;
