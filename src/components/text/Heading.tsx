import React from 'react';
import './heading.css';

interface HeadingProps {
  content: string; // Required prop for image source
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Added prop for heading level
  baseClass?: string | 'heading';
  width?: 'content' | 'full';
  linkTitle?: string; // Added link_title prop
  link?: string; // Added link prop
  linkClass?: string; // Added link_class prop
}
export default function Heading({ content, level, baseClass, link, linkTitle, linkClass, width }: HeadingProps & { link?: string }) {
  const headingElement = React.createElement(
    level,
    { className: `heading ${baseClass} ${baseClass}-${level}`.trim(), 'data-component-width': width },
    content
  );

  return link 
    ? React.cloneElement(headingElement, {}, <a href={link} className={linkClass} title={linkTitle}>{content}</a>) 
    : headingElement;
}
