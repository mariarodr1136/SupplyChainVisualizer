import React from 'react';
import './StatCard.css';

/* Tag colours, driven by tokens so both themes are covered.
   The class picks the pair; nothing here is a literal colour. */
const colorClassMap = {
  primary: 'stat-card--gray',
  purple: 'stat-card--purple',
  info: 'stat-card--blue',
  success: 'stat-card--green',
  danger: 'stat-card--red',
  warning: 'stat-card--yellow',
};

const StatCard = ({ title, value, icon, color }) => {
  const toneClass = colorClassMap[color] || colorClassMap.primary;

  return (
    <div className={`stat-card ${toneClass}`}>
      <div className="stat-card-body">
        <div className="stat-card-text">
          <div className="stat-label">{title}</div>
          <div className="stat-value">{value ?? '—'}</div>
        </div>
        {icon && (
          <div className="stat-icon-pill">
            {React.cloneElement(icon, { size: 15 })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
