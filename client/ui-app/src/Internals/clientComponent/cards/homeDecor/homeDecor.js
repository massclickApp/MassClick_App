import React, { useEffect } from "react";
import "./homeDecor.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";



const HomeDecorCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );
    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);


    const homeDecor = businessList.filter(
        (b) =>
            b.category &&
            b.category.toLowerCase().includes("home decoration".toLowerCase())
    );
    if (homeDecor.length === 0) {
        return <p>No matching businesses found with the name "Home Decorations".</p>;
    }
    return (
        <>
            <CardsSearch /><br/><br/><br/>

            <div className="restaurants-list-wrapper">
                {homeDecor.map((business) => {

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

export default HomeDecorCards;
