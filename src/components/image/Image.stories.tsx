import { Meta } from '@storybook/react';
import ImageItem from "./Image";

// Default export for Storybook
interface ImageProps {
  src: string;
  alt: string;
}

export const Image = ({ src, alt }: ImageProps) => (
  <ImageItem src={src} alt={alt} />
);


Image.args = {
  src: 'https://placehold.co/600x400',
  alt: 'Placeholder Image',
};

// Default export for Storybook
const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
  },
}
 
export default meta;
