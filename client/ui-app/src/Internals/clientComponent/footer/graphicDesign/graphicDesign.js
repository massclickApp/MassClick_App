import React from 'react';
import './graphicDesign.css';
import graphic1 from '../../../../assets/graphic.jpg';
import graphic2 from '../../../../assets/graphic1.jpg';
import Footer from '../footer';
import CardsSearch from '../../CardsSearch/CardsSearch';
import height from '../../../../assets/height.jpg'
import { Helmet } from "react-helmet-async";
import { GRAPHIC_DESIGN_META } from "../../seo/seoDocument";


const GraphicDesign = () => {
    return (
        <>
            <Helmet>
                <title>{GRAPHIC_DESIGN_META.title}</title>

                <meta
                    name="description"
                    content={GRAPHIC_DESIGN_META.description}
                />

                <meta
                    name="keywords"
                    content={GRAPHIC_DESIGN_META.keywords}
                />

                <meta name="robots" content="index, follow" />
                <meta name="author" content="Massclick" />
                <meta name="publisher" content="Massclick" />

                <link
                    rel="canonical"
                    href={GRAPHIC_DESIGN_META.canonical}
                />
            </Helmet>
            
            <CardsSearch /><br /><br /><br />
            <div className="graphic-design-container">
                {/* 1. Graphic Design Hero/Intro Section */}
                <div className="graphic-design-intro-section">
                    <div className="intro-text-block">
                        <h1>Graphic Design</h1>
                        <p>
                            We understand the importance of visually captivating and effective marketing materials in promoting your brand
                            and making a lasting impression. Our comprehensive range of design services is geared towards creating
                            stunning and impactful marketing collateral that helps your business stand out from the competition.
                        </p>
                    </div>
                    <div className="intro-image-block">
                        <img src={graphic1} alt="Graphic Design on Tablet" className="intro-image" />
                    </div>
                </div>

                {/* 2. Portfolio/Benefits Section */}
                <div className="portfolio-section">
                    <h2>Portfolio</h2>
                    <div className="portfolio-content">
                        <div className="portfolio-image-block">
                            <img src={graphic2} alt="Creative Design Workspace" className="portfolio-image" />
                        </div>
                        <div className="portfolio-benefits">
                            <div className="benefit-item">
                                <h3>Creative Expertise:</h3>
                                <p>Our team of experienced designers possesses a wealth of creative expertise in crafting compelling marketing materials.</p>
                            </div>
                            <div className="benefit-item">
                                <h3>Customization:</h3>
                                <p>We take the time to understand your brand, target audience, and objectives to create custom designs that align with your vision and goals.</p>
                            </div>
                            <div className="benefit-item">
                                <h3>Attention to Detail:</h3>
                                <p>We pay meticulous attention to every detail, from visual elements and typography to color schemes and overall aesthetics.</p>
                            </div>
                            <div className="benefit-item">
                                <h3>Timely Delivery:</h3>
                                <p>Our efficient design process ensures that your marketing materials are ready when you need them, allowing you to execute your marketing campaigns seamlessly.</p>
                            </div>
                            <div className="benefit-item">
                                <h3>Client Satisfaction:</h3>
                                <p>We strive to exceed your expectations and deliver designs that truly reflect your brand identity.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <div className="cta-content"> {/* This will now act as the left half for text */}
                        <h2>Ready to take your online presence to new heights?</h2>
                        <p>Get in touch with us today, and let's discuss how our web design and development services can help you achieve your business objectives. Our team is excited to collaborate with you and create a website that drives growth and success.</p>
                    </div>
                    <div className="cta-image-block"> {/* New div for the image */}
                        <img src={height} alt="Achieve New Heights" className="cta-image" />
                    </div>
                </div>
            </div>
            <br />
            <Footer /></>

    );
}

export default GraphicDesign;