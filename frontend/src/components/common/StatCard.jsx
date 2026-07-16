import React from 'react';
import './StatCard.css';

const colorMap = {
  primary: {
    iconBg: '#3a3733',
    iconColor: '#f5f5f5',
    accentLine: '#9c9c9c',
  },
  purple: {
    iconBg: '#472c1e',
    iconColor: '#fb8a5c',
    accentLine: '#f65a24',
  },
  info: {
    iconBg: '#3a3733',
    iconColor: '#d6d6d6',
    accentLine: '#8a8a8a',
  },
  success: {
    iconBg: '#1e3d33',
    iconColor: '#34d399',
    accentLine: '#10b981',
  },
  danger: {
    iconBg: '#432323',
    iconColor: '#f87171',
    accentLine: '#ef4444',
  },
  warning: {
    iconBg: '#40331b',
    iconColor: '#fbbf24',
    accentLine: '#f59e0b',
  },
};

const StatCard = ({ title, value, icon, color }) => {
  const theme = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div className="stat-card-accent" style={{ background: theme.accentLine }} />
      <div className="stat-card-body">
        <div className="stat-card-text">
          <div className="stat-value">{value ?? '—'}</div>
          <div className="stat-label">{title}</div>
        </div>
        {icon && (
          <div
            className="stat-icon-pill"
            style={{ background: theme.iconBg, color: theme.iconColor }}
          >
            {React.cloneElement(icon, { size: 17 })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
