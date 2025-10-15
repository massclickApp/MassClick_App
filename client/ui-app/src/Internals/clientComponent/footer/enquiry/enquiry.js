import React, { useEffect, useMemo, useState } from "react";
import './enquiry.css'; // Import the new CSS file
// Removed all MUI imports except Alert (which is good for global messages)
import Alert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send'; // Keep the icon for the button

import EnquiryImage from '../../../../assets/enquiry.png';
import CardsSearch from '../../CardsSearch/CardsSearch';
import Footer from '../footer';
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction";
import { createEnquiry } from "../../../../redux/actions/enquiryAction";


const serviceInterests = [
    "SEO & Digital Marketing",
    "Web Design & Development",
    "General Consultation"
];

const EnquiryNow = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        contactNumber: '',
        email: '',
        // Renamed 'address' to 'message' for clarity with the large field
        message: '', 
    });

    const [category, setCategory] = useState('');
    const [service, setService] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });


    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );

    const uniqueCategories = useMemo(() => {
        if (!businessList || businessList.length === 0) {
            return [];
        }
        const categories = businessList
            .map(business => business.category)
            .filter(category => category);
        return [...new Set(categories)];
    }, [businessList]);

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    // Handler for all standard inputs (Name, Business Name, Contact, Email, Message)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSubmitMessage({ text: '', type: '' });
    };

    // Handler for Select inputs
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSubmitMessage({ text: '', type: '' });
    };

    const handleServiceChange = (e) => {
        setService(e.target.value);
        setSubmitMessage({ text: '', type: '' });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ text: '', type: '' });

        const payload = {
            name: formData.name,
            businessName: formData.businessName,
            contactNumber: formData.contactNumber,
            email: formData.email,
            address: formData.message, // Map 'message' back to 'address' for the API
            category: category,
            service: service,
        };

        try {
            await dispatch(createEnquiry(payload));

            setSubmitMessage({ text: 'Enquiry submitted successfully! We will contact you soon.', type: 'success' });

            // Reset form fields
            setFormData({ name: '', businessName: '', contactNumber: '', email: '', message: '' });
            setCategory('');
            setService('');

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred during submission.';
            setSubmitMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <CardsSearch /><br/><br/><br/>

            <section
                className="enquiry-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(255,102,0,0.7), rgba(255,102,0,0.7)), url(${EnquiryImage})` }}
            >
                <div className="banner-content">
                    <h1 className="banner-title">Enquiry</h1>
                    <p className="banner-breadcrumb">Home / Enquiry</p>
                </div>
            </section>
            {/* END HERO BANNER SECTION */}

            <section className="enquiry-form-section">
                <div className="enquiry-form-container-clean">

                    <div className="enquiry-intro-header-clean">
                        <h2 className="enquiry-title-clean">Ready to Grow? Send Us Your Enquiry!</h2>
                        <p className="enquiry-subtitle-clean">
                            Tell us about your business needs. Our specialists will contact you within one business day for a personalized consultation.
                        </p>
                    </div>

                    <form className="enquiry-form-grid" onSubmit={handleSubmit}>

                        {/* ALERT MESSAGE */}
                        {submitMessage.text && (
                            <div className="full-width" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                                <Alert
                                    severity={submitMessage.type}
                                    variant="filled"
                                    onClose={() => setSubmitMessage({ text: '', type: '' })}
                                >
                                    {submitMessage.text}
                                </Alert>
                            </div>
                        )}
                        {/* END ALERT MESSAGE */}


                        {/* 1. Full Name */}
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name *"
                                required
                            />
                        </div>

                        {/* 2. Business Name */}
                        <div className="form-group">
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Business Name *"
                                required
                            />
                        </div>

                        {/* 3. Business Category (Select) */}
                        <div className="form-group">
                            <select
                                name="category"
                                value={category}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="" disabled hidden>Business Category *</option>
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* 4. Contact Number */}
                        <div className="form-group">
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Contact Number *"
                                required
                            />
                        </div>

                        {/* 5. Email ID */}
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email ID *"
                                required
                            />
                        </div>

                        {/* 6. Service Interest (Select) */}
                        <div className="form-group">
                            <select
                                name="service"
                                value={service}
                                onChange={handleServiceChange}
                            >
                                <option value="" disabled hidden>Service Interest (Optional)</option>
                                {serviceInterests.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* 7. Project Details / Message (Textarea) */}
                        <div className="form-group full-width">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Briefly describe your project or address..."
                                rows="4"
                            />
                             <span className="helper-text">Project Details / Message (Required: Minimum 20 characters)</span>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="submit-button full-width"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="spinner" />
                            ) : (
                                <SendIcon style={{ fontSize: '1.2rem' }} />
                            )}
                            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </button>

                        <p className="privacy-note full-width">* We respect your privacy. All fields marked with an asterisk are required.</p>
                    </form>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default EnquiryNow;