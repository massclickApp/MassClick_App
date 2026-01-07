import React from 'react';
import './customerCare.css';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ForumIcon from '@mui/icons-material/Forum';
import CardsSearch from '../../CardsSearch/CardsSearch';
import Footer from '../footer';
import { Helmet } from "react-helmet-async";
import { CUSTOMER_SUPPORT_META } from "../../seo/seoDocument";


const carePillars = [
    {
        id: 1,
        title: "Knowledge Base & FAQs",
        description: "Find instant answers to common questions about accounts, billing, and services. Search our extensive library for quick self-help.",
        icon: LiveHelpIcon,
        buttonText: "Search Articles",
        link: "/faqs"
    },

    {
        id: 2,
        title: "Speak to a Specialist",
        description: "For technical issues or personalized consultation, connect directly with our expert team via live chat or a scheduled call.",
        icon: SupportAgentIcon,
        buttonText: "Start Live Chat",
        link: "/contact"
    },

    {
        id: 3,
        title: "Community & Social Hub",
        description: "Join our official channels to share ideas, report minor bugs, and stay updated on the latest service features and announcements.",
        icon: ForumIcon,
        buttonText: "Connect Now",
        link: "/community"
    },
];

const CareCard = ({ pillar }) => {
    const IconComponent = pillar.icon;
    return (
        <div className="care-card">
            <div className="icon-wrapper">
                <IconComponent className="care-icon" />
            </div>
            <h3 className="card-title">{pillar.title}</h3>
            <p className="card-description">{pillar.description}</p>
            <a href={pillar.link} className="card-button">
                {pillar.buttonText}
            </a>
        </div>
    );
};

const CustomerCareComponent = () => {
    return (
        <>
            <Helmet>
                <title>{CUSTOMER_SUPPORT_META.title}</title>

                <meta
                    name="description"
                    content={CUSTOMER_SUPPORT_META.description}
                />

                <meta name="robots" content="index, follow" />
                <meta name="author" content="Massclick" />
                <meta name="publisher" content="Massclick" />

                <link
                    rel="canonical"
                    href={CUSTOMER_SUPPORT_META.canonical}
                />
            </Helmet>
            <CardsSearch /><br /><br /><br />
            <section className="section-customer-care">
                <div className="care-header-wrapper">
                    <h2 className="section-title-care">Dedicated Customer Care</h2>
                    <p className="section-subtitle-care">
                        How can we help you today? Access instant support, speak to a specialist, or explore our knowledge base.
                    </p>
                </div>

                <div className="care-grid-container">
                    {carePillars.map((pillar) => (
                        <CareCard key={pillar.id} pillar={pillar} />
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CustomerCareComponent;