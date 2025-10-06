import React, { useEffect } from "react";
import "./trendingCard.css";
import CardDesign from "../../clientComponent/cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../redux/actions/businessListAction.js";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";
import { useParams } from "react-router-dom";

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

const TrendingCards = () => {
    const { categorySlug } = useParams();

    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const filteredBusinesses = businessList.filter((b) =>
        b.category?.toLowerCase().includes(categorySlug?.toLowerCase()) ||
        b.businessName?.toLowerCase().includes(categorySlug?.toLowerCase())
    );
    console.log("categorySlug:", categorySlug);
    console.log("filteredBusinesses:", filteredBusinesses);



    return (
        <>
            <CardsSearch />
            <div className="restaurants-list-wrapper">
                {filteredBusinesses.length === 0 ? (
                    <p>No matching businesses found for "{categorySlug}".</p>
                ) : (
                    filteredBusinesses.map((business) => {
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
                    })
                )}
            </div>
        </>
    );
};



export default TrendingCards;
