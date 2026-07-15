import React from 'react';
import './StatCard.css';

const colorMap = {
  primary: {
    iconBg: 'rgba(255, 255, 255, 0.1)',
    iconColor: '#f5f5f5',
    accentLine: 'linear-gradient(90deg, #ffffff, #9c9c9c)',
  },
  purple: {
    iconBg: 'rgba(246, 90, 36, 0.15)',
    iconColor: '#fb8a5c',
    accentLine: 'linear-gradient(90deg, #f65a24, #fb8a5c)',
  },
  info: {
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#d6d6d6',
    accentLine: 'linear-gradient(90deg, #d4d4d4, #8a8a8a)',
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
