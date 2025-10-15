import React, { useEffect } from "react";
import "./beautySpa.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";



const BeautySpaCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );
    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const keywords = ["beauty", "spa", "parlour", "salon", "beauty parlour"];

    const beautyBusinesses = businessList.filter((b) => {
        if (!b.businessName) return false;
        const name = b.businessName.toLowerCase();
        return keywords.some((keyword) => name.includes(keyword.toLowerCase()));
    });

    if (beautyBusinesses.length === 0) {
        return <p>No matching businesses found for Beauty/ Spa/ Parlour/ Salon.</p>;
    }

    return (
        <>
            <CardsSearch /><br/><br/><br/>

            <div className="restaurants-list-wrapper">
                {beautyBusinesses.map((business) => {

                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                            rating="4.5"
                            reviews="250"
                            to={`/business/${business._id}`}

                        />
                    );
                })}
            </div>
        </>
    );
};

export default BeautySpaCards;
