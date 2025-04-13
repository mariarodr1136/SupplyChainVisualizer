import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar, logOut }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header">
      <Container fluid>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Navbar.Brand as={Link} to="/">Supply Chain Visualizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {currentUser && (
              <NavDropdown 
                title={
                  <span>
                    <FaUser className="me-1" />
                    {currentUser.username}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" /> Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logOut}>
                  <FaSignOutAlt className="me-2" /> Logout
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