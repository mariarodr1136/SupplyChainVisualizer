import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'leaflet/dist/leaflet.css';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SupplyChainMap from './pages/SupplyChainMap';
import Analytics from './pages/Analytics';
import Forecasting from './pages/Forecasting';
import LiveAlerts from './pages/LiveAlerts';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import ShipmentTracker from './pages/ShipmentTracker';
import Nodes from './pages/Nodes';
import NodeDetails from './pages/NodeDetails';
import Connections from './pages/Connections';
import Products from './pages/Products';
// Authentication services and context
import AuthService from './services/auth.service';
import { AuthContext } from './context/AuthContext';

function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser() || undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <div className="app-container">
          {currentUser ? (
            <>
              <Header toggleSidebar={toggleSidebar} logOut={logOut} />
              <div className="content-container">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
                  {currentUser?.isGuest && (
                    <div className="guest-banner" role="status">
                      Guest Mode
                    </div>
                  )}
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/map" element={<SupplyChainMap />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/forecasting" element={<Forecasting />} />
                    <Route path="/alerts" element={<LiveAlerts />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/shipments" element={<ShipmentTracker />} />
                    <Route path="/nodes" element={<Nodes />} />
                    <Route path="/nodes/:id" element={<NodeDetails />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
