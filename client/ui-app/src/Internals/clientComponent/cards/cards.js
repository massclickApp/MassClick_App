import React from 'react';
import { Link } from 'react-router-dom';
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
    return (
        <Link to={to} className="card-link">
            <div className="base-card" {...props}>
                <div className="card-image-container">
                    <img
                        src={imageSrc}
                        alt={`${title} thumbnail`}
                        className="card-image"
                    />
                </div>

                <div className="card-content">
                    <div className="card-meta">
                        <span className="rating-badge">{rating}</span>
                        <span style={{ marginRight: '10px' }}>{reviews} Ratings</span>
                        <h2 className="card-title" style={{ marginLeft: '10px' }}>
                            {title}
                        </h2>
                    </div>

                    <p className="card-address" style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>
                        {address}
                    </p>

                    <p className="card-details" style={{ fontSize: '14px', color: '#333', margin: '0 0 15px 0', fontWeight: 'bold' }}>
                        {details}
                    </p>

                    <div className="card-actions">
                        <button
                            className="card-action-button phone-button"
                            onClick={(e) => {
                                e.preventDefault(); // prevent Link navigation
                                window.location.href = `tel:${phone}`;
                            }}
                        >
                            <i className="fa fa-phone" style={{ marginRight: '5px' }}></i> {phone}
                        </button>

                        <button
                            className="card-action-button whatsapp-button"
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://wa.me/${whatsapp}`, '_blank');
                            }}
                        >
                            <i className="fa fa-whatsapp" style={{ marginRight: '5px' }}></i> WhatsApp
                        </button>

                        <button
                            className="card-action-button enquiry-button"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Enquiry form will open!");
                            }}
                        >
                            Send Enquiry
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Cards;