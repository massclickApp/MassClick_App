import React, { useEffect } from "react";
import "./trendingCard.css";
import CardDesign from "../../clientComponent/cards/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../../redux/actions/businessListAction.js";
import CardsSearch from "../../clientComponent/CardsSearch/CardsSearch.js";
import { useParams } from "react-router-dom";


const TrendingCards = () => {
    const { categorySlug } = useParams();

    const dispatch = useDispatch();
    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    )

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

const normalizedSlug = categorySlug?.replace(/-/g, " ").trim().toLowerCase();

const filteredBusinesses = businessList.filter((b) => {
  if (!b.category) return false;

  const category = b.category.toLowerCase();

  return (
    category.includes(normalizedSlug) ||                      // partial match
    normalizedSlug.includes(category) ||                      // reverse match
    new RegExp(`${normalizedSlug.slice(0, 4)}`, "i").test(category) // fuzzy match on first 4 letters
  );
});

console.log("categorySlug:", categorySlug);
console.log("filteredBusinesses:", filteredBusinesses);





    return (
        <>
            <CardsSearch /><br/><br/><br/>
            <div className="restaurants-list-wrapper">
                {filteredBusinesses.length === 0 ? (
                    <p>No matching businesses found for "{categorySlug}".</p>
                ) : (
                    filteredBusinesses.map((business) => {
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
                    })
                )}
            </div>
        </>
    );
};



export default TrendingCards;
