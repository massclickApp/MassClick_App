import React, { useEffect } from "react";
import "./carService.css";
import CardDesign from "../../cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../../clientComponent/CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";

const CarServiceCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categoryBusinessList = [], loading } = useSelector(
        (state) => state.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getBusinessByCategory("car service"));
    }, [dispatch]);

    const createSlug = (text) => {
        if (!text) return "";
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    if (loading) {
        return <p className="loading-text">Loading car services...</p>;
    }

    if (!loading && categoryBusinessList.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No Car Services Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don’t have any businesses matching “Car Service” in our data right now.
                </p>
                <p className="no-results-action">Please try another category or check back later!</p>
                <button className="go-home-button" onClick={() => navigate("/home")}>
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
                    const avgRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.reviews?.length || 0;

                    const nameSlug = createSlug(business.businessName);
                    const locSlug = createSlug(business.location || "unknown");
                    const addrSlug = createSlug(business.street || "unknown");

                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={business.location}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                            rating={avgRating}
                            reviews={totalRatings}
                            to={`/${locSlug}/${nameSlug}/${addrSlug}/${business._id}`}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default CarServiceCards;
