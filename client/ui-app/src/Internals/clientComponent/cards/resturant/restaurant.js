import React, { useEffect } from "react";
import "./restuarants.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from 'react-router-dom';


const RestaurantsCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const restaurants = businessList.filter(
        (b) =>
            b.category &&
            b.category.toLowerCase().includes("restaurants".toLowerCase())
    );

    const createSlug = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') 
            .replace(/(^-|-$)+/g, '');   
    };

    if (restaurants.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No restaurants Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "restaurants"  in our data right now.
                </p>
                <p className="no-results-action">
                    Please try another category or check back later!
                </p>
                <button className="go-home-button" onClick={() => navigate('/home')}>Go to Homepage</button>
            </div>
        );
    }

    return (
        <>
            <CardsSearch /><br /><br /><br />
            <div className="restaurants-list-wrapper">
                {restaurants.map((business) => {
                    const averageRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.ratings?.length || 0;
                    const nameSlug = createSlug(business.businessName);
                    const locationSlug = createSlug(business.locationDetails?.split(',')[0] || 'unknown');
                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={`${business.locationDetails}`}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                            rating={averageRating}
                            reviews={totalRatings}
                            to={`/business/${nameSlug}/${locationSlug}/${business._id}`}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default RestaurantsCards;
