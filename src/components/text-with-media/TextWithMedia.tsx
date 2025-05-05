import { useEffect } from 'react';
import TextBlock from "../text/TextBlock";
import Heading from "../text/Heading";
import ResponsiveImage from "../responsive-image/ResponsiveImage";
import Button from "../button/Button";
import './text-with-media.css';

interface TextWithMediaBlockProps {
  imageAlignment?: 'left' | 'right'; // Optional prop for callout imageAlignment
  baseClass?: string | 'text';
  width?: 'components' | 'inner';
  animation?: boolean; // Optional prop for animation class
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for callout theme
  twmHeading?: string; // Optional prop for heading
  twmContent?: string; // Optional prop for image source
  twmImageName?: string; // Optional prop for image name
  twmImageAlt?: string; // Optional prop for image alt text
  twmButtonLabel?: string; // Optional prop for button label
  twmButtonLink?: string; // Optional prop for button link
  twmButtonTitle?: string; // Optional prop for button title
  twmButtonType?: 'button' | 'button-link' | 'text-link'; // Optional prop for button type
}

export default function TextWithMediaBlock({imageAlignment, baseClass, animation, theme= 'primary', width = 'components', twmHeading, twmContent, twmImageAlt, twmImageName, twmButtonLabel, twmButtonLink, twmButtonTitle, twmButtonType }: TextWithMediaBlockProps) {
  useEffect(() => {
    const textWithMedia = document.querySelector('.text-with-media[data-component-animation="true"]');
    const mediaItems = document.querySelectorAll('.text-with-media__media');
    const mediaTextItems = document.querySelectorAll('.text-with-media__content');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if the target is intersecting and animation is enabled
          if (entry.isIntersecting && textWithMedia) {
            // Check if the target is a media item
            if (Array.from(mediaItems).includes(entry.target)) {
              entry.target.classList.add('animate');
              setTimeout(() => {
              entry.target.classList.add('fade-in-left');
              }, 100 * (Array.from(mediaItems).indexOf(entry.target) + 1));
            }
            // Check if the target is a media text item
            if (Array.from(mediaTextItems).includes(entry.target)) {
              entry.target.classList.add('animate');
              setTimeout(() => {
                entry.target.classList.add('fade-in-right');
              }, 100 * (Array.from(mediaTextItems).indexOf(entry.target) + 1));
            }
          }
        });
      },
      { threshold: 0.4 } // Adjust threshold as needed
    );

    // Observe each media item and text item
    mediaItems.forEach((item) => observer.observe(item));
    mediaTextItems.forEach((item) => observer.observe(item));
    return () => {
      mediaItems.forEach((item) => observer.unobserve(item));
      mediaTextItems.forEach((item) => observer.unobserve(item));
    };
  }, [animation]);

  return (
    <div
      data-component-alignment={imageAlignment || 'left'}
      data-component-width={width}
      data-component-animation={animation}
      data-component-theme={theme || 'primary'}
      className={`text-with-media ${baseClass || ''}`}
    >
      <div className="text-with-media__inner">
        <div className="text-with-media__media">
          <ResponsiveImage sizes={[200,400,600]} imageName={twmImageName || "6-11-11-29 PM-2023-FUJIFILM-X-T3-DSCF4085"} alt={twmImageAlt || "Sequoia National Park, California"}/>
        </div>
        <div className="text-with-media__content">
          <Heading level="h2" baseClass="text-with-media__heading" content={twmHeading || "Text with Media"} />
          <TextBlock style="default" width="content">
            <p dangerouslySetInnerHTML={{ __html: twmContent || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }} />
          </TextBlock>
          <div className="text-with-media__actions">
            <Button
              baseClass={['text-with-media__link'].join(' ')}
              theme="inherit"
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
