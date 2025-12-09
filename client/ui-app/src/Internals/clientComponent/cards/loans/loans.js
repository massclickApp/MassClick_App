import React, { useEffect } from "react";
import "./loans.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";

const LoansCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categoryBusinessList = [], loading } = useSelector(
        (state) => state.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getBusinessByCategory("loan"));
    }, [dispatch]);

    const createSlug = (text) => {
        if (!text) return "";
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    if (loading) {
        return <p className="loading-text">Loading loan services...</p>;
    }

    if (!loading && categoryBusinessList.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No Loan Services Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don’t have any loan or finance-related businesses in our data right now.
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
                            address={business.location}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={
                                business.bannerImage ||
                                "https://via.placeholder.com/120x100?text=Logo"
                            }
                            rating={averageRating}
                            reviews={totalRatings}
                            to={businessUrl}
                            state={{ id: business._id }}  
                        />
                    );
                })}
            </div>
        </>
    );
};

export default LoansCards;
