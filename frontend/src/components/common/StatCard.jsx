import React from 'react';
import './StatCard.css';

const colorMap = {
  primary: {
    iconBg: 'rgba(99, 102, 241, 0.15)',
    iconColor: '#818cf8',
    accentLine: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
  },
  info: {
    iconBg: 'rgba(14, 165, 233, 0.15)',
    iconColor: '#38bdf8',
    accentLine: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
  },
  success: {
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#34d399',
    accentLine: 'linear-gradient(90deg, #10b981, #34d399)',
  },
  danger: {
    iconBg: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#f87171',
    accentLine: 'linear-gradient(90deg, #ef4444, #f87171)',
  },
  warning: {
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#fbbf24',
    accentLine: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
  },
};

const StatCard = ({ title, value, icon, color }) => {
  const theme = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div className="stat-card-accent" style={{ background: theme.accentLine }} />
      <div className="stat-card-body">
        <div className="stat-card-top">
          {icon && (
            <div
              className="stat-icon-pill"
              style={{ background: theme.iconBg, color: theme.iconColor }}
            >
              {React.cloneElement(icon, { size: 17 })}
            </div>
          )}
        </div>
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;
