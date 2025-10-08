import React from 'react';
import './seo.css';
import SeoImage from '../../../../assets/seo1.jpg'; // Your local background image
// Placeholder for a possible secondary image, if needed
import searchGraphic from '../../../../assets/seo.jpg'; 
import Footer from '../footer';
import CardsSearch from '../../CardsSearch/CardsSearch';

const Seo = () => {
    return (
        <>
            <CardsSearch />
            <div className="seo-container">
                
                {/* 1. Hero Section */}
                <header className="seo-hero-section" style={{ backgroundImage: `url(${SeoImage})` }}>
                    <div className="hero-overlay">
                        <h1 className="hero-title">Search Engine Optimization</h1>
                        <p className="hero-breadcrumb">Home / SEO</p>
                    </div>
                </header>

                {/* 2. Intro/Content Section */}
                <section className="seo-intro-section">
                    <div className="intro-image-area">
                        <img src={searchGraphic} alt="Search Engine Optimization Visual" className="search-graphic" />
                    </div>
                    <div className="intro-text-content">
                        <h2 className="section-heading">Search Engine Optimization</h2>
                        <p>
                            As one of Tamil Nadu's top providers of digital marketing in Karaikudi, we provide the most trustworthy SEO
                            Services to our customers. To raise the position of your website in search engine results pages (SERPs) and
                            increase your online presence, our team of SEO experts have contributed their skills and knowledge. The most
                            effective SEO services we offer are economical, natural, and result-oriented.
                        </p>
                        <p>
                            Our team of specialists matches you with the ideal SEO approach after carefully examining your objectives and
                            target markets. This increases website traffic and sales for your business. For the benefit of our clients, we
                            employ the most effective SEO strategy. We can deliver reliable campaign results thanks to this platform.
                        </p>
                    </div>
                </section>

                {/* 3. Services/Cards Section - NEW ICONS */}
                <section className="seo-services-section">
                    <h2 className="section-heading">Our Expertise</h2>
                    <div className="services-grid">
                        
                        {/* Card 1: Regional/Local */}
                        <div className="service-card">
                            <i className="fas fa-map-marker-alt card-icon"></i> {/* Font Awesome Icon */}
                            <h3>For regional/local businesses</h3>
                            <ul className="service-list">
                                <li>SEO services to optimize local presence.</li>
                                <li>Allows your website to be found locally in your area.</li>
                                <li>Results in improvement in locally targeted website traffic providing significant new business.</li>
                                <li>Ideal for businesses with a physical location.</li>
                            </ul>
                        </div>
                        
                        {/* Card 2: National & International */}
                        <div className="service-card primary-card">
                            <i className="fas fa-globe card-icon"></i> {/* Font Awesome Icon */}
                            <h3>National & International SEO</h3>
                            <ul className="service-list">
                                <li>Sell products or services to a larger audience.</li>
                                <li>Reach customers outside your city, state or country.</li>
                                <li>Custom SEO campaign to reach national or international customers.</li>
                                <li>Dominate search engine results through our SEO strategies.</li>
                                <li>Earn more leads and conversions.</li>
                            </ul>
                        </div>

                        {/* Card 3: Ecommerce SEO */}
                        <div className="service-card">
                            <i className="fas fa-shopping-cart card-icon"></i> {/* Font Awesome Icon */}
                            <h3>Ecommerce SEO</h3>
                            <ul className="service-list">
                                <li>Get new buyers for your online shop.</li>
                                <li>Expert SEO services to boost your ecommerce website.</li>
                                <li>Works for ecommerce website in any category or niche.</li>
                                <li>Results in targeted customers looking to buy your products.</li>
                                <li>Ideal for businesses selling products online.</li>
                            </ul>
                        </div>

                    </div>
                </section>
            </div>
            <br />
            <Footer />
        </>
    );
}

export default Seo;