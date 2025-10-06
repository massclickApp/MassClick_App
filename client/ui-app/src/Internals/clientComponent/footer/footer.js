import React from 'react';
import './footer.css';

const quickLinks = [
    { name: 'About Us', url: '#' },
    { name: 'Testimonials', url: '#' },
    { name: 'Feedbacks', url: '#' },
    { name: 'Customer Care', url: '#' },
    { name: 'Media / Gallery Portfolio', url: '#' },
];

const businessPolicy = [
    { name: 'Terms and Conditions', url: '#' },
    { name: 'Privacy Policy', url: '#' },
    { name: 'Refund Policy', url: '#' },
    { name: 'Enquiry Now', url: '#' },
];

const otherServices = [
    { name: 'Web Design & Development', url: '#' },
    { name: 'Digital Marketing', url: '#' },
    { name: 'Graphic Design', 'url': '#' },
    { name: 'SEO', 'url': '#' },
];

const socialMedia = [
    { label: 'Facebook', iconText: 'F', url: '#', id: 'facebook' },
    { label: 'Instagram', iconText: 'IG', url: '#', id: 'instagram' },
    { label: 'Twitter/X', iconText: 'X', url: '#', id: 'twitter' }, 
    { label: 'LinkedIn', iconText: 'L', url: '#', id: 'linkedin' }, 
];

const logoText = "MassClick™";
const tagline = "India's Leading Local Search Engine";

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-top-section">
                <div className="footer-content-wrapper">

                    <div className="footer-column">
                        <h3 className="column-heading">Quick Links</h3>
                        <ul className="link-list">
                            {quickLinks.map((link, index) => (
                                <li key={index}><a href={link.url} className="footer-link">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="column-heading">Business Listing Policy</h3>
                        <ul className="link-list">
                            {businessPolicy.map((link, index) => (
                                <li key={index}><a href={link.url} className="footer-link">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="column-heading">Other Services</h3>
                        <ul className="link-list">
                            {otherServices.map((link, index) => (
                                <li key={index}><a href={link.url} className="footer-link">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column footer-social-column">
                        <h3 className="column-heading">Follow us on</h3>
                        <div className="social-icons">
                            {socialMedia.map((social) => (
                                <a 
                                    key={social.id}
                                    href={social.url} 
                                    aria-label={`Follow us on ${social.label}`} 
                                    className="social-icon"
                                >
                                    {social.iconText}
                                </a>
                            ))}
                        </div>
                        
                        <div className="footer-logo-block">
                            <span className="footer-logo-text">{logoText}</span>
                            <p className="footer-logo-tagline">{tagline}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="footer-bottom-section">
                <p className="copyright-text">
                    &copy; {new Date().getFullYear()} {logoText}. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;