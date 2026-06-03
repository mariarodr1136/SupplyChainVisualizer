import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar, logOut }) => {
  const { currentUser } = useContext(AuthContext);

  const initials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <Navbar expand="lg" className="header">
      <Container fluid className="px-0">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </button>
        <Navbar.Brand as={Link} to="/">
          Supply Chain Visualizer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-nav" />
        <Navbar.Collapse id="header-nav" className="justify-content-end">
          <Nav>
            {currentUser && (
              <NavDropdown
                title={
                  <span className="header-user-chip">
                    <span className="header-avatar">{initials}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                      {currentUser.username}
                    </span>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={logOut}>
                  <FaSignOutAlt className="me-2" /> Sign out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
