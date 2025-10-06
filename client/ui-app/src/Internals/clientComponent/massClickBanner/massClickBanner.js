import React from 'react';
import './MassClickBanner.css'; 

const MassClickBanner = () => {
  return (
    <div className="massclick-banner-container">
      <div className="massclick-shape-top-right"></div>
      <div className="massclick-shape-bottom-center"></div>

      <div className="massclick-content">
        <div className="massclick-logo-section">
          <div className="massclick-logo">
            <span className="massclick-text-mass">Mass</span>
            <span className="massclick-text-mass">Click</span>
            <sup className="massclick-trademark">™</sup>
          </div>
          <p className="massclick-tagline">India's Leading Local Search Engine</p>

          <h2 className="massclick-headline">Your One-Stop Destination for Local Business Listing</h2>
        </div>

        <div className="massclick-cta-section">
          <p className="massclick-cta-text">
            List Your Business on <strong className="massclick-cta-brand">MassClick</strong> today
          </p>

          <div className="massclick-price-button">
            at <span className="massclick-price-amount">₹ 2500 /-</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassClickBanner;
