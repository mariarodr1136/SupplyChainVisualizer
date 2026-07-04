import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaClock, FaGlobeAmericas, FaTruck, FaChartLine, FaBell, FaArrowRight } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import HeroMap from '../components/common/HeroMap';
import './Auth.css';

const FEATURES = [
  { icon: <FaGlobeAmericas />, text: 'Live global supply chain map across all tiers' },
  { icon: <FaTruck />,         text: 'Real-time shipment tracking and delay alerts' },
  { icon: <FaChartLine />,     text: 'AI-powered demand and disruption forecasting' },
  { icon: <FaBell />,          text: 'Instant alerts before issues become crises' },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    setMessage('');
    setLoading(true);
    AuthService.loginAsGuest()
      .then((data) => { setCurrentUser(data); navigate('/'); })
      .catch((error) => {
        setLoading(false);
        setMessage(
          (error.response?.data?.message) || error.message || error.toString()
        );
      });
  };

  return (
    <div className="login-page">

      {/* ── Left panel — branding ── */}
      <div className="login-left">
        <HeroMap />
        <div className="login-left-overlay" />

        <div className="login-left-content">
          <Link to="/" className="login-back-link">← Back</Link>

          <div className="login-brand">
            <img src={logo} alt="Nexus" className="login-brand-wordmark" />
          </div>

          <div className="login-left-body">
            <h2 className="login-left-headline">
              Your entire supply chain,<br />
              <span className="login-headline-accent">in one place.</span>
            </h2>
            <p className="login-left-sub">
              From raw materials to last-mile delivery — Nexus gives you
              full visibility and the intelligence to act.
            </p>

            <ul className="login-features">
              {FEATURES.map((f) => (
                <li key={f.text} className="login-feature-item">
                  <span className="login-feature-icon">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="login-right">
        <div className="login-form-wrap">

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in to your Nexus account</p>
          </div>

          <div className="render-notice">
            <FaClock className="render-notice-icon" />
            <span>
              Hosted on Render's free tier — first login after inactivity
              may take 30–60s to wake the server.
            </span>
          </div>

          <Form className="login-form">
            {message && (
              <Alert variant="danger" className="mb-4">
                {message}
              </Alert>
            )}

            <p className="lf-demo-hint">Pre-filled demo credentials — no changes needed</p>

            <Form.Group className="lf-group">
              <Form.Label className="lf-label">Username</Form.Label>
              <Form.Control
                type="text"
                value="guest"
                readOnly
                className="lf-input lf-input--locked"
              />
            </Form.Group>

            <Form.Group className="lf-group">
              <Form.Label className="lf-label">Password</Form.Label>
              <Form.Control
                type="password"
                value="guest"
                readOnly
                className="lf-input lf-input--locked"
              />
            </Form.Group>

            <Button
              type="button"
              disabled={loading}
              className="lf-btn-demo"
              onClick={handleGuestLogin}
            >
              {loading ? 'Loading…' : <>Sign In for Free Demo <FaArrowRight className="lf-btn-arrow" /></>}
            </Button>
          </Form>
        </div>
      </div>

    </div>
  );
};

export default Login;
