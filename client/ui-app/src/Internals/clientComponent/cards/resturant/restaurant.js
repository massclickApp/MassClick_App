import React, { useEffect, useRef, useCallback } from "react";

import "./restuarants.css";

import CardDesign from "../cards.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import TopBannerAds from "../../banners/topBanner/topBanner.js";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../../redux/actions/businessListAction.js";
import { clientLogin } from "../../../../redux/actions/clientAuthAction.js";

import { useNavigate } from "react-router-dom";

const RestaurantsCards = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const hasFetchedRef = useRef(false);

  const hasLoginTriggeredRef = useRef(false);

  const { categoryBusinessList = [], loading, error } = useSelector(
    (state) => state.businessListReducer || {}
  );

  const clientToken = useSelector(
    (state) => state.clientAuth?.accessToken
  );

  useEffect(() => {
    if (!clientToken && !hasLoginTriggeredRef.current) {
      hasLoginTriggeredRef.current = true;
      dispatch(clientLogin());
      return;
    }

    if (clientToken && !hasFetchedRef.current) {
      dispatch(getBusinessByCategory("restaurant"));
      hasFetchedRef.current = true;
    }
  }, [dispatch, clientToken]);

 
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [clientToken]);

 
  const createSlug = useCallback((text) => {
    if (!text || typeof text !== "string") return "unknown";

    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "unknown"
    );
  }, []);

  
  if (error) {
    return (
      <div className="no-results-container">
        <p className="no-results-title">Something went wrong 😕</p>
        <p className="no-results-suggestion">
          Please refresh the page or try again later.
        </p>
        <button
          className="go-home-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <CardsSearch />

      <br /><br /><br /><br />
      
      <TopBannerAds category="Restaurants" />

      {loading && (
        <p className="loading-text">Loading restaurants...</p>
      )}

      {!loading && categoryBusinessList.length === 0 && (
        <div className="no-results-container">
          <p className="no-results-title">No Restaurants Found Yet 😔</p>
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

          const slug = createSlug(
            `${business.location}-${business.businessName}-${business._id}`
          );

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
              to={`/business/${slug}`}
              state={{ id: business._id }} 
            />
          );
        })}
      </div>
    </>
  );
};

export default RestaurantsCards;
