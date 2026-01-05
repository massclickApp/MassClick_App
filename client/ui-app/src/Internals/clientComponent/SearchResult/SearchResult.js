import React, { useEffect, useCallback, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./SearchResult.css";

import CardsSearch from "../CardsSearch/CardsSearch";
import CardDesign from "../cards/cards.js";
import { backendMainSearch } from "../../../redux/actions/businessListAction";


const createSlug = (text) => {
  if (typeof text !== "string" || !text.trim()) return "unknown";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};


const SearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { location: locParam, searchTerm: termParam } = useParams();
  const locationState = useLocation();

  const resultsFromState = locationState.state?.results;

  const { loading, error } = useSelector(
    (state) => state.businessListReducer
  );

  const [results, setResults] = useState([]);

  const locationText = locParam?.toString().trim() || "";
  const searchText = termParam?.toString().trim() || "";

  const stateAppliedRef = useRef(false);

 
  useEffect(() => {
    if (
      resultsFromState &&
      Array.isArray(resultsFromState) &&
      resultsFromState.length > 0 &&
      !stateAppliedRef.current
    ) {
      setResults(resultsFromState);
      stateAppliedRef.current = true;
      return;
    }

    dispatch(
      backendMainSearch(searchText, locationText, searchText)
    ).then((action) => {
      setResults(action?.payload || []);
    });
  }, [searchText, locationText, dispatch]); 


  const handleRetry = useCallback(() => {
    dispatch(
      backendMainSearch(searchText, locationText, searchText)
    );
  }, [dispatch, searchText, locationText]);


  if (error) {
    return (
      <>
        <CardsSearch />
        <div className="no-results-container">
          <p className="no-results-title">Something went wrong 😕</p>
          <p className="no-results-suggestion">
            Please try again later.
          </p>
          <button className="go-home-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      </>
    );
  }


  return (
    <>
      <CardsSearch />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", pt: 4, pb: 6 }}>
        <Box sx={{ maxWidth: "1200px", margin: "auto", p: 2 }}>
          {loading && (
            <p className="loading-text">
              Searching businesses...
            </p>
          )}

          {!loading && results.length === 0 && (
            <div className="no-results-container">
              <p className="no-results-title">No results found 😔</p>
              <p className="no-results-suggestion">
                Try a different keyword or location.
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
            {results.map((business) => {
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
                  address={
                    business.locationDetails || business.location
                  }
                  details={`Experience: ${
                    business.experience || "N/A"
                  } | Category: ${business.category}`}
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
        </Box>
      </Box>
    </>
  );
};

export default SearchResults;
