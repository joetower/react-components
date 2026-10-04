import TextBlockWithMediaItem from './TextWithMedia';
import { Meta } from '@storybook/react-vite';

// Default export for Storybook
interface TextBlockWithMediaProps {
  twmContent?: string;
  twmHeading?: string;
  twmImageName?: string;
  twmImageAlt?: string;
  twmButtonLabel?: string;
  twmButtonLink?: string;
  twmButtonTitle?: string;
  twmButtonType?: 'button' | 'button-link' | 'text-link';
  imageAlignment?: 'left' | 'right';
  baseClass?: string | 'text';
  width?: 'components' | 'inner' | 'wide' | 'full';
  priority?: 'equal' | 'media' | 'text';
  animation?: boolean;
}

export const TextBlockWithMedia = ({ imageAlignment = 'left', width = 'components', priority = 'equal', theme = 'primary', animation, twmHeading, twmContent, twmImageAlt, twmImageName, twmButtonLabel, twmButtonLink, twmButtonTitle, twmButtonType }: TextBlockWithMediaProps) => (
  <TextBlockWithMediaItem 
  imageAlignment={imageAlignment} 
  baseClass='text' 
  width={width} 
  priority={priority}
  theme={theme}
  animation={animation}
  twmHeading={twmHeading}
  twmContent={twmContent} 
  twmImageAlt={twmImageAlt} 
  twmImageName={twmImageName} 
  twmButtonLabel={twmButtonLabel}
  twmButtonLink={twmButtonLink}
  twmButtonTitle={twmButtonTitle}
  twmButtonType={twmButtonType}
  />
);


TextBlockWithMedia.args = {
  baseClass: 'item',
  twmHeading: 'Text with Media',
  twmContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  twmImageName: '6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085',
  twmImageAlt: 'Sequoia National Park, California',
  twmButtonLabel: 'Check it out',
  twmButtonLink: '#',
  twmButtonTitle: 'Check it out',
  twmButtonType: 'button-link',
  imageAlignment: 'left',
  width: 'components',
  priority: 'equal',
  theme: 'primary',
  animation: false,
};

// Default export for Storybook
const meta: Meta<typeof TextBlockWithMedia> = {
  title: 'Components/Text Block With Media',
  component: TextBlockWithMedia,
  argTypes: {
    baseClass: {
      name: 'Text with Media base class',
      control: 'text', 
      table: { category: 'Data' }
    },
    twmHeading: { 
      name: 'Heading',
      control: 'text' , 
      table: { category: 'Data' }
    },
    twmContent: { 
      name: 'Content',
      control: 'text' , 
      table: { category: 'Data' }
    },
    twmImageAlt: { 
      name: 'Img alt text',
      control: 'text' , 
      table: { category: 'Data' }
    },
    twmImageName: {
      name: 'Img name',
      control: 'text' , 
      table: {
        disable: true,
      },
    },
    twmButtonLabel: { control: 'text', table: { category: 'Data' } },
    twmButtonLink: { control: 'text' , table: { category: 'Data' }},
    twmButtonTitle: { control: 'text' , table: { category: 'Data' }},
    twmButtonType: {
      name: 'Button type (a, button)',
      options: ['button', 'button-link', 'text-link'],
      control: { type: 'select' },
      table: { category: 'Data' }
    },
    animation: { 
      name: 'Enable animation',
      control: 'boolean', 
      table: { category: 'Options' } 
    },
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'] , table: { category: 'Options' },
      control: { type: 'select' },
    },
    priority: {
      name: 'Priority',
      options: ['equal', 'media', 'text'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
    imageAlignment: {
      name: 'Image alignment',
      options: ['left', 'right'],
      control: { type: 'select' },
      table: { category: 'Options' }
    },
  },
}
 
export default meta;
