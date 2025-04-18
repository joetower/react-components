import './text.css';

interface TextBlockProps {
  style: 'default' | 'emphasized' ;
  baseClass?: string | 'text';
  width?: 'content' | 'full';
  children?: React.ReactNode;
}

export default function TextBlock({style, baseClass, children, width = 'full' }: TextBlockProps) {
  return (
    <div
      data-component-style={style}
      data-component-width={width}
      className={`text-block ${baseClass || ''}`}
    >
      {children}
    </div>
  );
}
