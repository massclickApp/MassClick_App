import React from 'react';
import './aboutUspage.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // For Great Support
import GavelIcon from '@mui/icons-material/Gavel';             // For Transparent Business
import TrendingUpIcon from '@mui/icons-material/TrendingUp';   // For Professional Service
import CheckIcon from '@mui/icons-material/Check';             // For feature lists
import AccessTimeIcon from '@mui/icons-material/AccessTime';   // For 5+ Years Stat
import PeopleIcon from '@mui/icons-material/People';           // For 500+ Clients Stat
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // For 15+ Employees Stat
import Footer from '../footer';
import AboutUs from '../../../../assets/aboutUs.jpg'
import CardsSearch from '../../CardsSearch/CardsSearch';

const Card = ({ Icon, title, description }) => (
    <div className="card-item">
        <div className="card-icon-wrapper">
            <Icon className="card-icon" />
        </div>
        <h4 className="card-title">{title}</h4>
        <p className="card-description">{description}</p>
    </div>
);

// Reusable Feature List Component
const FeatureList = ({ features }) => (
    <div className="feature-grid">
        {features.map((feature, index) => (
            <div key={index} className="feature-item">
                <CheckIcon className="feature-check-icon" />
                <span className="feature-text">{feature}</span>
            </div>
        ))}
    </div>
);

const AboutUsPage = () => {
    const chooseCards = [
        {
            Icon: AccountCircleIcon,
            title: "Client-First Support",
            description: "Dedicated, responsive personalized assistance from experts committed to ensuring your ultimate success globally."
        },
        {
            Icon: GavelIcon,
            title: "Unwavering Integrity",
            description: "Total business clarity with zero hidden costs, fostering a secure, long-term relationship built on trust and reliability."
        },
        {
            Icon: TrendingUpIcon,
            title: "Industry Expertise",
            description: "Leverage our team of highly-skilled professionals to achieve outstanding, data-driven results and market leadership."
        }
    ];

    // Removed the duplicate "Commitment to Quality" and enhanced the language
    const platformFeatures = [
        "Domain Expertise",
        "Commitment to Quality",
        "Global Customer Satisfaction",
        "Continuous Improvement",
        "Scalable Business Solutions",
        "Dedicated Business Support"
    ];

    // Restructured Stats Data
    const statsData = [
        { Icon: AccessTimeIcon, number: "7+", label: "Years Experience" },
        { Icon: PeopleIcon, number: "500+", label: "Clients Globally" },
        { Icon: BusinessCenterIcon, number: "15+", label: "Talented Employees" },
    ];


    return (
        <>
            <CardsSearch />

            <div className="about-us-page-container">

                <section className="section-why-choose">
                    <h2 className="section-title">Why Choose Massclick</h2>
                    <p className="section-subtitle">
                        We're driven by experience, transparency, and a relentless focus on client success in a dynamic digital market.
                    </p>

                    <div className="stats-bar">
                        {statsData.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <stat.Icon className="stat-icon" />
                                <div className="stat-text-wrapper">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cards-grid">
                        {chooseCards.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                </section>

                <section className="section-platform-meets">
                    <div className="platform-content-wrapper">

                        <div className="platform-image-column">
                            <img
                                src={AboutUs}
                                alt="Business Chart for Massclick Platform"
                                className="platform-image"
                            />
                        </div>

                        <div className="platform-text-column">
                            <h2 className="platform-title">
                                A Global Platform that Meets the Needs of both <span className="highlight-text">Businesses and Users</span>
                            </h2>
                            <p className="platform-description">
                                Welcome to MassClick – the ultimate global hub for discovering and connecting with top-notch, verified businesses worldwide. Whether you're a savvy shopper searching for premier local services or a thriving entrepreneur looking to boost your international brand visibility, our scalable platform provides reliable and efficient solutions.
                            </p>

                            <FeatureList features={platformFeatures} />
                        </div>
                    </div>
                </section>


            </div>
            <Footer />
        </>
    );
}

export default AboutUsPage;