import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CardDesign from "../cards/cards";
import CardsSearch from "../CardsSearch/CardsSearch";

const PopularCategoryPage = () => {
    const { categorySlug } = useParams();
    const { businessList = [] } = useSelector(state => state.businessListReducer || {});
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    useEffect(() => {
        if (!categorySlug) return;

        const categoryWords = categorySlug.toLowerCase().split('-');

       const filtered = businessList.filter(b => {
    if (!b.businessName && !b.category) return false;

    const categoryLower = (b.category || '').toLowerCase();
    const nameLower = (b.businessName || '').toLowerCase();

    // If any word in the clicked category exists in the business name or category
    return categoryWords.some(word =>
        categoryLower.includes(word) || nameLower.includes(word)
    );
});


        setFilteredBusinesses(filtered);
    }, [categorySlug, businessList]);

    return (
        <>
            <CardsSearch /><br /><br /><br />
            <div style={{ padding: "20px" }}>
                {filteredBusinesses.length > 0 ? (
                    <div className="restaurants-list-wrapper">
                        {filteredBusinesses.map(business => (
                            <CardDesign
                                key={business._id}
                                title={business.businessName}
                                phone={business.contact}
                                whatsapp={business.whatsappNumber}
                                address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                                details={`Experience: ${business.experience || "N/A"} | Category: ${business.category || "N/A"}`}
                                imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                                rating="4.5"
                                reviews="250"
                                to={`/business/${business._id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No businesses found for "{categorySlug.replace(/-/g, ' ')}"</p>
                )}
            </div>
        </>
    );
};

export default PopularCategoryPage;
