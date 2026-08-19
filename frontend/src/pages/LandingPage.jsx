import { Link } from 'react-router-dom';
import {
  FaGlobeAmericas,
  FaExclamationTriangle,
  FaTruck,
  FaChartLine,
  FaBell,
  FaBoxes,
  FaArrowRight,
  FaCheckCircle,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import dashboardLight from '../assets/screens/dashboard-light.png';
import dashboardDark from '../assets/screens/dashboard-dark.png';
import mapLight from '../assets/screens/map-light.png';
import mapDark from '../assets/screens/map-dark.png';
import shipmentsLight from '../assets/screens/shipments-light.png';
import shipmentsDark from '../assets/screens/shipments-dark.png';
import analyticsLight from '../assets/screens/analytics-light.png';
import analyticsDark from '../assets/screens/analytics-dark.png';
import './LandingPage.css';

/* Each product shot exists in both themes so the framed screenshots match
   the page around them. Regenerate with scripts/capture-screens.mjs. */
const SHOTS = {
  dashboard: { light: dashboardLight, dark: dashboardDark },
  map: { light: mapLight, dark: mapDark },
  shipments: { light: shipmentsLight, dark: shipmentsDark },
  analytics: { light: analyticsLight, dark: analyticsDark },
};

const SURFACES = [
  {
    title: 'Dashboard',
    desc: 'Every shipment, stock level, and alert on one live overview.',
    linkLabel: 'Open the dashboard',
    shot: 'dashboard',
    alt: 'Nexus dashboard with shipment status and trend charts',
  },
  {
    title: 'Supply Chain Map',
    desc: 'Your whole network on a live world map — nodes, routes, and delays.',
    linkLabel: 'Explore the map',
    shot: 'map',
    alt: 'Live supply chain map with routes and facility markers',
  },
  {
    title: 'Shipment Tracker',
    desc: 'Follow every shipment door to door with live status and progress.',
    linkLabel: 'Track shipments',
    shot: 'shipments',
    alt: 'Shipment tracker table with statuses and progress bars',
  },
  {
    title: 'Analytics',
    desc: 'Delivery performance, SLAs, and seasonality — measured, not guessed.',
    linkLabel: 'See analytics',
    shot: 'analytics',
    alt: 'Analytics page with KPI cards',
  },
];

const FEATURES = [
  {
    icon: <FaGlobeAmericas />,
    title: 'Interactive Supply Chain Map',
    desc: 'Visualize every supplier, warehouse, and distribution node on a live global map.',
  },
  {
    icon: <FaExclamationTriangle />,
    title: 'Risk Detection',
    desc: 'Surface vulnerabilities before they escalate. Monitor supplier health and flag anomalies in real time.',
  },
  {
    icon: <FaTruck />,
    title: 'Shipment Tracking',
    desc: 'Follow every shipment from origin to destination with live status updates and delay alerts.',
  },
  {
    icon: <FaChartLine />,
    title: 'AI-Powered Forecasting',
    desc: 'Predict demand shifts and disruption risks with models trained on your historical supply data.',
  },
  {
    icon: <FaBell />,
    title: 'Live Alerts',
    desc: 'Instant notifications for stockouts, late shipments, and threshold breaches — before they become crises.',
  },
  {
    icon: <FaBoxes />,
    title: 'Inventory Intelligence',
    desc: 'Track stock levels, reorder points, and turnover across all locations from one place.',
  },
];

const STATS = [
  { value: '360°', label: 'Supply Chain Visibility' },
  { value: 'Real-time', label: 'Alerts & Monitoring' },
  { value: 'AI', label: 'Demand Forecasting' },
  { value: 'Multi-tier', label: 'Supplier Mapping' },
];

/* Framed product shot: soft tinted mat, app window with traffic-light
   dots, image bleeding off the bottom-right. */
function ShotFrame({ shot, theme, alt, hero = false }) {
  return (
    <div className={hero ? 'shot-frame shot-frame--hero' : 'shot-frame'}>
      <div className="shot-window">
        <div className="shot-dots">
          <span /><span /><span />
        </div>
        <img src={SHOTS[shot][theme]} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="landing-wrapper">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <img src={logo} alt="Nexus" className="landing-nav-logo" />
          </div>
          <div className="landing-nav-right">
            <button
              className="landing-nav-theme"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
            <Link to="/login" className="landing-nav-signin">Sign in</Link>
            <Link to="/login" className="landing-nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Live supply chain intelligence
            </div>
            <h1 className="landing-h1">
              Full visibility into your supply chain.
              <span className="landing-h1-dim landing-h1-line2">Every node, shipment, and risk — live.</span>
            </h1>
            <p className="landing-hero-sub">
              Nexus connects your suppliers, warehouses, and shipments into one
              real-time view, so you can act before disruptions happen.
            </p>
            <div className="landing-hero-ctas">
              <Link to="/login" className="btn-lp-primary">
                Get Started — Explore the Live Demo <FaArrowRight />
              </Link>
            </div>
            <div className="hero-trust">
              <FaCheckCircle /> No signup required — jump straight into the live guest demo
            </div>
          </div>

          <div className="hero-float-cards" aria-hidden="true">
            <div className="hero-float-card hero-float-card--alert">
              <div className="hero-float-card-row">
                <span className="hero-float-dot hero-float-dot--warn" />
                <span className="hero-float-label">Risk Alert</span>
              </div>
              <p className="hero-float-title">Warehouse 3 — low stock on 4 SKUs</p>
              <span className="hero-float-meta">2 min ago</span>
            </div>
            <div className="hero-float-card hero-float-card--shipment">
              <div className="hero-float-card-row">
                <span className="hero-float-dot hero-float-dot--ok" />
                <span className="hero-float-label">Shipment #4821</span>
              </div>
              <p className="hero-float-title">Rotterdam → Chicago · On time</p>
              <span className="hero-float-meta">Live tracking</span>
            </div>
          </div>
        </div>
        <div className="landing-container">
          <ShotFrame shot="dashboard" theme={theme} alt="The Nexus dashboard" hero />
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

      {/* ── Product surfaces (Cursor-style cards) ── */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="section-title">
            Everything in one place.
            <span className="section-title-dim"> One platform across your whole network.</span>
          </h2>
          <div className="surfaces-grid">
            {SURFACES.map((s) => (
              <div key={s.title} className="surface-card">
                <h3 className="surface-title">{s.title}</h3>
                <p className="surface-desc">{s.desc}</p>
                <Link to="/login" className="lp-link surface-link">
                  {s.linkLabel} <FaArrowRight className="lp-link-arrow" />
                </Link>
                <ShotFrame shot={s.shot} theme={theme} alt={s.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section landing-section--tight-top">
        <div className="landing-container">
          <div className="section-divider" />
          <h2 className="section-title">
            Built to stay ahead.
            <span className="section-title-dim"> More than just a dashboard.</span>
          </h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta-section">
        <h2 className="landing-cta-h2">Get started with Nexus.</h2>
        <Link to="/login" className="btn-lp-primary btn-lp-primary--lg">
          Explore the Live Demo <FaArrowRight />
        </Link>
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
