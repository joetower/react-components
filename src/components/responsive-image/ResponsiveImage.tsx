import React, { useState, useEffect } from "react";
import './responsive-image.css'; // Import your CSS file for styles

interface ResponsiveImageProps {
  imageName: string;
  alt: string;
  ext?: "jpg" | "jpeg" | "png";
  sizes?: number[];
  basePath?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageName,
  alt,
  ext = "jpg",
  sizes = [400, 800, 1200, 1600],
  basePath = "/images",
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const sortedSizes = [...sizes].sort((a, b) => a - b); // Smallest → largest

  const updateImageSrc = () => {
    const windowWidth = window.innerWidth;

    const suitableSize = sortedSizes.reduce((prev, curr) =>
      windowWidth >= curr ? curr : prev
    );

    const imageSrc = `${basePath}/${imageName}-${suitableSize}.${ext}`;
    setCurrentSrc(imageSrc);
  };

  useEffect(() => {
    updateImageSrc();

    const handleResize = () => {
      updateImageSrc();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sizes, basePath, imageName, ext]);

  const fallbackSrc = `${basePath}/${imageName}-${Math.min(...sizes)}.${ext}`;

  // Low-res image for blur-up effect (e.g., a 400px version)
  const lowResSrc = `${basePath}/${imageName}-400.${ext}`;

  // Handle image load event to remove the blur
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <picture className="responsive-image__container">
      {/* You can still include <source> elements for AVIF, WebP, etc., as needed */}
      <img
        src={isLoaded ? currentSrc || fallbackSrc : lowResSrc}
        alt={alt}
        className={`responsive-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={handleImageLoad}
        loading="lazy"
        srcSet={`${basePath}/${imageName}-400.${ext} 400w, 
        ${basePath}/${imageName}-800.${ext} 800w, 
        ${basePath}/${imageName}-1200.${ext} 1200w, 
        ${basePath}/${imageName}-1600.${ext} 1600w`}
      />
    </picture>
  );
};

export default ResponsiveImage;
