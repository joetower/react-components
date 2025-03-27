import { Meta } from '@storybook/react';
import Image from "./Image";

// Default export for Storybook
interface ImageProps {
  src: string;
  alt: string;
}

export const Default = ({ src, alt }: ImageProps) => (
  <img src={src} alt={alt} />
);


Default.args = {
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
