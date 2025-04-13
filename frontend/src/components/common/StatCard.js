import React from 'react';
import { Card } from 'react-bootstrap';
import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card className={`stat-card border-${color || 'primary'} mb-4`}>
      <Card.Body className="d-flex align-items-center">
        {icon && <div className={`stat-icon text-${color || 'primary'}`}>{icon}</div>}
        <div className="stat-content">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;