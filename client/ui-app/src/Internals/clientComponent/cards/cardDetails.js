import React, { useEffect, useState, useRef } from "react"; // <-- Import useRef
import { useParams, useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList, getAllClientBusinessList } from "../../../redux/actions/businessListAction";
import './cardDetails.css';
import UserRatingWidget from "../rating/rating";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";

// IMPORTED ICONS
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpaIcon from '@mui/icons-material/Spa';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsIcon from '@mui/icons-material/Directions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import EmailIcon from '@mui/icons-material/Email';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';
import Tooltip from '@mui/material/Tooltip';

import Footer from "../footer/footer.js";
import { getAllLocation } from "../../../redux/actions/locationAction.js";

const SimpleModal = ({ children, onClose, title }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <CloseIcon className="modal-close-btn" onClick={onClose} />
            </div>
            <div className="modal-body">
                {children}
            </div>
        </div>
    </div>
);



const FullScreenGallery = ({ images, initialIndex, onClose }) => {
    const [index, setIndex] = useState(initialIndex);

    useEffect(() => {
        setIndex(initialIndex);
    }, [initialIndex]);

    const currentImageSrc = images[index];

    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="full-gallery-overlay" onClick={onClose}>
            <div className="full-gallery-content" onClick={e => e.stopPropagation()}>
                <CloseIcon className="gallery-close-btn" onClick={onClose} />
                <div className="gallery-header">
                    <p className="slide-count">{index + 1}/{images.length}</p>
                </div>

                <div className="gallery-main-display">
                    <button className="gallery-nav-btn prev" onClick={prevSlide}>{'<'}</button>
                    <img
                        src={currentImageSrc || "https://via.placeholder.com/600x400?text=Media"}
                        alt={`Business Media ${index + 1}`}
                        className="gallery-image"
                    />
                    <button className="gallery-nav-btn next" onClick={nextSlide}>{'>'}</button>
                </div>
            </div>
        </div>
    );
};


const BusinessDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { clientBusinessList = [] } = useSelector((state) => state.businessListReducer || {});
    const { location = [], loading, error } = useSelector(
        (state) => state.locationReducer || {}
    );
    const [mainImage, setMainImage] = useState(null);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showFullHours, setShowFullHours] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [reviewLimit, setReviewLimit] = useState(3);
    const overviewRef = useRef(null);
    const quickInfoRef = useRef(null);
    const servicesRef = useRef(null); 
    const photosRef = useRef(null);
    const reviewsRef = useRef(null);
    useEffect(() => {
        dispatch(getAllClientBusinessList());
        dispatch(getAllLocation())
    }, [dispatch]);

    const business = clientBusinessList.find((b) => b._id === id);

    if (!business) {
        return <div className="page-wrapper"><p>No business found for this ID.</p></div>;
    }

    const galleryImageSrcs = business.businessImages || [];
    const firstImage = business.bannerImage || galleryImageSrcs[0] || null;
    const bannerImageSrc = mainImage || firstImage;
    const restaurantOptions = business.restaurantOptions;
    const website = business.website
    const fullAddress = `${business.plotNumber}, ${business.street}, ${business.location}`;

    const displayedAverageRating = business.averageRating?.toFixed(1) || 0;
    const totalRatings = business?.reviews?.length || 0;


    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getTodayHours = () => {
        if (!business.openingHours || business.openingHours.length === 0) return "Open hours not available";
        const todayIndex = new Date().getDay();
        const todayName = daysOfWeek[todayIndex];
        const todayHour = business.openingHours.find(hour => hour.day === todayName);
        if (!todayHour) return "Open hours not available";
        return todayHour.isClosed ? "Closed today" : `${todayHour.open} - ${todayHour.close}`;
    };

    const getCollapsedHoursSummary = () => {
        if (!business.openingHours || business.openingHours.length === 0) return "Open hours not available";
        const openDays = business.openingHours.filter(hour => !hour.isClosed && hour.open && hour.close);
        const summary = openDays.slice(0, 2)
            .map(h => `${h.day.substring(0, 3)}: ${h.open} - ${h.close}`)
            .join(', ');
        return summary.length > 0 ? summary : getTodayHours();
    };

    const getFullHoursList = () => {
        if (!business.openingHours) return [];
        return business.openingHours.slice()
            .sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));
    };

    const quickFacts = [
        fullAddress,
        getTodayHours(),
        `${business.experience} Years in Business`,
        restaurantOptions
    ];

    const getMapLink = (iframeString) => {
        if (!iframeString) return "#";
        const match = iframeString.match(/src="([^"]+)"/);
        return match ? match[1] : "#";
    };

    const handleCopyAddress = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullAddress)
                .then(() => {
                    alert("Address copied to clipboard!");
                })
                .catch(err => {
                    console.error("Failed to copy: ", err);
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = fullAddress;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("Address copied to clipboard!");
        }
    };

    const handleCopyLink = (e) => {
        e.preventDefault();
        const linkToCopy = window.location.href;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(linkToCopy)
                .then(() => {
                    alert("Link copied to clipboard!");
                    setShowShareOptions(false); 
                })
                .catch(err => {
                    console.error("Failed to copy link: ", err);
                });
        } else {
            alert("Copy failed. Browser does not support automatic copy.");
        }
    }

    const getQuickFactIcon = (index) => {
        switch (index) {
            case 0: return <LocationOnIcon />;
            case 1: return <AccessTimeIcon />;
            case 3: return <SpaIcon />;
            default: return null;
        }
    };

    const getGoogleMapSrc = (iframeString) => {
        if (!iframeString) return null;
        const match = iframeString.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    };

    const handleShowNumberClick = (e) => {
        e.preventDefault();
        setShowContactModal(true);
    };

    const handleCopyContact = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(business.contact)
                .then(() => {
                    alert("Phone number copied to clipboard!");
                    setShowContactModal(false);
                })
                .catch(err => {
                    console.error("Failed to copy phone number: ", err);
                    alert("Failed to copy number. Please copy it manually.");
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = business.contact;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("Phone number copied to clipboard!");
            setShowContactModal(false);
        }
    }
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        const refMap = { 'Overview': overviewRef, 'Quick Info': quickInfoRef, 'Services': servicesRef, 'Photos': photosRef, 'Reviews': reviewsRef };
        const ref = refMap[tabName];
        if (ref?.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const handleRateClick = (e) => {
        if (e) {
            e.stopPropagation();
        }
        handleTabClick('Reviews');
    };
    const handleViewMoreReviews = () => {
        setReviewLimit(prevLimit => prevLimit + 3);
    };
    const currentUrl = encodeURIComponent(window.location.href);
    const currentTitle = encodeURIComponent(`Check out ${business.businessName}`);

    const allReviews = business.reviews || [];
    const reviewsToDisplay = allReviews.slice(0, reviewLimit);
    const hasMoreReviews = allReviews.length > reviewLimit;
    const OverView = business.businessDetails

    return (
        <>
            <CardsSearch /><br /><br /><br />
            <div className="page-wrapper">
                <div className="image-gallery">

                    <div className="image-gallery">
                        {galleryImageSrcs.map((src, index) => (
                            <img
                                key={index}
                                src={src || "https://via.placeholder.com/80x80?text=No+Image"}
                                alt={`${business.businessName} ${index + 1}`}
                                className="thumbnail-image"
                                onClick={() => {
                                    setMainImage(src); // Keep existing behavior: update banner image
                                    setCurrentSlideIndex(index); // Set the starting slide
                                    setShowFullGallery(true); // Open the full gallery
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="main-content-grid">
                    {/* Left Column */}
                    <div className="left-column">
                        <div className="business-header">
                            <h1 className="business-name">{business.businessName}</h1>
                            <div className="rating-row">
                                <span className="rating-badge">{displayedAverageRating} ★</span>
                                <span className="rating-text">{totalRatings} ratings • <a href="#">Claim this business</a></span>
                            </div>
                            <div className="quick-facts-row">
                                {quickFacts.map((fact, index) => (
                                    <span key={index} className="quick-fact-item">
                                        {getQuickFactIcon(index)}
                                        {fact}
                                    </span>
                                ))}
                            </div>
                            <div className="action-buttons-container">
                                <div className="action-group-left">
                                    <button
                                        onClick={handleShowNumberClick}
                                        className="btn btn-primary"
                                    >
                                        <PhoneIcon style={{ fontSize: '20px' }} /> Show Number
                                    </button>

                                    <a href={`https://wa.me/${business.whatsappNumber}?text=${currentTitle}%20${currentUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                                        <WhatsAppIcon style={{ fontSize: '20px' }} /> WhatsApp
                                    </a>

                                    <span className="icon-btn" title="Edit Business Info"><EditIcon style={{ fontSize: '20px' }} /></span>

                                    <span
                                        className="icon-btn share-icon-container"
                                        title="Share"
                                        onClick={() => setShowShareOptions(!showShareOptions)}
                                    >
                                        <ShareIcon style={{ fontSize: '20px' }} />

                                        {showShareOptions && (
                                            <div className="share-options-popup">
                                                <a
                                                    href={`https://wa.me/?text=${currentTitle}%20${currentUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Share on WhatsApp"
                                                >
                                                    <WhatsAppIcon style={{ color: '#25D366' }} />
                                                </a>
                                                <a
                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Share on Facebook"
                                                >
                                                    <FacebookIcon style={{ color: '#1877F2' }} />
                                                </a>
                                                <a
                                                    href={`https://www.instagram.com/direct/inbox/?text=${currentTitle}%20${currentUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Share on Instagram (Note: Direct link sharing is limited)"
                                                >
                                                    <InstagramIcon style={{ color: '#E4405F' }} />
                                                </a>
                                                <button
                                                    onClick={handleCopyLink}
                                                    title="Copy Link"
                                                    className="copy-link-btn"
                                                >
                                                    <LinkIcon style={{ color: 'var(--color-text-medium)' }} />
                                                </button>
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <div className="rating-input-group">
                                    <Tooltip
                                        title="Click to rate this business"
                                        arrow
                                        placement="top"
                                    >
                                        <div>
                                            <UserRatingWidget
                                                businessId={business._id}
                                                initialValue={business.averageRating || 0}
                                                currentRatings={business.ratings || []}
                                            />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className="tabs-container-wrapper">
                            <div className="nav-tabs">
                                {['Overview', 'Quick Info', 'Services', 'Photos', 'Reviews'].map(tab => (
                                    <span
                                        key={tab}
                                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => handleTabClick(tab)}
                                    >
                                        {tab}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'Overview' && (
                                <div ref={overviewRef} className="overview-content-card">
                                    <h2>Overview Content</h2>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: OverView }}
                                        className="overview-text"
                                    />
                                </div>
                            )}
                            {activeTab === 'Quick Info' && (
                                <div>
                                    <h2>Quick Info Content</h2>
                                    <p>Here is Quick Info content.</p>
                                </div>
                            )}
                            {activeTab === 'Services' && (
                                <div>
                                    <h2>Services Content</h2>
                                    <p>Here are the Services details.</p>
                                </div>
                            )}
                            {activeTab === 'Photos' && (
                                <div>
                                    <h2>Photos Content</h2>
                                    <p>Here are some photos.</p>
                                </div>
                            )}
                            {activeTab === 'Reviews' && (
                                <div className="reviews-section" ref={reviewsRef}>
                                    <div className="ratings-summary-header">
                                        <h2 className="section-title">Reviews & Ratings</h2>
                                        <div className="average-rating-block">
                                            <span className="avg-score">{displayedAverageRating}</span>
                                            <span className="total-ratings">{totalRatings} Ratings</span>
                                            <p className="rating-source">MassClick rating index based on {totalRatings} ratings across the web</p>
                                        </div>
                                    </div>

                                    <div className="start-review-section">
                                        <h3 className="start-review-title">Start your Review</h3>
                                        <UserRatingWidget
                                            businessId={business._id}
                                            initialValue={business.averageRating || 0}
                                            currentRatings={business.ratings || []}
                                        />
                                    </div>

                                    <div className="rating-trend-section">
                                        <h3 className="rating-trend-title">Recent rating trend</h3>
                                        <div className="rating-trend-placeholder" style={{ height: '30px', border: '1px solid #eee', borderRadius: '4px', background: '#f9f9f9', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px' }}>
                                        </div>
                                    </div>

                                    <div className="user-reviews-list">
                                        <h3 className="reviews-list-title">User Reviews</h3>
                                        <div className="reviews-filter-tabs">
                                            <button className="filter-tab active">Relevant</button>
                                            <button className="filter-tab">Latest</button>
                                            <button className="filter-tab">High to Low</button>
                                        </div>

                                        {reviewsToDisplay.length > 0 ? (
                                            reviewsToDisplay.map((review, index) => (
                                                <div key={review._id || index} className="review-card">

                                                    <div className="review-header">
                                                        {/* 1. User Avatar and Info - Assume a generic user since userId is null */}
                                                        <img
                                                            src={review.userAvatar || "https://via.placeholder.com/40"}
                                                            alt={review.userName || 'Anonymous'}
                                                            className="user-avatar"
                                                        />
                                                        <div className="user-info">
                                                            <p className="user-name">{review.userName || 'Anonymous User'}</p>
                                                            {/* Displaying the review ID for debugging/reference */}
                                                        </div>
                                                        {/* 2. Date */}
                                                        <span className="review-date">
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                                        </span>
                                                    </div>

                                                    <div className="review-star-rating">
                                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                                            <StarIcon
                                                                key={starIndex}
                                                                style={{
                                                                    color: starIndex < review.rating ? 'orange' : 'lightgray',
                                                                    fontSize: '18px'
                                                                }}
                                                            />
                                                        ))}
                                                    </div>

                                                    <p className="review-text">
                                                        {review.ratingExperience || 'No comment provided.'}
                                                    </p>

                                                    <div className="review-advanced-info">
                                                        {review.ratingLove && review.ratingLove.length > 0 && (
                                                            <p className="advanced-detail">
                                                                **Likes:** {review.ratingLove.join(', ')}
                                                            </p>
                                                        )}
                                                        {review.ratingPhotos && review.ratingPhotos.length > 0 && (
                                                            <div className="review-photos-list">
                                                                **Photos ({review.ratingPhotos.length}):**
                                                                <span style={{ marginLeft: '5px', color: 'var(--color-primary)' }}>View Photos</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="review-actions">
                                                        <span className="action-link"><CheckCircleIcon style={{ fontSize: '16px', marginRight: '4px' }} /> Helpful (0)</span>
                                                        <span className="action-link"><NoteAltIcon style={{ fontSize: '16px', marginRight: '4px' }} /> Comment</span>
                                                        <span className="action-link"><ShareIcon style={{ fontSize: '16px', marginRight: '4px' }} /> Share</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Be the first to leave a review!</p>
                                        )}

                                        {hasMoreReviews && (
                                            <div className="view-more-container">
                                                <button onClick={handleViewMoreReviews} className="btn-view-more">
                                                    View More Reviews ({allReviews.length - reviewLimit} remaining)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>



                        {business.googleMap && (
                            <div className="map-container" style={{ marginTop: '20px' }}>
                                <iframe
                                    src={getGoogleMapSrc(business.googleMap)}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '12px', boxShadow: 'var(--shadow-subtle)' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Business Location"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="right-sidebar">
                        <div className="sidebar-contact-card">
                            <div className="contact-section">
                                <h3 className="sidebar-title">Contact</h3>
                                <div className="contact-item with-icon">
                                    <span className="icon-placeholder"><PhoneIcon style={{ color: 'var(--color-primary)' }} /></span>
                                    <a href="#" onClick={handleShowNumberClick} className="contact-link">Show Number</a>
                                </div>
                            </div>

                            <div className="address-section">
                                <h3 className="sidebar-title">Address</h3>
                                <p className="address-text">{fullAddress}</p>
                                <div className="address-actions">
                                    <a
                                        href={getMapLink(business.googleMap)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="address-action-link"
                                    >
                                        <DirectionsIcon style={{ fontSize: '16px' }} /> Get Directions
                                    </a>
                                    <a
                                        href="#"
                                        className="address-action-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCopyAddress();
                                        }}
                                    >
                                        <ContentCopyIcon style={{ fontSize: '16px' }} /> Copy
                                    </a>
                                </div>
                            </div>

                            {/* Sidebar action list */}
                            <ul className="sidebar-action-list">
                                <li className="list-item expandable" onClick={() => setShowFullHours(!showFullHours)} style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                        <span className="icon-placeholder"><AccessTimeIcon /></span>
                                        <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getCollapsedHoursSummary()}
                                        </span>
                                        <span className="dropdown-arrow">
                                            {showFullHours ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                        </span>
                                    </div>
                                    {showFullHours && business.openingHours && (
                                        <ul className="full-hours-dropdown" style={{ listStyle: 'none', padding: '5px 0 0 40px', margin: 0, width: '100%' }}>
                                            {getFullHoursList().map((hour) => (
                                                <li key={hour.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '14px' }}>
                                                    <span style={{ fontWeight: '500' }}>{hour.day}:</span>
                                                    <span style={{ color: hour.isClosed ? '#D32F2F' : '#388E3C', fontWeight: 'bold' }}>
                                                        {hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                                <li className="list-item"><span className="icon-placeholder"><NoteAltIcon /></span>Suggest New Timings</li>
                                <li className="list-item"><span className="icon-placeholder"><EmailIcon /></span>Send Enquiry by Email</li>
                                <li className="list-item highlight"><span className="icon-placeholder"><InsertDriveFileIcon /></span>Get info via SMS/Email</li>
                                <li className="list-item"><span className="icon-placeholder"><ShareIcon /></span>Share</li>
                                <li
                                    className="list-item"
                                    onClick={handleRateClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="icon-placeholder"><StarIcon /></span>
                                    Tap to rate
                                </li>                                <li className="list-item"><span className="icon-placeholder"><EditIcon /></span>Edit this Listing</li>
                                <li className="list-item"><span className="icon-placeholder"><CheckCircleIcon /></span>Claim this business</li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><LanguageIcon /></span>
                                    <a href={website} target="_blank" rel="noopener noreferrer" className="list-link">
                                        Website
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="sidebar-card tags-container-card">
                            <h3 className="also-listed-title">Also listed in</h3>
                            <div className="tags-container">
                                <span className="tag">Mangalorean Restaurants</span>
                                <span className="tag">Restaurants</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showContactModal && (
                <SimpleModal title={`Contact for ${business.businessName}`} onClose={() => setShowContactModal(false)}>
                    <div className="modal-actions" style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 15px 0' }}>
                            {business.contact || 'N/A'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <a
                                href={`tel:${business.contact}`}
                                className="btn btn-primary"
                                style={{ textDecoration: 'none', flexGrow: 1, justifyContent: 'center' }}
                            >
                                <PhoneIcon /> Call Now
                            </a>
                            <button
                                onClick={handleCopyContact}
                                className="btn btn-secondary"
                                style={{ flexGrow: 1, justifyContent: 'center' }}
                            >
                                <ContentCopyIcon /> Copy
                            </button>
                        </div>
                    </div>
                </SimpleModal>
            )}
            {showFullGallery && (
                <FullScreenGallery
                    images={galleryImageSrcs}
                    initialIndex={currentSlideIndex}
                    onClose={() => setShowFullGallery(false)}
                />
            )}
            <Footer />
        </>
    );
};

export default BusinessDetail;