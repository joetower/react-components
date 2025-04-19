import './menu.css';
import { Link } from 'react-router-dom';
interface MenuProps {
  baseClass?: string | 'menu';
}

const Menu = ({baseClass}: MenuProps) => {
  return (
    <nav className={baseClass}>
      <ul className={`${baseClass} menu-links`}>
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
        <Link to="/about">About</Link>
      </li>
      </ul>
    </nav>
  );
};

export default Menu;
