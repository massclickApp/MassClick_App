import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CardDesign from "../cards/cards";
import CardsSearch from "../CardsSearch/CardsSearch";
import { useNavigate } from 'react-router-dom';

const PopularCategoryPage = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();

    const { businessList = [] } = useSelector(state => state.businessListReducer || {});
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    useEffect(() => {
        if (!categorySlug) return;

        const categoryWords = categorySlug.toLowerCase().split('-');

        const filtered = businessList.filter(b => {
            if (!b.businessName && !b.category) return false;

            const categoryLower = (b.category || '').toLowerCase();
            const nameLower = (b.businessName || '').toLowerCase();

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
                        {filteredBusinesses.map(business => {
                            const averageRating = business.averageRating?.toFixed(1) || 0;
                            const totalRatings = business.reviews?.length || 0;

                            return (
                                <CardDesign
                                    key={business._id}
                                    title={business.businessName}
                                    phone={business.contact}
                                    whatsapp={business.whatsappNumber}
                                    address={`${business.plotNumber ? business.plotNumber + ", " : ""}${business.street}, ${business.location}, Pincode: ${business.pincode}`}
                                    details={`Experience: ${business.experience || "N/A"} | Category: ${business.category || "N/A"}`}
                                    imageSrc={business.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
                                    rating={averageRating}
                                    reviews={totalRatings}
                                    to={`/business/${business._id}`}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results-container">
                        <p className="no-results-title">No {categorySlug.replace(/-/g, ' ')} Found Yet 😔</p>
                        <p className="no-results-suggestion">
                            It looks like we don't have any businesses matching {categorySlug.replace(/-/g, ' ')}  in our data right now.
                        </p>
                        <p className="no-results-action">
                            Please try another category or check back later!
                        </p>
                        <button className="go-home-button" onClick={() => navigate('/home')}>Go to Homepage</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PopularCategoryPage;
