// MultiStepProfileForm.jsx

import React, { useState } from 'react';
// Corrected to use MultiStepProfileForm.css, assuming you renamed it back
import './EditProfile.css'; 
import Footer from '../../footer/footer';
import CardsSearch from '../../CardsSearch/CardsSearch';

// --- Sub-Components (Simplified for brevity, assuming your full components are ready) ---
// Note: We'll use the placeholder functions for steps 3, 4, 5
const PersonalDetails = () => (
    <div className="form-step-content">
        <h3>Please provide your personal details</h3>
        <p className="step-description">* Denotes mandatory fields</p>
        
        <div className="step-form-grid">
            {/* Input fields as defined in the previous solution */}
            <div className="form-field form-field-row">
                <label>Title</label>
                <select defaultValue="Ms"><option>Mr</option><option>Ms</option></select>
            </div>
            <div className="form-field">
                <label>First Name *</label>
                <input type="text" defaultValue="Prem" placeholder="Enter First Name" required />
            </div>
            
            <div className="form-field">
                <label>Middle Name</label>
                <input type="text" placeholder="Enter Middle Name" />
            </div>
            <div className="form-field">
                <label>Last Name</label>
                <input type="text" placeholder="Enter Last Name" />
            </div>
            
            <div className="form-field full-width image-upload-group">
                <div className="image-preview"></div>
                <div className="upload-controls">
                    <p className="label-text">Profile Image</p>
                    <button type="button" className="btn-secondary">Browse Image</button>
                </div>
            </div>

            {/* Other form fields here... */}
            <div className="form-field">
                <label>Email ID *</label>
                <div className="input-with-button">
                    <input type="email" placeholder="Enter Email ID" required />
                    <button type="button" className="btn-verify">Verify</button>
                </div>
            </div>
             <div className="form-field">
                <label>Mobile Number 1 *</label>
                <div className="input-with-button verified">
                    <span className="country-code">+91</span>
                    <input type="tel" defaultValue="9994230480" required />
                    <span className="verify-status">✓</span>
                </div>
            </div>
        </div>
    </div>
);

const AddressDetails = () => (
    <div className="form-step-content">
        <h3>Address Details</h3>
        <p className="step-description">Enter your permanent and office addresses.</p>
        
        <div className="step-form-grid">
             <div className="form-field full-width">
                 <label>Plot No. / Room No. *</label>
                 <input type="text" required />
             </div>
             <div className="form-field full-width">
                 <label>Street / Area *</label>
                 <input type="text" required />
             </div>
             <div className="form-field">
                 <label>Pincode *</label>
                 <input type="text" required />
             </div>
             <div className="form-field">
                 <label>Home Landline 1</label>
                 <input type="tel" placeholder="STD/Number" />
             </div>
             <div className="form-field">
                 <label>Office Landline 1</label>
                 <input type="tel" placeholder="STD/Number/EXT" />
             </div>
        </div>
    </div>
);

const FamilyAndFriends = () => (
    <div className="form-step-content">
        <h3>Add your friends and family members</h3>
        <p className="step-description">Fill out details to add a new contact.</p>
        {/* Placeholder for the Family & Friends form content */}
        <p>Family & Friends form content goes here...</p>
    </div>
);


// --- Main Component ---
const steps = [
    { id: 1, title: 'Personal Details', component: PersonalDetails },
    { id: 2, title: 'Addresses', component: AddressDetails },
    { id: 3, title: 'Family & Friends', component: FamilyAndFriends },
    { id: 4, title: 'Favorites', component: () => <h3>Favorites</h3> },
    { id: 5, title: 'Completed', component: () => <h3>Completed</h3> }, 
];

export default function MultiStepProfileForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const CurrentComponent = steps.find(s => s.id === currentStep).component;

    // Dynamic Progress Calculation: (Current Step - 1) / (Total Steps - 1) * 100
    const totalSteps = steps.length;
    // We use (currentStep - 1) because progress should be 0% at step 1 and 100% at the last step.
    const progressPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < totalSteps) {
            handleNext();
        } else {
            alert('Profile Updated Successfully!');
        }
    };

    return (
   
        <div className="profile-form-wrapper">
            <div className="profile-form-container">
                <div className="sidebar-progress-container">
                    {/* NEW: Dynamic Progress Bar Structure */}
                    <div className="overall-progress-header">
                        <div className="overall-progress-text-wrapper">
                             <h4 className="overall-progress-title">FILL PROFILE IN FEW STEPS</h4>
                             <span className="overall-progress-percentage">Overall Progress: {progressPercentage}%</span>
                        </div>
                        <div className="progress-bar-container">
                             {/* The style property drives the blue fill */}
                             <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    
                    {/* OLD/Hardcoded Progress Div is REMOVED */}
                    {/* <div className="overall-progress">Overall Progress: {currentStep * 20}%</div> */}

                    <ul className="step-navigation">
                        {steps.map(step => (
                            <li 
                                key={step.id} 
                                className={`step-item ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}
                                onClick={() => setCurrentStep(step.id)}
                            >
                                {step.id < currentStep && <svg className="check-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>}
                                {step.id >= currentStep && <span className="step-number">{step.id}</span>}
                                <span className="step-title">{step.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="form-content-area">
                    <div className="content-header">
                        <h1>{steps.find(s => s.id === currentStep).title}</h1>
                        <p className="step-subtitle">Denotes mandatory fields</p>
                        <hr />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="step-form">
                        <CurrentComponent />
                        
                        <div className="form-actions-footer">
                            {currentStep > 1 && (
                                <button type="button" className="btn-secondary" onClick={handleBack}>
                                    Back
                                </button>
                            )}
                            <button type="submit" className="btn-primary">
                                {currentStep < steps.length ? 'Save & Continue' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      
    );
}