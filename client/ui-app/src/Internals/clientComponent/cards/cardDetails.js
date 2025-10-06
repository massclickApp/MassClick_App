import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../redux/actions/businessListAction";
import './cardDetails.css';
import UserRatingWidget from "../rating/rating";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpaIcon from '@mui/icons-material/Spa';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsIcon from '@mui/icons-material/Directions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EmailIcon from '@mui/icons-material/Email';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Footer from "../footer/footer.js";

const buildImageSrc = (base64String, defaultType = "webp") => {
    if (!base64String) {
        return "https://via.placeholder.com/120x100?text=Image+Missing";
    }
    const clean = base64String.replace(/[\r\n\s]/g, "");
    if (clean.startsWith("data:")) return clean;
    let mimeType = defaultType;
    if (clean.startsWith("/9j")) mimeType = "jpeg";
    else if (clean.startsWith("iVBOR")) mimeType = "png";
    return `data:image/${mimeType};base64,${clean}`;
};

const BusinessDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector((state) => state.businessListReducer || {});
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const business = businessList.find((b) => b._id === id);

    if (!business) {
        return <div className="page-wrapper"><p>No business found for this ID.</p></div>;
    }

const galleryImageSrcs = business.businessImages?.map((img) => buildImageSrc(img)) || [];
const firstImage = business.businessImage || galleryImageSrcs[0] || null;
const bannerImageSrc = mainImage || buildImageSrc(firstImage);
    
      const displayedAverageRating = '4.7';

    const fullAddress = `${business.plotNumber || ''} ${business.street || ''}, ${business.location || ''}`;
    const quickFacts = [
        fullAddress,
        'Open until 8:00 pm',
        `${business.experience} Years in Business`,
        'Pure Veg'
    ]; 	

    const getQuickFactIcon = (index) => {
        switch (index) {
            case 0: return <LocationOnIcon />;
            case 1: return <AccessTimeIcon />;
            case 3: return <SpaIcon />;
            default: return null;
        }
    };

    return (
        <> <CardsSearch />
            <div className="page-wrapper">

                <div className="image-gallery">
                    <div className="main-image-container">
                        <img src={bannerImageSrc} alt={business.businessName} className="business-banner-image" />
                    </div>

                    <div className="gallery-thumbnails">
                        {galleryImageSrcs.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`${business.businessName} ${index + 1}`}
                                className="thumbnail-image"
                                onClick={() => setMainImage(src)}
                            />
                        ))}
                    </div>
                </div>

                <div className="main-content-grid">

                    <div className="left-column">
                        <div className="business-header">
                            <h1 className="business-name">{business.businessName}</h1>

                            <div className="rating-row">
                                <span className="rating-badge">{displayedAverageRating} ★</span>
                                <span className="rating-text">5 ratings • <a href="#">Claim this business</a></span>
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
                                    <a href={`tel:${business.contact}`} className="btn btn-primary">
                                        <PhoneIcon style={{ fontSize: '20px' }} /> Show Number
                                    </a>
                                    <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                                        <WhatsAppIcon style={{ fontSize: '20px' }} /> WhatsApp
                                    </a>
                                    <span className="icon-btn" title="Edit Business Info"><EditIcon style={{ fontSize: '20px' }} /></span>
                                    <span className="icon-btn" title="Share"><ShareIcon style={{ fontSize: '20px' }} /></span>
                                </div>

                                <div className="rating-input-group">
                                    <UserRatingWidget initialValue={0} />
                                </div>
                            </div>
                        </div>

                        <div className="tabs-container-wrapper">
                            <div className="nav-tabs">
                                <span className="tab active">Overview</span>
                                <span className="tab">Quick Info</span>
                                <span className="tab">Services</span>
                                <span className="tab">Photos</span>
                                <span className="tab">Reviews</span>
                            </div>
                        </div>

                        <div className="info-block">
                            <h2>Quick Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Cuisines</span>
                                    <span className="info-value">Punjabi, South Indian, Multicuisine</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Year of Establishment</span>
                                    <span className="info-value">2006</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right-sidebar">

                        <div className="sidebar-contact-card">

                            <div className="contact-section">
                                <h3 className="sidebar-title">Contact</h3>
                                <div className="contact-item with-icon">
                                    <span className="icon-placeholder"><PhoneIcon style={{ color: 'var(--color-primary)' }} /></span>
                                    <a href={`tel:${business.contact}`} className="contact-link">Show Number</a>
                                </div>
                            </div>

                            <div className="address-section">
                                <h3 className="sidebar-title">Address</h3>
                                <p className="address-text">{fullAddress}</p>

                                <div className="address-actions">
                                    <a href="#" className="address-action-link">
                                        <DirectionsIcon style={{ fontSize: '16px' }} /> Get Directions
                                    </a>
                                    <a href="#" className="address-action-link">
                                        <ContentCopyIcon style={{ fontSize: '16px' }} /> Copy
                                    </a>
                                </div>
                            </div>

                            <ul className="sidebar-action-list">
                                <li className="list-item expandable">
                                    <span className="icon-placeholder"><AccessTimeIcon /></span>
                                    Open until 8:00 pm
                                    <span className="dropdown-arrow"><ArrowDropDownIcon /></span>
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><NoteAltIcon /></span>
                                    Suggest New Timings
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><EmailIcon /></span>
                                    Send Enquiry by Email
                                </li>
                                <li className="list-item highlight">
                                    <span className="icon-placeholder"><InsertDriveFileIcon /></span>
                                    Get info via SMS/Email
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><ShareIcon /></span>
                                    Share
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><StarIcon /></span>
                                    Tap to rate
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><EditIcon /></span>
                                    Edit this Listing
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><CheckCircleIcon /></span>
                                    Claim this business
                                </li>
                                <li className="list-item">
                                    <span className="icon-placeholder"><LanguageIcon /></span>
                                    Visit our Website
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
            <Footer />
        </>
    );
};

export default BusinessDetail;