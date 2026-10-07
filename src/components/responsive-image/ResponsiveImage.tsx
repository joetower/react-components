import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion"; // or "motion/react"
import type { MotionProps } from "framer-motion";
import "./responsive-image.css"; // Import your CSS file for styles

interface ResponsiveImageProps {
  imageName: string;
  alt: string;
  credit?: string;
  caption?: string;
  ext?: "jpg" | "jpeg" | "png" | "webp" | "avif";
  sizes?: number[]; // Example: [200, 400, 800]
  basePath?: string;
  hasLoading?: "lazy" | "eager";
}

// Typed as MotionProps so `ease` isn't widened to `string` (which TypeScript rejects)
const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageName,
  alt,
  ext = "jpg",
  credit,
  caption,
  sizes = [400, 800, 1200, 1600],
  basePath = "/images",
  hasLoading,
}) => {
  const prefersReducedMotion = useReducedMotion();
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

  const picture = (
    <picture>
      <source type="image/avif" srcSet={createSrcSet("avif")} />
      <source type="image/webp" srcSet={createSrcSet("webp")} />
      <img
        src={isLoaded ? currentSrc : lowResSrc} // fallback if browser doesn't support source types
        alt={alt}
        loading={hasLoading ? hasLoading : "lazy"}
        className={`responsive-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={handleImageLoad}
      />
    </picture>
  );

  const figcaption = caption ? (
    <figcaption>
      {caption} {credit ? `| ${credit}` : null}
    </figcaption>
  ) : null;

  return (
    <>
      {!prefersReducedMotion &&
        (caption ? (
          <motion.figure {...fadeUp}>
            {picture}
            {figcaption}
          </motion.figure>
        ) : (
          <motion.div {...fadeUp} className="responsive-image__wrapper">{picture}</motion.div>
        ))}

      {prefersReducedMotion &&
        (caption ? (
          <figure>
            {picture}
            {figcaption}
          </figure>
        ) : (
          picture
        ))}
    </>
  );
};

export default ResponsiveImage;
