import React, { useEffect } from "react";
import "./pgAndHostels.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList, getAllClientBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from 'react-router-dom';


const PgAndHostelsCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { clientBusinessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllClientBusinessList());
    }, [dispatch]);

    const pgAndHostels = clientBusinessList.filter((b) =>
        /pg|hostel/i.test(b.category)
    );


    if (pgAndHostels.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No pgAndHostels Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "pgAndHostels"  in our data right now.
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
                {pgAndHostels.map((business) => {
                    const averageRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.reviews?.length || 0;
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
                            to={`/business/${business._id}`}

                        />
                    );
                })}
            </div>
        </>
    );
};

export default PgAndHostelsCards;
