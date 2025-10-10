import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './cards.css';

const Cards = ({
  imageSrc,
  title,
  rating,
  reviews,
  address,
  details,
  phone,
  whatsapp,
  to,
  ...props
}) => {
  const handlePhoneClick = (e) => {
    e.preventDefault();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    alert('Enquiry form will open!');
  };

  const safeRating =
    typeof rating === 'object' ? (Array.isArray(rating) ? rating.length : 0) : rating || 0;
  const safeReviews =
    typeof reviews === 'object' ? (Array.isArray(reviews) ? reviews.length : 0) : reviews || 0;

  return (
    <Link to={to} className="card-link">
      <div className="base-card" {...props}>
        <div className="card-image-container">
          <LazyLoadImage
            src={imageSrc}
            alt={`${title} thumbnail`}
            className="card-image"
            effect="blur"
            placeholderSrc="https://via.placeholder.com/120x100?text=Loading..."
            width="100%"
            height="auto"
          />
        </div>

        <div className="card-content">
          <div className="card-meta">
            <span className="rating-badge">{safeRating}</span>
            <span style={{ marginRight: '10px' }}>{safeReviews} Ratings</span>
            <h2 className="card-title" style={{ marginLeft: '10px' }}>
              {title}
            </h2>
          </div>

          <p
            className="card-address"
            style={{
              fontSize: '14px',
              color: '#570202ff',
              margin: '0 0 5px 0',
            }}
          >
            {address}
          </p>

          <p
            className="card-details"
            style={{
              fontSize: '14px',
              color: '#333',
              margin: '0 0 15px 0',
              fontWeight: 'bold',
            }}
          >
            {details}
          </p>

          <div className="card-actions">
            <button className="card-action-button phone-button" onClick={handlePhoneClick}>
              <i className="fa fa-phone" style={{ marginRight: '5px' }}></i> {phone}
            </button>

            <button className="card-action-button whatsapp-button" onClick={handleWhatsAppClick}>
              <i className="fa fa-whatsapp" style={{ marginRight: '5px' }}></i> WhatsApp
            </button>

            <button className="card-action-button enquiry-button" onClick={handleEnquiryClick}>
              Send Enquiry
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Cards;
