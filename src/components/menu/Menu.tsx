import { Link } from 'react-router-dom';
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
          <Link to="/about" title='About the app' viewTransition>About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
