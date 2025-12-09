import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./popularCategories.css";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../redux/actions/businessListAction";
import CardsSearch from "../CardsSearch/CardsSearch";
import CardDesign from "../cards/cards";

const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "unknown";

export default function PopularCategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const readableCategory = categorySlug.replace(/-/g, " ");

  const { categoryBusinessList = [], loading } = useSelector(
    (s) => s.businessListReducer || {}
  );

  useEffect(() => {
    if (categorySlug) {
      dispatch(getBusinessByCategory(readableCategory));
    }
  }, [dispatch, categorySlug]);

  if (loading) {
    return <p className="loading-text">Loading results...</p>;
  }

  if (!loading && categoryBusinessList.length === 0) {
    return (
      <div className="no-results-container">
        <p className="no-results-title">No {readableCategory} Found Yet 😔</p>
        <p className="no-results-suggestion">
          It looks like we don't have any businesses matching {readableCategory} in
          our data right now.
        </p>
        <button className="go-home-button" onClick={() => navigate("/home")}>
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <>
      <CardsSearch />
      <br /><br /><br />

      <div className="restaurants-list-wrapper">
        {categoryBusinessList.map((business) => {
          const nameSlug = slugify(business.businessName);
          const addressSlug = slugify(business.street || "unknown");
          const locationSlug = slugify(business.location || "unknown");

          const slug = `${nameSlug}-${addressSlug}-${locationSlug}`;
          const businessUrl = `/business/${slug}`;

          const averageRating = business.averageRating?.toFixed(1) || 0;
          const totalRatings = business.reviews?.length || 0;

          return (
            <CardDesign
              key={business._id}
              title={business.businessName}
              phone={business.contact}
              whatsapp={business.whatsappNumber}
              address={`${business.location}`}
              details={`Experience: ${business.experience} | Category: ${business.category}`}
              imageSrc={
                business.bannerImage ||
                "https://via.placeholder.com/120x100?text=Logo"
              }
              rating={averageRating}
              reviews={totalRatings}
              to={businessUrl}          
              state={{ id: business._id }} 
            />
          );
        })}
      </div>
    </>
  );
}
