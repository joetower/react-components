import TextBlock from "../text/TextBlock";
import Heading from "../text/Heading";
import ResponsiveImage from "../responsive-image/ResponsiveImage";
import Button from "../button/Button";
import './text-with-media.css';

interface TextWithMediaBlockProps {
  imageAlignment?: 'left' | 'right'; // Optional prop for callout imageAlignment
  baseClass?: string | 'text';
  width?: 'components' | 'inner';
  twmHeading?: string; // Optional prop for heading
  twmContent?: string; // Optional prop for image source
  twmImageName?: string; // Optional prop for image name
  twmImageAlt?: string; // Optional prop for image alt text
  twmButtonLabel?: string; // Optional prop for button label
  twmButtonLink?: string; // Optional prop for button link
  twmButtonTitle?: string; // Optional prop for button title
  twmButtonType?: 'button' | 'button-link' | 'text-link'; // Optional prop for button type
}

export default function TextWithMediaBlock({imageAlignment, baseClass, width = 'components', twmHeading, twmContent, twmImageAlt, twmImageName, twmButtonLabel, twmButtonLink, twmButtonTitle, twmButtonType }: TextWithMediaBlockProps) {
  return (
    <div
      data-component-alignment={imageAlignment || 'left'}
      data-component-width={width}
      className={`text-with-media ${baseClass || ''}`}
    >
      <div className="text-with-media__inner">
        <div className="text-with-media__media">
          <ResponsiveImage sizes={[200,400,600]} imageName={twmImageName || "6-11-11-29 PM-2023-FUJIFILM-X-T3-DSCF4085"} alt={twmImageAlt || "Sequoia National Park, California"}/>
        </div>
        <div className="text-with-media__content">
          <Heading level="h2" baseClass="text-with-media__heading" content={twmHeading || "Text with Media"} />
          <TextBlock style="default" width="content">
            {twmContent || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
          </TextBlock>
          <div className="text-with-media__actions">
            <Button
              baseClass={['text-with-media__link'].join(' ')}
              theme="primary"
              label={twmButtonLabel || "Check it out"}
              type={twmButtonType || 'button-link'}
              title={twmButtonTitle || "Check it out"}
              href={twmButtonLink || "#"}
              aria-hidden="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
