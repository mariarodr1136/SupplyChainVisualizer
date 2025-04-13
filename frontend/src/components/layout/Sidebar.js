import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaHome, 
  FaMapMarkedAlt, 
  FaBoxes, 
  FaTruck, 
  FaNetworkWired,
  FaLink,
  FaShoppingCart
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FaHome /> },
    { path: '/map', name: 'Supply Chain Map', icon: <FaMapMarkedAlt /> },
    { path: '/inventory', name: 'Inventory', icon: <FaBoxes /> },
    { path: '/shipments', name: 'Shipment Tracker', icon: <FaTruck /> },
    { path: '/nodes', name: 'Nodes', icon: <FaNetworkWired />, admin: true },
    { path: '/connections', name: 'Connections', icon: <FaLink />, admin: true },
    { path: '/products', name: 'Products', icon: <FaShoppingCart />, admin: true }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            (!item.admin || isAdmin) && (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.icon} <span>{item.name}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;