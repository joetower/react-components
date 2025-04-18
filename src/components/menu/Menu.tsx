import './menu.css';

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
      {/* <li>
        <a 
        href="/about" 
        title="Application about page" 
        className={window.location.pathname === '/about' ? 'active' : ''}
        >
        About
        </a>
      </li> */}
      </ul>
    </nav>
  );
};

export default Menu;
