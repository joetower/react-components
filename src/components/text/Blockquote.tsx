import './blockquote.css';
import { motion } from 'framer-motion';

interface BlockquoteProps {
  style: 'quote' | 'bar' ;
  baseClass?: string | 'blockquote';
  width?: 'content' | 'full';
  align?: 'left' | 'center' | 'right';
  author?: string; // Optional prop for author name
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for card theme
  content: string; // Required prop for image source
}

export default function Blockquote({style, baseClass, content, width = 'full', align = 'left', theme = 'primary', author = 'Author' }: BlockquoteProps) {
  return (
    <div
    className={
      `blockquote__container ${baseClass || ''}`} 
      data-component-style={style}
      data-component-width={width}
      data-component-align={align}
      data-component-theme={theme}>
      <div className={`blockquote__inner`}>
        <figure className={`blockquote__figure ${baseClass || ''}`}>
          <motion.blockquote
          initial={{opacity: 0, y:-100}}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
          animate={{opacity: 1, y:0}} 
          exit={{opacity: 0, y:-100}} 
          transition={{duration: 0.45}}
          className={`blockquote ${baseClass || ''}`}
          >
            <p>{content}</p>
          </motion.blockquote>
          
          <motion.figcaption
          initial={{opacity: 0, y:100}}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
          animate={{opacity: 1, y:0}} 
          exit={{opacity: 0, y:200}} 
          transition={{duration: 0.45}}
          className={`blockquote__caption ${baseClass || ''}`}>
            <cite>— {author}</cite>
          </motion.figcaption>
        </figure>
      </div>
    </div>
  );
}
