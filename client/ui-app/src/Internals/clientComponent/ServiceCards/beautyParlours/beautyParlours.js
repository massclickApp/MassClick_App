import React, { useEffect } from "react";
import "./beautyParlours.css";
import CardDesign from "../../cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../../clientComponent/CardsSearch/CardsSearch.js";



const BeautyParloursCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);


    const beautyParlours = businessList.filter(
        (b) =>
            b.category &&
            /\bbeauty\s*parlou?r\b/i.test(b.category)
    );

    if (beautyParlours.length === 0) {
        return <p>No matching businesses found with the name "BeautyParlours".</p>;
    }

    return (
        <>
            <CardsSearch /><br/><br/><br/>

            <div className="restaurants-list-wrapper">
                {beautyParlours.map((business) => {

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

export default BeautyParloursCards;
