import Button from '../button/Button';
import Paragraph from '../text/Paragraph';
import './callout.css'; // Import the SCSS file for styling
interface CalloutProps {
  heading: string;
  text: string;
  link: string;
  link_text?: string; // Optional prop for link text
  link_title?: string; // Added link_title prop
  animation?: boolean; // Optional prop for animation class
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for callout theme
  alignment?: 'left' | 'center' | 'right'; // Optional prop for callout alignment
}

export default function Callout({heading, text, link, link_title, link_text, animation, theme, alignment}: CalloutProps) {
  return (<>
    <div className="callout" data-component-animation={animation ? 'true' : 'false'} data-component-theme={theme || 'primary'} data-component-alignment={alignment || 'left'}>
      <div className="callout__content">
        <h2 className="callout__heading">
          {heading}
        </h2>
        <div className="callout__text">
          <Paragraph style="default" baseClass='callout__paragraph' content={text} />
        </div>
        <div className="callout__actions">
          <Button
            baseClass={['callout__link'].join(' ')}            
            theme={theme || 'primary'}
            label={link_text || 'Learn More'}
            type="button-link"
            title={link_title}
            href={link}
            />
        </div>
      </div>
    </div>
  </>);
}
