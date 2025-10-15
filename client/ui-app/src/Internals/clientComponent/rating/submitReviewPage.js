import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { editBusinessList } from '../../../redux/actions/businessListAction';
import './submitReview.css';
import CardsSearch from '../CardsSearch/CardsSearch';
import Footer from '../footer/footer';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Define rating labels
const labels = {
    0.5: 'Useless', 1: 'Poor', 1.5: 'Bad', 2: 'Weak', 2.5: 'Average',
    3: 'Good', 3.5: 'Very Good', 4: 'Excellent', 4.5: 'Outstanding', 5: 'Amazing'
};

const WriteReviewPage = () => {
    const { businessId, ratingValue } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialRating = parseFloat(ratingValue) || 0;
    const currentUser = useSelector(state => state.auth.user);

    const [rating, setRating] = useState(initialRating);
    const [reviewText, setReviewText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [ratingPhotos, setRatingPhotos] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state
    const [isSubmitting, setIsSubmitting] = useState(false); // To disable button

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        setRatingPhotos(files);
    };
    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate(`/business/${businessId}`);
    };
    const business = useSelector(state =>
        state.businessListReducer.businessList.find(b => b._id === businessId)
    );

    if (!business) {
        return <p>Loading business details for review...</p>;
    }

    const handleTagClick = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };


    const handleSubmitReview = async () => {
        if (!rating || reviewText.length < 5) {
            alert("Please provide a rating and at least 5 characters for your experience.");
            return;
        }
        setIsSubmitting(true);

        const photoPromises = ratingPhotos.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });
        const base64Photos = await Promise.all(photoPromises);

        const newReview = {
            rating: rating,
            ratingExperience: reviewText,
            ratingLove: selectedTags,
            userId: currentUser?._id || null,
            username: currentUser?.username || 'Anonymous User',
            ratingPhotos: base64Photos,
        };

        const businessUpdatePayload = {
            reviewData: newReview
        };

        try {
            await dispatch(editBusinessList(businessId, businessUpdatePayload));
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Failed to submit review:", error);
            alert(`Failed to submit review: ${error.message || 'Check console.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    const isSubmitDisabled = isSubmitting || !rating || reviewText.length < 5;

    return (
        <>
            <CardsSearch /><br/><br/><br/>
            <div className="write-review-container">

                <h1 className="review-page-title">Write Review</h1>

                <div className="review-business-header">
                    <img
                        src={business.bannerImageKey ? business.bannerImage : 'placeholder.jpg'}
                        alt={business.businessName}
                    />
                    <div>
                        <h2>{business.businessName}</h2>
                        <p>{business.location}</p>
                    </div>
                </div>

                <div className="review-form-body">

                    <div className="rating-column">
                        <div className="rating-section">
                            <h3>How would you rate your experience?</h3>
                            <Rating
                                value={rating}
                                precision={0.5}
                                onChange={(e, newValue) => setRating(newValue || 0)}
                                emptyIcon={<StarIcon style={{ opacity: 0.2 }} fontSize="inherit" />}
                                size="large"
                            />
                            <p className="rating-label">
                                {labels[rating] || 'Select your rating...'}
                                <span role="img" aria-label="emoji"> {rating >= 4 ? '🤩' : rating >= 2.5 ? '🙂' : '😔'}</span>
                            </p>
                        </div>

                        <div className="photo-upload-section">
                            <h3>Upload Photos (Optional)</h3>
                            <input
                                type="file"
                                id="photo-upload-input"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />

                            <label htmlFor="photo-upload-input" className="custom-upload-btn">
                                <PhotoCameraIcon style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                                {ratingPhotos.length > 0
                                    ? `${ratingPhotos.length} photo(s) selected`
                                    : 'Choose Photo Files'
                                }
                            </label>

                            {ratingPhotos.length > 0 && (
                                <div className="file-preview-list">
                                    <ul className="selected-files-list">
                                        {ratingPhotos.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="content-column">
                        <div className="tags-section">
                            <h3>What did you like or dislike?</h3>
                            <div className="tag-list">
                                {['Quick service', 'Great service', 'Impolite staff', 'Worth the money', 'Long wait time', 'Reasonably priced'].map(tag => (
                                    <span
                                        key={tag}
                                        className={`review-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                        onClick={() => handleTagClick(tag)}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-section">
                            <h3>Tell us about your experience</h3>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Please say a little something about (Minimum 5 characters)"
                                rows="5"
                            ></textarea>
                        </div>
                    </div>

                </div>

                <div className="submit-action-container">
                    <button
                        className="submit-review-btn"
                        onClick={handleSubmitReview}
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>

            <Dialog
                open={showSuccessModal}
                onClose={handleModalClose}
                aria-labelledby="success-dialog-title"
            >
                <DialogTitle id="success-dialog-title" style={{ textAlign: 'center', color: '#16a085', paddingTop: '20px' }}>
                    <CheckCircleIcon style={{ fontSize: 60, color: '#16a085' }} />
                </DialogTitle>

                <DialogContent style={{ textAlign: 'center', padding: '0 40px 10px' }}>
                    <h2 style={{ color: '#333', fontSize: '1.8rem', margin: '10px 0' }}>Review Submitted!</h2>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Thank you for sharing your valuable experience at **{business.businessName}**.
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '15px' }}>
                        Your review will be live shortly.
                    </p>
                </DialogContent>

                <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
                    <Button
                        onClick={handleModalClose}
                        // Use your primary brand color (Orange) for consistency
                        style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold' }}
                        variant="contained"
                        autoFocus
                    >
                        View Business Page
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </>
    );
};

export default WriteReviewPage;