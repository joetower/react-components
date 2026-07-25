import Button from '../button/Button';
import ResponsiveImage from '../responsive-image/ResponsiveImage';
import TextBlock from '../text/TextBlock';
import Heading from '../text/Heading';
import './banner.css'; // Import the SCSS file for styling
interface BannerProps {
  heading: string;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Added prop for heading level
  text: string;
  link: string;
  linkText?: string; // Optional prop for link text
  linkTitle?: string; // Added linkTitle prop
  imageName?: string; // Required prop for image name
  imageSrc?: string; // Optional prop for image source
  imageAlt?: string; // Optional prop for image alt text
  style?: 'default' | 'compressed';
  buttonSize?: 'small' | 'medium' | 'large';
  animation?: boolean; // Optional prop for animation class
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for banner theme
}

export default function Banner({heading, headingLevel, text, link, linkTitle, linkText, animation, imageSrc, imageAlt, theme, style, buttonSize, imageName = '6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085'}: BannerProps) {
  return (<>
    <div className="banner" data-component-animation={animation ? 'true' : 'false'} data-component-theme={theme || 'primary'} data-component-style={style || 'default'}>
      <div className="banner__inner">
        {imageSrc || imageName && (
          <div className="banner__image">
              <ResponsiveImage sizes={[200,400,600,800,1200,1400,1600]} alt={imageAlt || "Placeholder Image"} imageName={imageName} />
          </div>
        )}
        <div className="banner__content">
          <div className="banner__text">
            <Heading level={headingLevel} baseClass='banner__heading' content={heading} />
            <TextBlock style="default" baseClass='banner__paragraph'>
              <p>{text}</p>
            </TextBlock>
          </div>
            <div className="banner__actions">
            <Button
              baseClass={['banner__link'].join(' ')}            
              theme={theme || 'primary'}
              size={buttonSize || 'small'}
              label={linkText || 'Learn More'}
              type="button-link"
              title={linkTitle}
              href={link}
            />
            </div>
        </div>
      </div>
    </div>
  </>);
}
