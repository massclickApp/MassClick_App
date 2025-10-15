import React, { useEffect } from "react";
import "./spaAndMassage.css";
import CardDesign from "../../cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../../clientComponent/CardsSearch/CardsSearch.js";
import { useNavigate } from 'react-router-dom';


const SpaAndMassageCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const keywords = ["beauty", "spa", "parlour", "salon", "beauty parlour"];

    const spaAndMassage = businessList.filter((b) => {
        if (!b.category) return false;
        const name = b.category.toLowerCase();
        return keywords.some((keyword) => name.includes(keyword.toLowerCase()));
    });


    if (spaAndMassage.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No spaAndMassage Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "spaAndMassage"  in our data right now.
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
                {spaAndMassage.map((business) => {
                    const averageRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.reviews?.length || 0;
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
                            to={`/business/${business._id}`}

                        />
                    );
                })}
            </div>
        </>
    );
};

export default SpaAndMassageCards;
