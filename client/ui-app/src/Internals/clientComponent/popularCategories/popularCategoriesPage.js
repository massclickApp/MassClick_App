import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./popularCategories.css";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../redux/actions/businessListAction";
import { clientLogin } from "../../../redux/actions/clientAuthAction";
import CardsSearch from "../CardsSearch/CardsSearch";
import CardDesign from "../cards/cards";
import TopBannerAds from "../banners/topBanner/topBanner";

const createSlug = (text) => {
  if (typeof text !== "string" || !text.trim()) return "unknown";

  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "unknown"
  );
};

export default function PopularCategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clientToken = useSelector(
    (s) => s.clientAuth?.accessToken
  );

  const { categoryBusinessList = [], loading, error } = useSelector(
    (s) => s.businessListReducer || {}
  );

  const readableCategory = categorySlug
    ?.replace(/-/g, " ")
    .toLowerCase();

  useEffect(() => {
    if (!clientToken) {
      dispatch(clientLogin());
      return;
    }

    if (!categoryBusinessList.length) {
      dispatch(getBusinessByCategory(readableCategory));
    }
  }, [clientToken, categoryBusinessList.length, dispatch]);


  const handleRetry = useCallback(() => {
    dispatch(getBusinessByCategory(readableCategory));
  }, [dispatch]);

  if (loading) {
    return <p className="loading-text">Loading results...</p>;
  }

  if (error) {
    return (
      <div className="no-results-container">
        <p className="no-results-title">Something went wrong 😕</p>
        <p className="no-results-suggestion">
          Please try again later.
        </p>
        <button
          className="go-home-button"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
   <>
      <CardsSearch />

      <div className="page-spacing" />

      <TopBannerAds category={readableCategory} />

      {loading && (
        <p className="loading-text">Loading readableCategory...</p>
      )}

      {!loading && categoryBusinessList.length === 0 && (
        <div className="no-results-container">
          <p className="no-results-title">No {readableCategory} Found 😔</p>
          <p className="no-results-suggestion">
            We don’t have restaurants listed right now.
          </p>
          <button
            className="go-home-button"
            onClick={() => navigate("/home")}
          >
            Go to Homepage
          </button>
        </div>
      )}

      <div className="restaurants-list-wrapper">
        {categoryBusinessList.map((business) => {
          const averageRating =
            typeof business.averageRating === "number"
              ? business.averageRating.toFixed(1)
              : "0.0";

          const totalRatings = business.reviews?.length || 0;

          const locationSlug = createSlug(business.location);
          const businessSlug = createSlug(
            `${business.businessName}-${business.street}`
          );

          const businessUrl = `/${locationSlug}/${businessSlug}/${business._id}`;

          return (
            <CardDesign
              key={business._id}
              title={business.businessName}
              phone={business.contact}
              whatsapp={business.whatsappNumber}
              address={business.location}
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
