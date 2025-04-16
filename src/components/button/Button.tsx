import './button.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for callout variant
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Button type */
  type: 'button' | 'button-link' | 'text-link' | undefined;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export default function Button({variant, size, label, type, ...rest}: ButtonProps) {
  return (
    <>
      {type === 'button' && (
        <button
          type="button"
          data-component-variant={variant || 'primary'} 
          data-component-size={size || 'medium'}
          className={['button'].join(' ')}
          {...rest}
        >
          {label}
        </button>
      )}
      {type === 'button-link' && (
        <a
          data-component-variant={variant || 'primary'} 
          data-component-size={size || 'medium'}
          className={['button'].join(' ')}
          {...rest}
        >
          {label}
        </a>
      )}
      {type === 'text-link' && (
        <a
          data-component-variant={variant || 'primary'} 
          data-component-size={size || 'medium'}
          className={['button'].join(' ')}
          {...rest}
        >
          {label}
        </a>
      )}
    </>
  );
}

