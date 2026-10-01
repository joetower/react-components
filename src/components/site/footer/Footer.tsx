import './footer.css'; // Import the SCSS file for styling
interface FooterProps {
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for card theme
}

export default function Footer({theme}: FooterProps) {
  return (
  <>
  <footer className="footer" data-component-theme={theme}>
    <div className="footer__inner">
      <div className="footer__source">
        <p>View <a href="https://github.com/joetower/react-components" title="View Source Code">source code</a></p>
      </div>
      <nav className="footer__nav" aria-label="Footer Menu">
        <ul>
          <li><a href="https://github.com/joetower" title="GitHub">GitHub</a></li>
          |
          <li><a href="https://joetower.com" title="My Website">joetower.com</a></li>
        </ul>
      </nav>
    </div>
  </footer>
  </>
  );
}
