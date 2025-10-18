import React from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

// Import Material-UI Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Footer = () => {
    const FooterLink = ({ children, to = "#" }) => (
        <li className="footer-link-item">
            <ChevronRightIcon className="link-bullet-icon" />
            <Link to={to} className="footer-link-anchor">{children}</Link>
        </li>
    );

    return (
        <footer className="footer-container">
            <div className="footer-content-area">

                <div className="footer-section quick-links">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-link-list">
                        <FooterLink to="/aboutus">About Us</FooterLink>
                        <FooterLink to="/testimonials">Testimonials</FooterLink>
                        <FooterLink to="/feedbacks">Feedbacks</FooterLink>
                        <FooterLink to="/customercare">Customer Care</FooterLink>
                        <FooterLink to="/portfolio">Media / Gallery Portfolio</FooterLink>
                    </ul>
                </div>

                <div className="footer-section policy">
                    <h3 className="footer-heading">Business Listing Policy</h3>
                    <ul className="footer-link-list">
                        <FooterLink to="/terms">Terms and Conditions</FooterLink>
                        <FooterLink to="/privacy">Privacy Policy</FooterLink>
                        <FooterLink to="/refund">Refund Policy</FooterLink>
                        <FooterLink to="/enquiry">Enquiry Now</FooterLink>
                    </ul>
                </div>

                <div className="footer-section services">
                    <h3 className="footer-heading">Other Services</h3>
                    <ul className="footer-link-list">
                        <FooterLink to="/services/web">Web Design & Development</FooterLink>
                        <FooterLink to="/services/digital">Digital Marketing</FooterLink>
                        <FooterLink to="/services/graphic">Graphic Design</FooterLink>
                        <FooterLink to="/services/seo">SEO</FooterLink>
                    </ul>
                </div>

                <div className="footer-section follow-us-logo">
                    <h3 className="footer-heading social-heading">Follow us on</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/massClicks" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <FacebookIcon className="social-icon" />
                        </a>
                        <a href="https://www.facebook.com/massClicks" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                            <TwitterIcon className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/massclick_/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                            <InstagramIcon className="social-icon" />
                        </a>
                        <a
                            href="https://youtube.com/@mass_click?si=a3P-SsGzBzPYlGQk"
                            aria-label="YouTube"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <YouTubeIcon className="social-icon" />
                        </a>
                    </div>
                    
                    <div className="logo-placeholder">
                        <span className="logo-text">MassClick™</span>
                        <p className="logo-tagline">India's Leading Local Search Engine</p>
                    </div>
                </div>

            </div>

                <div className="footer-copyright-area">
                <p>&copy; {new Date().getFullYear()} Massclick All Rights Reserved</p>
            </div>
        </footer>
    );
}

export default Footer;