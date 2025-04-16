import './footer.css'; // Import the SCSS file for styling
interface FooterProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' ; // Optional prop for card variant
}

export default function Footer({variant}: FooterProps) {
  return (
  <>
  <footer className="footer" data-component-variant={variant}>
    <div className="footer__inner">
      <div className="footer__logo">
        <p>View <a href="https://github.com/joetower/react-components" title="View Source Code">source code</a></p>
      </div>
      <nav className="footer__nav">
        <ul>
          <li><a href="https://github.com/joetower" title="GitHub">GitHub</a></li>
          <li><a href="https://bsky.app/profile/joetower.bsky.social" title="Bluesky Social">Bluesky</a></li>
        </ul>
      </nav>
    </div>
  </footer>
  </>
  );
}
