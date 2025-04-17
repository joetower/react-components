import './text.css';

interface ParagraphProps {
  style: 'default' | 'emphasized' ;
  baseClass?: string | 'text';
  children?: React.ReactNode;
}

export default function Paragraph({style, baseClass, children }: ParagraphProps) {
  return (
    <div
      data-component-style={style}
      className={`text-block ${baseClass || ''}`}
    >
      {children}
    </div>
  );
}
