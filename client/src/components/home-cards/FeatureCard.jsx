import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ icon, title, desc, className = '' }) => {
  return (
    <div className={`feature-card ${className}`}>
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{desc}</p>
    </div>
  );
};

export default FeatureCard;