import { NavLink } from 'react-router-dom';
interface MenuProps {
  baseClass?: string | 'menu';
}

const Menu = ({baseClass}: MenuProps) => {
  return (
    <nav className={baseClass}>
      <ul className={`${baseClass}__menu-links`}>
        <li>
          <a 
          href="/storybook/" 
          title="Storybook Component Library" 
          
          className={window.location.pathname === '/storybook/' ? 'active' : ''}
          >
          Components
          </a>
        </li>
        <li>
          <NavLink to="/about" title='About the app' className="selected">About</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
