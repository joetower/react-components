interface ImageProps {
  src: string; // Required prop for image source
  alt: string; // Required prop for image alt text
}
export default function Image({ src, alt }: ImageProps) {
  return (
    <img src={src} alt={alt} />
  );
}
