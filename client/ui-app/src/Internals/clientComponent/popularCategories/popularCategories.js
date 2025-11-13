import React, { useEffect } from "react";
import './popularCategories.css';
import { useDispatch } from "react-redux";
import { getAllClientBusinessList } from "../../../redux/actions/businessListAction";
import { useNavigate } from "react-router-dom"; 

const popularSearches = [
    'Dealers','Gym', 'Mandapam', 'Pediatric Hospital', 'Color Therapy', 'Ultrasound Scan', 
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllClientBusinessList());
    }, [dispatch]);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.toLowerCase().replace(/ /g, '-')}`);
    };

    return (
        <div className="popular-categories-container-text">
            <h2 className="popular-categories-heading-text">Popular Search</h2>
            <div className="search-links-wrapper">
                {popularSearches.map((link, index) => (
                    <React.Fragment key={index}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(link);
                            }}
                            className="search-link"
                            title={`Search for ${link}`}
                        >
                            {link}
                        </a>
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
