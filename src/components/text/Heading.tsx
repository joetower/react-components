import React from 'react';
import './heading.css';

interface HeadingProps {
  content: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  baseClass?: string;
  width?: 'content' | 'full';
  linkTitle?: string;
  link?: string; 
  linkClass?: string;
}
export default function Heading({ content, level, baseClass, link, linkTitle, linkClass, width }: HeadingProps & { link?: string }) {
  const headingElement = React.createElement(
    level,
    { className: `heading ${baseClass} ${baseClass}-${level}`.trim(), 'data-component-width': width },
    content
  );

  return link
    ? React.cloneElement(headingElement, {}, 
    <a href={link} className={`heading__link ${linkClass}`.trim()} title={linkTitle}>{content}</a>) 
    : headingElement;
}
