import Image from "../image/Image";
import './card.css'; // Import the SCSS file for styling
interface CardProps {
  heading: string;
  text: string;
  link: string;
  link_text?: string; // Optional prop for link text
  link_title?: string; // Added link_title prop
  imageSrc?: string; // Optional prop for image source
  imageAlt?: string; // Optional prop for image alt text
  animation?: boolean; // Optional prop for animation class
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional prop for card variant
}

export default function Card({heading, text, link, link_title, link_text, animation, imageSrc, imageAlt, variant}: CardProps) {
  return (<>
    <div className="card" data-component-animation={animation ? 'true' : 'false'} data-component-variant={variant || 'primary'}>
      {imageSrc && (
        <div className="card__image">
          <Image src={imageSrc} alt={imageAlt || "Placeholder Image"} />
        </div>
      )}
      <div className="card__content">
        <div className="card__heading">
          <h2>{heading}</h2>
        </div>
        <div className="card__text">
          {text}
        </div>
        <div className="card__actions">
          <a className="card__link" href={link} target="_blank" rel="noopener noreferrer" title={link_title}>
            {link_text}
          </a>
        </div>
      </div>
    </div>
  </>);
}
