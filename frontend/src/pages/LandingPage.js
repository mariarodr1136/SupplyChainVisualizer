import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGlobeAmericas,
  FaExclamationTriangle,
  FaTruck,
  FaChartLine,
  FaBell,
  FaBoxes,
  FaArrowRight,
  FaCheckCircle,
} from 'react-icons/fa';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import HeroMap from '../components/common/HeroMap';
import './LandingPage.css';

const FEATURES = [
  {
    icon: <FaGlobeAmericas />,
    color: 'indigo',
    title: 'Interactive Supply Chain Map',
    desc: 'Visualize every supplier, warehouse, and distribution node on a live global map. Understand your network at a glance.',
  },
  {
    icon: <FaExclamationTriangle />,
    color: 'amber',
    title: 'Risk Detection',
    desc: 'Surface vulnerabilities across your supply chain before they escalate. Monitor supplier health and flag anomalies in real time.',
  },
  {
    icon: <FaTruck />,
    color: 'sky',
    title: 'Shipment Tracking',
    desc: 'Follow every shipment from origin to destination with live status updates, delay alerts, and carrier-level detail.',
  },
  {
    icon: <FaChartLine />,
    color: 'emerald',
    title: 'AI-Powered Forecasting',
    desc: 'Predict demand shifts and disruption risks with machine-learning models trained on your historical supply data.',
  },
  {
    icon: <FaBell />,
    color: 'rose',
    title: 'Live Alerts',
    desc: 'Instant notifications for stockouts, late shipments, threshold breaches, and supplier incidents — before they become crises.',
  },
  {
    icon: <FaBoxes />,
    color: 'purple',
    title: 'Inventory Intelligence',
    desc: 'Track stock levels, reorder points, and turnover across all locations from a single unified inventory dashboard.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Map Your Network',
    desc: 'Connect your suppliers, warehouses, and distribution centres. Nexus builds a live graph of your entire supply chain.',
  },
  {
    num: '02',
    title: 'Monitor in Real Time',
    desc: 'Track shipments, inventory levels, and node health continuously. Alerts fire the moment something looks off.',
  },
  {
    num: '03',
    title: 'Act With Confidence',
    desc: 'Use AI forecasts and analytics to make proactive decisions — reroute shipments, rebalance stock, mitigate risk.',
  },
];

const STATS = [
  { value: '360°', label: 'Supply Chain Visibility' },
  { value: 'Real-time', label: 'Alerts & Monitoring' },
  { value: 'AI', label: 'Demand Forecasting' },
  { value: 'Multi-tier', label: 'Supplier Mapping' },
];

export default function LandingPage() {
  const [guestLoading, setGuestLoading] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuest = () => {
    setGuestLoading(true);
    AuthService.loginAsGuest()
      .then((data) => {
        setCurrentUser(data);
        navigate('/');
      })
      .catch(() => setGuestLoading(false));
  };

  return (
    <div className="landing-wrapper">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <img src={logo} alt="Nexus" className="landing-nav-logo" />
          </div>
          <Link to="/login" className="landing-nav-login">
            Sign In <FaArrowRight className="landing-nav-arrow" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <HeroMap />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <div className="landing-badge">Supply Chain Intelligence Platform</div>
          <h1 className="landing-h1">
            Full Visibility Into<br />
            <span className="landing-h1-accent">Your Supply Chain</span>
          </h1>
          <p className="landing-hero-sub">
            Nexus gives you a real-time view of every node, shipment, and risk across
            your entire supply network — so you can act before disruptions happen.
          </p>
          <div className="landing-hero-ctas">
            <Link to="/login" className="btn-lp-primary">
              Get Started <FaArrowRight />
            </Link>
          </div>
          <div className="landing-hero-proof">
            {['No credit card required', 'Free to explore', 'Full platform access'].map((t) => (
              <span key={t} className="landing-proof-item">
                <FaCheckCircle className="proof-check" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="landing-stats-bar">
        {STATS.map((s) => (
          <div key={s.label} className="landing-stat">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── How It Works ── */}
      <section className="landing-section landing-how">
        <div className="landing-section-inner">
          <span className="section-eyebrow">HOW IT WORKS</span>
          <h2 className="section-h2">One Platform. Your Entire Supply Chain.</h2>
          <p className="section-sub">
            Nexus connects every layer of your supply network into a single, actionable view.
          </p>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section landing-features">
        <div className="landing-section-inner">
          <span className="section-eyebrow">CAPABILITIES</span>
          <h2 className="section-h2">Everything You Need to Stay Ahead</h2>
          <p className="section-sub">
            Built for supply chain teams who need more than just a dashboard.
          </p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className={`feature-card feature-card--${f.color}`}>
                <div className={`feature-icon feature-icon--${f.color}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta-section">
        <div className="landing-cta-inner">
          <div className="landing-cta-glow" />
          <h2 className="landing-cta-h2">Ready to take control of your supply chain?</h2>
          <p className="landing-cta-sub">
            Start with a free account and get full access to your supply chain platform — no setup required.
          </p>
          <div className="landing-cta-btns">
            <Link to="/login" className="btn-lp-primary btn-lp-primary--lg">
              Get Started <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img src={logo} alt="Nexus" className="footer-logo" />
          </div>
          <p className="footer-copy">© 2025 Nexus. Built for supply chain professionals.</p>
        </div>
      </footer>
    </div>
  );
}
