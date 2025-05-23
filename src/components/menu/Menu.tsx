import { NavLink } from 'react-router-dom';
interface MenuProps {
  baseClass?: string | 'menu';
}

const Menu = ({baseClass}: MenuProps) => {
  return (
    <nav className={baseClass}>
      <ul className={`${baseClass}__menu-links`}>
        <li>
          <NavLink to="/about" title='About the app' className="selected">About</NavLink>
        </li>
        <li>
          <a 
          href="/storybook/" 
          title="Storybook Component Library - opens in new tab/window" 
          target='_blank'
          rel="noopener noreferrer"
          >
          Components &#8599;
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
