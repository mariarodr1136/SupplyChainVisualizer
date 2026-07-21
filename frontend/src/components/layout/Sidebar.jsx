import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  FaHome,
  FaMapMarkedAlt,
  FaBoxes,
  FaTruck,
  FaNetworkWired,
  FaLink,
  FaShoppingCart,
  FaChartLine,
  FaChartBar,
  FaBell,
  FaClipboardList,
  FaIndustry,
  FaFileExport,
  FaHistory,
  FaCog
} from 'react-icons/fa';
import './Sidebar.css';

const sections = [
  {
    label: 'Overview',
    items: [
      { path: '/', name: 'Dashboard', icon: <FaHome /> },
      { path: '/map', name: 'Supply Chain Map', icon: <FaMapMarkedAlt /> },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/analytics', name: 'Analytics', icon: <FaChartLine /> },
      { path: '/forecasting', name: 'Forecasting', icon: <FaChartBar /> },
      { path: '/alerts', name: 'Live Alerts', icon: <FaBell /> },
      { path: '/reports', name: 'Reports', icon: <FaFileExport /> },
      { path: '/audit-log', name: 'Audit Log', icon: <FaHistory /> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/orders', name: 'Orders', icon: <FaClipboardList /> },
      { path: '/inventory', name: 'Inventory', icon: <FaBoxes /> },
      { path: '/shipments', name: 'Shipment Tracker', icon: <FaTruck /> },
    ],
  },
  {
    label: 'Network',
    items: [
      { path: '/nodes', name: 'Nodes', icon: <FaNetworkWired />, admin: true },
      { path: '/connections', name: 'Connections', icon: <FaLink /> },
      { path: '/products', name: 'Products', icon: <FaShoppingCart />, admin: true },
      { path: '/suppliers', name: 'Suppliers', icon: <FaIndustry /> },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/settings', name: 'Settings', icon: <FaCog /> },
    ],
  },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
  const initials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : '??';
  const roleLabel = isAdmin ? 'Admin' : currentUser?.isGuest ? 'Guest' : 'Member';

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

      <nav className="sidebar-menu">
        {sections.map((section) => {
          const visibleItems = section.items.filter(item => !item.admin || isAdmin);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <span className="sidebar-section-label">{section.label}</span>
              <ul>
                {visibleItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? 'active' : ''}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <div className="sidebar-footer-avatar">{initials}</div>
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-name">{currentUser?.username}</div>
            <div className="sidebar-footer-role">{roleLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
