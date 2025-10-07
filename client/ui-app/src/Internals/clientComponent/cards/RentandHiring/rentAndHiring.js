import React, { useEffect } from "react";
import "./rentAndHiring.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";



const RentAndHiringCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);


   const rentAndHiring = businessList.filter(b => 
    b.category && 
    ["rent", "hiring"].includes(b.category.toLowerCase())
);

    if (rentAndHiring.length === 0) {
        return <p>No matching businesses found with the name "Rent And Hiring".</p>;
    }

    return (
        <>
            <CardsSearch />

            <div className="restaurants-list-wrapper">
                {rentAndHiring.map((business) => {

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

export default RentAndHiringCards;
