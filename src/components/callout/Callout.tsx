import './callout.css'; // Import the SCSS file for styling
interface CalloutProps {
  heading: string;
  text: string;
  link: string;
  link_text?: string; // Optional prop for link text
  link_title?: string; // Added link_title prop
  animation?: boolean; // Optional prop for animation class
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for callout variant
  alignment?: 'left' | 'center' | 'right'; // Optional prop for callout alignment
}

export default function Callout({heading, text, link, link_title, link_text, animation, variant, alignment}: CalloutProps) {
  return (<>
    <div className="callout" data-component-animation={animation ? 'true' : 'false'} data-component-variant={variant || 'primary'} data-component-alignment={alignment || 'left'}>
      <div className="callout__content">
        <h2 className="callout__heading">
          {heading}
        </h2>
        <div className="callout__text">
          <p>{text}</p>
        </div>
        <div className="callout__actions">
          <a className="callout__link" href={link} target="_blank" rel="noopener noreferrer" title={link_title}>
            {link_text}
          </a>
        </div>
      </div>
    </div>
  </>);
}
