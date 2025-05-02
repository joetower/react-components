import './button.css';

export interface ButtonProps {
  theme?: 'inherit' | 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for callout theme
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Button type */
  type: 'button' | 'button-link' | 'text-link' | undefined;
  /** Optional custom class name */
  baseClass?: string | 'button';
  /** Optional title */
  title?: string;
  /** Optional href */
  href?: string;
  /** Optional tabIndex */
  tabIndex?: number;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export default function Button({theme, size, label, type, href, title, baseClass, tabIndex, ...rest}: ButtonProps) {
  return (
    <>
      {type === 'button' && (
        <button
          type="button"
          data-link-type={type}
          data-component-theme={theme || 'primary'} 
          data-component-size={size || 'medium'}
          className={[`${baseClass}`, 'button'].join(' ')}
          tabIndex={tabIndex}
          {...rest}
        >
          {label}
        </button>
      )}
      {type === 'button-link' && (
        <a
          data-link-type={type}
          data-component-theme={theme || 'primary'} 
          data-component-size={size || 'medium'}
          className={[`${baseClass}`, 'button', 'button-link'].join(' ')}
          href={href}
          title={title}
          tabIndex={tabIndex}
          {...rest}
        >
          {label}
        </a>
      )}
      {type === 'text-link' && (
        <a
          data-link-type={type}
          data-component-theme={theme || 'primary'} 
          data-component-size={size || 'medium'}
          className={[`${baseClass}`, 'button', 'text-link'].join(' ')}
          href={href}
          title={title}
          tabIndex={tabIndex}
          {...rest}
        >
          {label}
        </a>
      )}
    </>
  );
}

