import TextBlockWithMediaItem from './TextWithMedia';
import { Meta } from '@storybook/react';

// Default export for Storybook
interface TextBlockWithMediaProps {
  imageAlignment?: 'left' | 'right'; // Optional prop for callout imageAlignment
  baseClass?: string | 'text';
  width?: 'components' | 'inner';
  twmContent?: string;
  twmHeading?: string;
  twmImageName?: string;
  twmImageAlt?: string;
  twmButtonLabel?: string;
  twmButtonLink?: string;
  twmButtonTitle?: string;
  twmButtonType?: 'button' | 'button-link' | 'text-link'; // Optional prop for button type
}

export const TextBlockWithMedia = ({ imageAlignment = 'left', width = 'components', twmHeading, twmContent, twmImageAlt, twmImageName, twmButtonLabel, twmButtonLink, twmButtonTitle, twmButtonType }: TextBlockWithMediaProps) => (
  <TextBlockWithMediaItem 
  imageAlignment={imageAlignment} 
  baseClass='text' 
  width={width} 
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
  imageAlignment: 'left',
  width: 'components',
  baseClass: 'item',
  twmHeading: 'Text with Media',
  twmContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  twmImageName: '6-11-11-29 PM-2023-FUJIFILM-X-T3-DSCF4085',
  twmImageAlt: 'Sequoia National Park, California',
  twmButtonLabel: 'Check it out',
  twmButtonLink: '#',
  twmButtonTitle: 'Check it out',
  twmButtonType: 'button-link',
};

// Default export for Storybook
const meta: Meta<typeof TextBlockWithMedia> = {
  title: 'Components/Text/TextBlockWithMedia',
  component: TextBlockWithMedia,
  argTypes: {
    twmHeading: { control: 'text' },
    twmContent: { control: 'text' },
    twmImageAlt: { control: 'text' },
    twmImageName: { control: 'text' },
    twmButtonLabel: { control: 'text' },
    twmButtonLink: { control: 'text' },
    twmButtonTitle: { control: 'text' },
    twmButtonType: {
      options: ['button', 'button-link', 'text-link'],
      control: { type: 'radio' },
    },
    width: {
      options: ['components', 'inner'],
      control: { type: 'radio' },
    },
    imageAlignment: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
  },
}
 
export default meta;
