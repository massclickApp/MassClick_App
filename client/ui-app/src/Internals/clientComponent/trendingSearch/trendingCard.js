import React, { useEffect } from "react";
import "./trendingCard.css";
import CardDesign from "../../clientComponent/cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../redux/actions/businessListAction.js";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";
import { useParams, useNavigate } from "react-router-dom";

const TrendingCards = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { categoryBusinessList = [], loading } = useSelector(
        (state) => state.businessListReducer || {}
    );

    const readableCategory = (categorySlug || "").replace(/-/g, " ").trim();

    useEffect(() => {
        if (categorySlug) {
            dispatch(getBusinessByCategory(readableCategory));
        }
    }, [dispatch, categorySlug]);

    const createSlug = (text = "") =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") || "unknown";

    if (loading) {
        return <p className="loading-text">Loading Trending Services...</p>;
    }

    if (!loading && categoryBusinessList.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">
                    No "{readableCategory}" Found 😔
                </p>
                <p className="no-results-suggestion">
                    We couldn't find any trending services matching "{readableCategory}" right now.
                </p>
                <button className="go-home-button" onClick={() => navigate("/home")}>
                    Go to Homepage
                </button>
            </div>
        );
    }

    return (
        <>
            <CardsSearch /><br /><br /><br />

            <div className="restaurants-list-wrapper">
                {categoryBusinessList.map((business) => {
                    const rating = business.averageRating?.toFixed(1) || 0;
                    const reviews = business.reviews?.length || 0;

                    const nameSlug = createSlug(business.businessName);
                    const addressSlug = createSlug(business.street || "unknown");
                    const locationSlug = createSlug(business.location || "unknown");

                    const slug = `${nameSlug}-${addressSlug}-${locationSlug}`;
                    const businessUrl = `/business/${slug}`;

                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={
                                business.bannerImage ||
                                "https://via.placeholder.com/120x100?text=Logo"
                            }
                            rating={rating}
                            reviews={reviews}
                            to={businessUrl}            
                            state={{ id: business._id }} 
                        />
                    );
                })}
            </div>
        </>
    );
};

export default TrendingCards;
