import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createStartProject } from "../../../redux/actions/startProjectAction.js";

import {
    FaUserTie,
    FaMobileAlt,
    FaEnvelope,
    FaBuilding,
    FaStore,
    FaLayerGroup,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaGlobeAsia,
    FaCity,
    FaRegStickyNote
} from "react-icons/fa";

import CardsSearch from "../CardsSearch/CardsSearch";
import "./businessEnquiry.css";
import businessImage from "../../../assets/businessImage.jpg";
import businessChain from "../../../assets/businessChain.jpg";

const BusinessEnquiry = () => {
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        contactNumber: "",
        email: "",
        businessName: "",
        businessType: "",
        category: "",
        subCategory: "",
        businessPhone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        message: "",
        notes: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await dispatch(createStartProject(formData));

        setFormData({
            fullName: "",
            contactNumber: "",
            email: "",
            businessName: "",
            businessType: "",
            category: "",
            subCategory: "",
            businessPhone: "",
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            message: "",
            notes: ""
        });

        setShowModal(true);
    };

    return (
        <>
            <CardsSearch /><br /><br /><br /><br />

            <div className="enquiry-wrapper">

                {/* LEFT SIDE FORM */}
                <div className="enquiry-container">

                    <div className="enquiry-header">
                        <img
                            src={businessChain}
                            alt="business handshake"
                            className="header-logo"
                        />

                        <div className="enquiry-header-text">
                            <h2>Business Enquiry</h2>
                            <p>Submit your business details and our consultant will call you.</p>
                        </div>
                    </div>

                    <div className="enquiry-grid">

                        <div className="enquiry-form-group">
                            <label><FaUserTie /> Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaMobileAlt /> Contact Number</label>
                            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group full">
                            <label><FaEnvelope /> Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group full">
                            <label><FaBuilding /> Business Name</label>
                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaStore /> Business Type</label>
                            <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaLayerGroup /> Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaLayerGroup /> Sub Category</label>
                            <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaPhoneAlt /> Business Phone</label>
                            <input type="text" name="businessPhone" value={formData.businessPhone} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group full">
                            <label><FaMapMarkerAlt /> Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaCity /> City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaCity /> State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaGlobeAsia /> Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group">
                            <label><FaMapMarkerAlt /> Postal Code</label>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                        </div>

                        <div className="enquiry-form-group full">
                            <label><FaRegStickyNote /> Message</label>
                            <textarea name="message" value={formData.message} onChange={handleChange}></textarea>
                        </div>

                        <div className="enquiry-form-group full">
                            <label><FaRegStickyNote /> Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                        </div>

                    </div>

                    <button className="enquiry-submit-btn" onClick={handleSubmit}>
                        Submit
                    </button>

                </div>

                <div
                    className="enquiry-side-image"
                    style={{ backgroundImage: `url(${businessImage})` }}
                ></div>

            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="success-animation">
                            <div className="success-check"></div>
                        </div>

                        <h3>Thank You!</h3>
                        <p>Your enquiry has been submitted successfully.</p>
                        <p>Our consultant will contact you within 24 hours.</p>

                        <button className="modal-btn" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

        </>
    );
};

export default BusinessEnquiry;
