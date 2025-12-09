import React, { useEffect } from "react";
import "./restuarants.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";

const RestaurantsCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categoryBusinessList = [], loading } = useSelector(
        (state) => state.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getBusinessByCategory("restaurant"));
    }, [dispatch]);

    const createSlug = (text) => {
        if (!text || typeof text !== "string") return "unknown";

        const slug = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        return slug || "unknown";
    };

    if (loading) {
        return <p className="loading-text">Loading restaurants...</p>;
    }

    if (!loading && categoryBusinessList.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No Restaurants Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "restaurants"
                    in our data right now.
                </p>
                <p className="no-results-action">
                    Please try another category or check back later!
                </p>
                <button
                    className="go-home-button"
                    onClick={() => navigate("/home")}
                >
                    Go to Homepage
                </button>
            </div>
        );
    }

    return (
        <>
            <CardsSearch />
            <br /><br /><br />

            <div className="restaurants-list-wrapper">
                {categoryBusinessList.map((business) => {
                    const averageRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.reviews?.length || 0;

                    const slug = createSlug(
                        `${business.businessName}-${business.location}`
                    );

                    const businessUrl = `/business/${business._id}/${slug}`;

                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={`${business.location}`}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={
                                business.bannerImage ||
                                "https://via.placeholder.com/120x100?text=Logo"
                            }
                            rating={averageRating}
                            reviews={totalRatings}
                            to={businessUrl}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default RestaurantsCards;
