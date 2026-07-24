import Button from '../button/Button';
import ResponsiveImage from '../responsive-image/ResponsiveImage';
import TextBlock from '../text/TextBlock';
import Heading from '../text/Heading';
import './card.css'; // Import the SCSS file for styling
interface CardProps {
  heading: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Added prop for heading level
  text: string;
  link: string;
  linkText?: string; // Optional prop for link text
  linkTitle?: string; // Added linkTitle prop
  buttonSize?: 'small' | 'medium' | 'large';
  imageName: string; // Required prop for image name
  imageSrc?: string; // Optional prop for image source
  imageAlt?: string; // Optional prop for image alt text
  animation?: boolean; // Optional prop for animation class
  showButton?: boolean; // Optional prop to show buttons
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for card theme
}

export default function Card({heading, headingLevel = 'h3', text, link, linkTitle, linkText, animation, imageSrc, imageAlt, buttonSize, theme, showButton, imageName = '6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085'}: CardProps) {
  return (<>
    <div className="card" data-component-animation={animation ? 'true' : 'false'} data-component-theme={theme || 'primary'}>
      {imageSrc && (
        <div className="card__image">
          <a className="card__image__link" href={link} target="_blank" rel="noopener noreferrer" title={linkTitle} tabIndex={-1} aria-hidden="true">
            <ResponsiveImage sizes={[200,400,600,800]} alt={imageAlt || "Placeholder Image"} imageName={imageName} />
          </a>
        </div>
      )}
      <div className="card__content">
        <Heading level={headingLevel} baseClass='card__heading' content={heading} link={link} linkTitle={linkTitle} linkClass='card__heading__link' />
        <div className="card__text">
          <TextBlock style="default" baseClass='card__paragraph'>
            {text}
          </TextBlock>
        </div>
        {showButton && (
            <div className="card__actions">
            <Button
              baseClass={['card__link'].join(' ')}            
              theme={theme || 'primary'}
              size={buttonSize || 'small'}
              label={linkText || 'Learn More'}
              type="button-link"
              title={linkTitle}
              href={link}
              aria-hidden="true"
              tabIndex={-1}
            />
            </div>
        )}
      </div>
    </div>
  </>);
}
