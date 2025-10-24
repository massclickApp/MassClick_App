import React, { useEffect } from "react";
import "./trendingCard.css";
import CardDesign from "../../clientComponent/cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../redux/actions/businessListAction.js";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const TrendingCards = () => {
    const { categorySlug } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const normalizedSlug = categorySlug?.replace(/-/g, " ").trim().toLowerCase();

    const filteredBusinesses = businessList.filter((b) => {
        if (!b.category) return false;

        const category = b.category.toLowerCase();

        return (
            category.includes(normalizedSlug) ||                      // partial match
            normalizedSlug.includes(category) ||                      // reverse match
            new RegExp(`${normalizedSlug.slice(0, 4)}`, "i").test(category) // fuzzy match on first 4 letters
        );
    });
    const createSlug = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    if (filteredBusinesses.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No filteredBusinesses Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "filteredBusinesses"  in our data right now.
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
                {filteredBusinesses.length === 0 ? (
                    <p>No matching businesses found for "{categorySlug}".</p>
                ) : (
                    filteredBusinesses.map((business) => {
                        const averageRating = business.averageRating?.toFixed(1) || 0;
                        const totalRatings = business.reviews?.length || 0;
                        const nameSlug = createSlug(business.businessName);
                        const locationSlug = createSlug(business.locationDetails?.split(',')[0] || 'unknown');

                        return (
                            <CardDesign
                                key={business._id}
                                title={business.businessName}
                                phone={business.contact}
                                whatsapp={business.whatsappNumber}
                                address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                                details={`Experience: ${business.experience} | Category: ${business.category}`}
                                imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                                rating={averageRating}
                                reviews={totalRatings}
                            to={`/business/${nameSlug}/${locationSlug}/${business._id}`}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
};



export default TrendingCards;
