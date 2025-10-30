import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./cards.css";

// ✅ Import Material UI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import ReviewsIcon from "@mui/icons-material/Reviews";

const Cards = ({
  imageSrc,
  title,
  rating,
  reviews,
  address,
  details,
  phone,
  whatsapp,
  category,
  to,
  ...props
}) => {
  const handlePhoneClick = (e) => {
    e.preventDefault();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${whatsapp}`, "_blank");
  };

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    alert("Enquiry form will open!");
  };

  const safeRating =
    typeof rating === "object"
      ? Array.isArray(rating)
        ? rating.length
        : 0
      : rating || 0;

  const safeReviews =
    typeof reviews === "object"
      ? Array.isArray(reviews)
        ? reviews.length
        : 0
      : reviews || 0;

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
          />
        </div>

        <div className="card-content">
          {/* --- Meta Info (Rating + Reviews) --- */}
          <h2 className="card-title">{title}</h2>

          <div className="card-meta">
            <div className="meta-item">
              <StarIcon style={{ color: "#FFD700", fontSize: "20px" }} />
              <span className="rating-text">{safeRating}</span>
            </div>
            <div className="meta-item">
              <ReviewsIcon style={{ color: "#0288d1", fontSize: "20px" }} />
              <span>{safeReviews} Reviews</span>
            </div>
          </div>

          {/* --- Title --- */}

          {/* --- Category --- */}
          {category && (
            <p className="card-category">
              <InfoOutlinedIcon className="icon" />
              {category}
            </p>
          )}

          {/* --- Address --- */}
          <p className="card-address">
            <LocationOnIcon className="icon" />
            {address}
          </p>

          {/* --- Details --- */}
          <p className="card-details">
            <InfoOutlinedIcon className="icon" />
            {details}
          </p>

          {/* --- Buttons --- */}
          <div className="card-actions">
            <button
              className="card-action-button phone-button"
              onClick={handlePhoneClick}
            >
              <PhoneIcon />
              Call
            </button>

            <button
              className="card-action-button whatsapp-button"
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon />
              Chat
            </button>

            <button
              className="card-action-button enquiry-button"
              onClick={handleEnquiryClick}
            >
              <SendIcon />
              Enquiry
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Cards;
