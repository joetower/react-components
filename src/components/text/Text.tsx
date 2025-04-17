import './text.css';

interface TextProps {
  content: string; // Required prop for image source
  style: 'default' | 'emphasized' ;
  baseClass?: string | 'text';
}
export default function Text({ content, style, baseClass }: TextProps) {
  return (
    <p data-component-style={style} className={baseClass}>
      {content}
    </p>
  );
}
