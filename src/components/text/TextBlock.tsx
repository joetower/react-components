import './text.css';

interface TextBlockProps {
  style: 'default' | 'emphasized' ;
  baseClass?: string | 'text';
  width?: 'components' | 'inner' | 'wide' | 'full';
  children?: React.ReactNode;
}

export default function TextBlock({style, baseClass, children, width = 'full' }: TextBlockProps) {
  return (
    <div
      data-component-style={style}
      data-component-width={width}
      className={`text-block ${baseClass || ''}`}
    >
      <div
      className={`text-block__inner ${baseClass || ''}`}
      >
        {children}
      </div>
    </div>
  );
}
