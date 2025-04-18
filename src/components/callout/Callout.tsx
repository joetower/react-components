import Button from '../button/Button';
import Paragraph from '../text/TextBlock';
import Heading from '../text/Heading';
import './callout.css'; // Import the SCSS file for styling
interface CalloutProps {
  heading: string;
  text: string;
  link: string;
  linkText?: string; // Optional prop for link text
  linkTitle?: string; // Added linkTitle prop
  animation?: boolean; // Optional prop for animation class
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for callout theme
  alignment?: 'left' | 'center' | 'right'; // Optional prop for callout alignment
}

export default function Callout({heading, text, link, linkTitle, linkText, animation, theme, alignment}: CalloutProps) {
  return (<>
    <div className="callout" data-component-animation={animation ? 'true' : 'false'} data-component-theme={theme || 'primary'} data-component-alignment={alignment || 'left'}>
      <div className="callout__content">
        <Heading level='h2' baseClass='callout__heading' content={heading} />
        <div className="callout__text">
          <Paragraph style="default" baseClass='callout__paragraph'>
            {text}
          </Paragraph>
        </div>
        <div className="callout__actions">
          <Button
            baseClass={['callout__link'].join(' ')}            
            theme={theme || 'primary'}
            label={linkText || 'Learn More'}
            type="button-link"
            title={linkTitle}
            href={link}
            />
        </div>
      </div>
    </div>
  </>);
}
