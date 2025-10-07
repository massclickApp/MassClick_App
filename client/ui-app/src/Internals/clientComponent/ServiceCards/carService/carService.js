import React, { useEffect } from "react";
import "./carService.css";
import CardDesign from "../../cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../../clientComponent/CardsSearch/CardsSearch.js";


const CarServiceCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);



    const carServices = businessList.filter(
        (b) =>
            b.category &&
            b.category.toLowerCase().includes("car service".toLowerCase())
    );

    if (carServices.length === 0) {
        return <p>No matching businesses found with the name "CarServices".</p>;
    }

    return (
        <>
            <CardsSearch />

            <div className="restaurants-list-wrapper">
                {carServices.map((business) => {

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

export default CarServiceCards;
