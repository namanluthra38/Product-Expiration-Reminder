import { Link } from 'react-router-dom';
import './hdr.css';

function Hdr() {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="/" className="nav__logo">Verfalarm</a>

        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/" className="nav__link">
                <i className="ri-arrow-right-up-line"></i>
                <span>Home</span>
              </Link>
            </li>

            <li className="nav__item">
              <Link to="/about" className="nav__link">
                <i className="ri-arrow-right-up-line"></i>
                <span>About Us</span>
              </Link>
            </li>

            <li className="nav__item">
              <Link to="/signup" className="nav__link">
                <i className="ri-arrow-right-up-line"></i>
                <span>Login / Register</span>
              </Link>
            </li>
          </ul>

          <div className="nav__close" id="nav-close">
            <i className="ri-close-large-line"></i>
          </div>
        </div>

        <div className="nav__toggle" id="nav-toggle">
          <i className="ri-menu-line"></i>
        </div>
      </nav>
    </header>
  );
}

export default Hdr;
