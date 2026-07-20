import { useContext, useState, useRef, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = ({ toggleSidebar, logOut }) => {
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : '??';

  const isGuest = currentUser?.isGuest;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = () => {
    setMenuOpen(false);
    logOut();
  };

  return (
    <Navbar expand="lg" className="header">
      <Container fluid className="px-0">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </button>

        <Navbar.Brand as={Link} to="/" className="header-brand">
          <img src={logo} alt="Nexus logo" className="header-brand-logo" />
          <span className="header-brand-sub">Supply Chain Visualizer</span>
        </Navbar.Brand>

        <div className="header-right" ref={menuRef}>
          {currentUser && (
            <>
              <button
                className={`header-user-btn ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(v => !v)}
                aria-label="User menu"
              >
                <span className="header-avatar">{initials}</span>
                <span className="header-username">
                  {isGuest ? 'Guest' : currentUser.username}
                </span>
                <FaChevronDown className={`header-chevron ${menuOpen ? 'rotated' : ''}`} />
              </button>

              {menuOpen && (
                <div className="header-dropdown">
                  <div className="header-dropdown-profile">
                    <span className="header-dropdown-avatar">{initials}</span>
                    <div className="header-dropdown-info">
                      <span className="header-dropdown-name">
                        {isGuest ? 'Guest User' : currentUser.username}
                      </span>
                      <span className="header-dropdown-role">
                        {isGuest ? 'View-only access' : 'Supply Chain Platform'}
                      </span>
                    </div>
                  </div>

                  <div className="header-dropdown-divider" />

                  <button className="header-dropdown-item header-dropdown-signout" onClick={handleSignOut}>
                    <FaSignOutAlt />
                    Sign out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
