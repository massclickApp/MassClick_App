import React, { useRef } from 'react';
import './CardCarousel.css';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import Cctv from "../../../assets/Popular/CCTV.png"
import Education from "../../../assets/Popular/Education.png"
import HotelRoom from "../../../assets/Popular/HotelRoom.png"
import Photography from "../../../assets/Popular/Photography.png"


const cardsData = [
    { title: 'CCTV', image: Cctv, buttonText: 'Enquire Now', color: '#E67E22', alt: 'CCTV camera installation' },
    { title: 'Hotels', image: HotelRoom, buttonText: 'Enquire Now', color: '#E67E22', alt: 'Modern hotel room' },
    { title: 'Photography', image: Photography, buttonText: 'Enquire Now', color: '#E67E22', alt: 'Photographer with camera' },
    { title: 'Education', image: Education, buttonText: 'Enquire Now', color: '#E67E22', alt: 'Graduation scroll' },
    // Added a couple more for better scroll testing on large screens
    { title: 'Logistics', image: Cctv, buttonText: 'Enquire Now', color: '#5DADE2', alt: 'Logistics and delivery' }, 
    { title: 'Consulting', image: HotelRoom, buttonText: 'Enquire Now', color: '#2ECC71', alt: 'Business consulting' },
];

const CardCarousel = () => {
    const containerRef = useRef(null);

    const scrollByCard = (direction) => {
        if (containerRef.current) {
            // Find the width of the first card to calculate scroll distance
            const cardElement = containerRef.current.querySelector('.card');
            // Use a fallback of 320px if card width can't be found
            const cardWidth = cardElement ? cardElement.offsetWidth : 320; 
            
            // Scroll distance is card width plus the CSS gap (20px)
            const scrollAmount = cardWidth + 20; 
            const offset = direction === 'right' ? scrollAmount : -scrollAmount;

            containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <div className="carousel-container">
            {/* Title from your image - styled to be bold and centered */}
            <h2 className="section-title text-3xl font-bold text-gray-800 text-center mb-6">Popular Searches</h2>

            {/* Left Arrow */}
            <button 
                className="nav-arrow left" 
                onClick={() => scrollByCard('left')} 
                aria-label="Scroll Left"
            >
                <KeyboardDoubleArrowLeftIcon style={{ fontSize: '2rem' }} />
            </button>

            {/* Cards Wrapper (Scrollable Area) */}
            <div className="cards-wrapper" ref={containerRef}>
                {cardsData.map((card, index) => (
                    <div className="card" key={index}>
                        <div className="card-image-wrapper">
                            <img 
                                src={card.image} 
                                alt={card.alt} 
                                className="card-image"
                                // The original images had the orange color applied as a layer.
                                // For a real-world application, you'd use a color filter/overlay in CSS
                                // or edit the image, but we'll use the original image here.
                            />
                        </div>

                        {/* Apply background color inline from data */}
                        <div className="card-content" style={{ backgroundColor: card.color }}>
                            <h3 className="card-title">{card.title}</h3>
                            <button className="enquire-button">{card.buttonText}</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button 
                className="nav-arrow right" 
                onClick={() => scrollByCard('right')} 
                aria-label="Scroll Right"
            >
                <KeyboardDoubleArrowRightIcon style={{ fontSize: '2rem' }} />
            </button>
        </div>
    );
};

export default CardCarousel;