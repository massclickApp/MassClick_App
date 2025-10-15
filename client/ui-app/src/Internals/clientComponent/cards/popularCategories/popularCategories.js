import React, { useEffect } from "react";
import "./popularCategories.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";

const buildImageSrc = (base64String, defaultType = "webp") => {
    if (!base64String) {
        return "https://via.placeholder.com/120x100?text=Logo";
    }

    const clean = base64String.replace(/[\r\n\s]/g, "");

    if (clean.startsWith("data:")) return clean;

    let mimeType = defaultType;
    if (clean.startsWith("/9j")) mimeType = "jpeg";
    else if (clean.startsWith("iVBOR")) mimeType = "png";

    return `data:image/${mimeType};base64,${clean}`;
};

const PopularCategoriesCards = () => {
    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const popularCategories = businessList.filter((b) =>
        b.businessName?.toLowerCase().includes("Popular Categories".toLowerCase())
    );

    if (popularCategories.length === 0) {
        return <p>No matching businesses found with the name "PopularCategories".</p>;
    }

    return (
        <>
            <CardsSearch /><br/><br/><br/>

            <div className="restaurants-list-wrapper">
                {popularCategories.map((business) => {
                    const imageSource = buildImageSrc(business.bannerImage);

                    return (
                        <CardDesign
                            key={business._id}
                            title={business.businessName}
                            phone={business.contact}
                            whatsapp={business.whatsappNumber}
                            address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                            details={`Experience: ${business.experience} | Category: ${business.category}`}
                            imageSrc={imageSource}
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

export default PopularCategoriesCards;
