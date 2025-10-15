import React, { useEffect } from "react";
import "./restuarants.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";


const RestaurantsCards = () => {
    const dispatch = useDispatch();
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


    if (restaurants.length === 0) {
        return <p>No matching businesses found with the name "Restaurant".</p>;
    }

    return (
        <>
            <CardsSearch /><br/><br/><br/>
            <div className="restaurants-list-wrapper">
                {restaurants.map((business) => {
                    const averageRating = business.averageRating?.toFixed(1) || 0;
                    const totalRatings = business.ratings?.length || 0;
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

export default RestaurantsCards;
