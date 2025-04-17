import './text.css';

interface ParagraphProps {
  content: string; // Required prop for image source
  style: 'default' | 'emphasized' ;
  baseClass?: string | 'text';
}
export default function Paragraph({ content, style, baseClass }: ParagraphProps) {
  return (
    <p data-component-style={style} className={baseClass}>
      {content}
    </p>
  );
}
