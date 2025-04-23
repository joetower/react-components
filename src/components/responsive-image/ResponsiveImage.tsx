import React, { useState, useEffect, ReactNode } from "react";
import './responsive-image.css'; // Import your CSS file for styles

interface ResponsiveImageProps {
  imageName: string;
  alt: string;
  credit?: string;
  ext?: "jpg" | "jpeg" | "png" | "webp" | "avif";
  sizes?: number[]; // Example: [200, 400, 800]
  basePath?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageName,
  alt,
  ext = "jpg",
  credit,
  sizes = [400, 800, 1200, 1600],
  basePath = "/images",
}) => {
  const sortedSizes = [...sizes].sort((a, b) => a - b);
  const smallestSize = sortedSizes[0];
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  const updateImageSrc = () => {
    const windowWidth = window.innerWidth;
    const bestFitSize = sortedSizes.reduce((prev, curr) =>
      windowWidth >= curr ? curr : prev
    );
    const imagePath = `${basePath}/${imageName}-${bestFitSize}.${ext}`;
    setCurrentSrc(imagePath);
  };

  useEffect(() => {
    updateImageSrc();
    const handleResize = () => updateImageSrc();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageName, ext, basePath, sizes]);

  const lowResSrc = `${basePath}/${imageName}-${smallestSize}.${ext}`;
  const handleImageLoad = () => setIsLoaded(true);

  const createSrcSet = (format: string) =>
    sortedSizes
      .map((size) => `${basePath}/${imageName}-${size}.${format} ${size}w`)
      .join(", ");

  return (
    <>
      {alt ? (
        <figure>
          <picture>
            <source
              type="image/avif"
              srcSet={createSrcSet("avif")}
            />
            <source
              type="image/webp"
              srcSet={createSrcSet("webp")}
            />
            <img
              src={isLoaded ? currentSrc : lowResSrc}
              alt={alt}
              loading="lazy"
              className={`responsive-image ${isLoaded ? "loaded" : "loading"}`}
              srcSet={createSrcSet("jpg")}
              onLoad={handleImageLoad}
            />
          </picture>
          <figcaption>{alt} {credit ? `| ${credit}` : null}</figcaption>
        </figure>
      ) : (
        <picture>
          <source
            type="image/avif"
            srcSet={createSrcSet("avif")}
          />
          <source
            type="image/webp"
            srcSet={createSrcSet("webp")}
          />
          <img
            src={isLoaded ? currentSrc : lowResSrc}
            alt={alt}
            loading="lazy"
            className={`responsive-image ${isLoaded ? "loaded" : "loading"}`}
            srcSet={createSrcSet("jpg")}
            onLoad={handleImageLoad}
          />
        </picture>
      )}
    </>
  );
};

export default ResponsiveImage;
