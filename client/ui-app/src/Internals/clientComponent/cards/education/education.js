import React, { useEffect } from "react";
import "./education.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from 'react-router-dom';


const EducationCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );
    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);


    const education = businessList.filter(
        (b) =>
            b.category &&
            b.category.toLowerCase().includes("Education".toLowerCase())
    );
    if (education.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">No education Found Yet 😔</p>
                <p className="no-results-suggestion">
                    It looks like we don't have any businesses matching "education"  in our data right now.
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
                {education.map((business) => {
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

export default EducationCards;
