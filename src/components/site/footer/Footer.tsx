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
        <a href="/" title="Home">
          <img src="/images/logo.png" alt="Logo" />
        </a>
      </div>
      <nav className="footer__nav">
        <ul>
          <li><a href="/about" title="About Us">About Us</a></li>
          <li><a href="/services" title="Services">Services</a></li>
          <li><a href="/contact" title="Contact Us">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </footer>
  </>
  );
}
