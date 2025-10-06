import React from 'react';
import './popularCategories.css';

const popularSearches = [
    'Dealers', 'Mandapam', 'Pediatric Hospital', 'Color Therapy', 'Ultrasound Scan', 
    'Homeo Clinic', 'Interior Designer', 'Live Music Concert', 'Tattoo Shop', 
    'Boutique Halls', 'Catering Services', 'Women Beauty Salon', 'Naturopathy', 
    'Aariworks Services', 'Moles and Warts', 'Yenp', 'Visa Booking', 'Janavasam', 
    'Shop', 'Wholesale Dealers', 'Pre Wedding Photography', 'Interlock Bricks', 
    'Band Music', 'Acupuncture', 'Mosquito Net', 'Neurology and Neuro Surgery', 
    'M Sand', 'Events', 'Mixer Repair Services', 'Gas Cylinder Services', 
    'Health Check Up', 'Dental Care', 'Paediatric Ortho', 'GATE Coaching Center', 
    'Skin Discolouration', 'Mehendi Artist', 'Saree Polishing', 'Medical Lab', 
    'Air Therapy', 'Melam', 'Crane Service', 'Creative Photography Services', 
    'Multi Speciality Hospital', 'Granites Marbles', 'Steel Dealer', 'Air Travels', 
    'Bridal Hairstyles', 'Mammography', 'Bridal Jewels rental services', 'Hospital'
];

const PopularCategories = () => {
    return (
        <div className="popular-categories-container-text">
            {/* The heading uses the orange color from your image */}
            <h2 className="popular-categories-heading-text">Popular Search</h2>
            <div className="search-links-wrapper">
                {popularSearches.map((link, index) => (
                    // We render the link followed by a separator except for the last one
                    <React.Fragment key={index}>
                        <a 
                            href={`/search?q=${link.toLowerCase().replace(/ /g, '-')}`} 
                            className="search-link" 
                            title={`Search for ${link}`}
                        >
                            {link}
                        </a>
                        {/* Add the separator pipe if it's not the last item */}
                        {index < popularSearches.length - 1 && (
                            <span className="link-separator"> | </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PopularCategories;