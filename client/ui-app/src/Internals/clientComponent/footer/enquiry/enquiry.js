import React, { useEffect, useMemo, useState } from "react"; 
import './enquiry.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
// 💡 Import Alert component from MUI
import Alert from '@mui/material/Alert'; 
import SendIcon from '@mui/icons-material/Send';

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
        address: '',
    });

    const [category, setCategory] = useState('');
    const [service, setService] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    // submitMessage will control the Alert: text (message), type (success/error)
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

    // Handler for text inputs
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
            ...formData,
            category: category,
            service: service,
        };
        
        try {
            await dispatch(createEnquiry(payload)); 
            
            // Success: Use 'success' type for the Alert
            setSubmitMessage({ text: 'Enquiry submitted successfully! We will contact you soon.', type: 'success' });
            
            // Reset form fields
            setFormData({ name: '', businessName: '', contactNumber: '', email: '', address: '' });
            setCategory('');
            setService('');

        } catch (error) {
            // Failure: Use 'error' type for the Alert
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred during submission.';
            setSubmitMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <CardsSearch />

            <section
                className="enquiry-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(255,102,0,0.7), rgba(255,102,0,0.7)), url(${EnquiryImage})` }}
            >
                <div className="banner-content">
                    <h1 className="banner-title">Enquiry</h1>
                    <p className="banner-breadcrumb">Home / Enquiry</p>
                </div>
            </section>

            <section className="enquiry-form-section">
                <div className="enquiry-form-container-clean">

                    <div className="enquiry-intro-header-clean">
                        <h2 className="enquiry-title-clean">Ready to Grow? Send Us Your Enquiry!</h2>
                        <p className="enquiry-subtitle-clean">
                            Tell us about your business needs. Our specialists will contact you within one business day for a personalized consultation.
                        </p>
                    </div>

                    <form className="enquiry-form-grid" onSubmit={handleSubmit}>

                        {/* 💡 ALERT INTEGRATION */}
                        {submitMessage.text && (
                            <div className="full-width" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                                <Alert 
                                    severity={submitMessage.type} // Set severity dynamically (success or error)
                                    variant="filled" // Optional: gives a strong visual cue
                                    onClose={() => setSubmitMessage({ text: '', type: '' })} // Allows user to close the alert
                                >
                                    {submitMessage.text}
                                </Alert>
                            </div>
                        )}
                        {/* 💡 END ALERT INTEGRATION */}
                        
                        <TextField
                            label="Full Name"
                            name="name"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                        />
                        {/* ... (rest of the form fields remain the same) ... */}
                        
                        <TextField
                            label="Business Name"
                            name="businessName"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Your Company Name"
                        />

                        <FormControl fullWidth required variant="outlined">
                            <InputLabel id="category-label">Business Category *</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                label="Business Category *"
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">
                                    <em>Select Category...</em>
                                </MenuItem>
                                {uniqueCategories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Contact Number"
                            name="contactNumber"
                            variant="outlined"
                            fullWidth
                            required
                            type="tel"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="+XX XXX XXXX XXX"
                        />

                        <TextField
                            label="Email ID"
                            name="email"
                            variant="outlined"
                            fullWidth
                            required
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />

                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="service-label">Service Interest</InputLabel>
                            <Select
                                labelId="service-label"
                                value={service}
                                label="Service Interest"
                                onChange={handleServiceChange}
                            >
                                <MenuItem value="">
                                    <em>Select Service...</em>
                                </MenuItem>
                                {serviceInterests.map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Project Details / Message"
                            name="address"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Briefly describe your project or address..."
                            className="full-width" 
                        />
                        
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            endIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                            disabled={isSubmitting} 
                            sx={{
                                backgroundColor: '#ff6600', 
                                '&:hover': { backgroundColor: '#e65100' },
                                padding: '15px 30px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                marginTop: '10px'
                            }}
                            className="full-width"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </Button>

                        <p className="privacy-note full-width">* We respect your privacy. All fields marked with an asterisk are required.</p>
                    </form>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default EnquiryNow;