import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./SearchResult.css";

import CardsSearch from "../CardsSearch/CardsSearch";
import CardDesign from "../cards/cards.js";
import SeoMeta from "../seo/seoMeta.js";

import { backendMainSearch } from "../../../redux/actions/businessListAction";
import { fetchSeoMeta } from "../../../redux/actions/seoAction.js";
import { fetchSeoPageContentMeta } from "../../../redux/actions/seoPageContentAction.js";
import { CLEAR_SEO_META } from "../../../redux/actions/userActionTypes.js";

const createSlug = (text = "") =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

const SearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { location: locParam, searchTerm: termParam } = useParams();
  const locationState = useLocation();

  const locationText = locParam?.trim() || "";
  const searchText = termParam?.trim() || "";

  const { loading, error } = useSelector(
    (state) => state.businessListReducer || {}
  );

  const { meta: seoMetaData } = useSelector(
    (state) => state.seoReducer || {}
  );

  const seoPageContentState = useSelector(
    (state) => state.seoPageContentReducer || {}
  );

  const {
    list: seoPageContents = [],
    loading: seoContentLoading = false,
  } = seoPageContentState;

  const [results, setResults] = useState([]);
  const stateAppliedRef = useRef(false);

  useEffect(() => {
    const resultsFromState = locationState.state?.results;

    if (
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

  useEffect(() => {
    if (!searchText || !locationText) return;
    const normalize = (v = "") => v.toLowerCase().trim();
    dispatch(
      fetchSeoMeta({
        pageType: "category",
        category: normalize(searchText),
        location: normalize(locationText),
      })
    );

  }, [dispatch, searchText, locationText]);

  const handleRetry = useCallback(() => {
    dispatch(
      backendMainSearch(searchText, locationText, searchText)
    );
  }, [dispatch, searchText, locationText]);

  useEffect(() => {
    if (!searchText || !locationText) return;

    dispatch({ type: CLEAR_SEO_META });

    dispatch(
      fetchSeoMeta({
        pageType: "category",
        category: searchText,
        location: locationText,
      })
    );
  }, [dispatch, searchText, locationText]);

  useEffect(() => {
    if (!searchText) return;

    dispatch(
      fetchSeoPageContentMeta({
        pageType: "category",
        category: searchText,
        ...(locationText ? { location: locationText } : {}),
      })
    );
  }, [dispatch, searchText, locationText]);

  // const handleRetry = useCallback(() => {
  //   dispatch(
  //     backendMainSearch(searchText, locationText, searchText)
  //   );
  // }, [dispatch, searchText, locationText]);

  if (error) {
    return (
      <>
        <CardsSearch />
        <div className="no-results-container">
          <p className="no-results-title">Something went wrong 😕</p>
          <button className="go-home-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      </>
    );
  }

  const fallbackSeo = {
    title: `${searchText} in ${locationText} - Massclick`,
    description: `Find the best ${searchText} in ${locationText}.`,
    canonical: `https://massclick.in/${createSlug(locationText)}/${createSlug(
      searchText
    )}`,
  };

  const seoContent = seoPageContents?.[0];

  return (
    <>
      <SeoMeta seoData={seoMetaData} fallback={fallbackSeo} />

      <CardsSearch />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", pt: 6, pb: 8 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>

          {!seoContentLoading && seoContent?.headerContent && (
            <Box sx={{  py: 6 }}>
                <article className="seo-article">
                  <section
                    className="seo-header-content"
                    dangerouslySetInnerHTML={{
                      __html: seoContent.headerContent,
                    }}
                  />
                </article>
            </Box>
          )}

          {loading && <p className="loading-text">Searching businesses...</p>}

          {!loading && results.length === 0 && (
            <div className="no-results-container">
              <p className="no-results-title">No results found 😔</p>
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

              const businessUrl = `/${createSlug(
                business.location
              )}/${createSlug(business.businessName)}/${business._id}`;

              return (
                <CardDesign
                  key={business._id}
                  title={business.businessName}
                  phone={business.contact}
                  whatsapp={business.whatsappNumber}
                  address={business.locationDetails || business.location}
                  rating={averageRating}
                  reviews={business.reviews?.length || 0}
                  imageSrc={
                    business.bannerImage ||
                    "https://via.placeholder.com/120x100?text=Logo"
                  }
                  to={businessUrl}
                />
              );
            })}
          </div>

          {!seoContentLoading && seoContent?.pageContent && (
            <Box sx={{ mt: 8 }}>
              <article className="seo-article">
                <div className="seo-divider" />
                <section
                  className="seo-page-content"
                  dangerouslySetInnerHTML={{
                    __html: seoContent.pageContent,
                  }}
                />
              </article>
            </Box>
          )}

        </Box>
      </Box>
    </>
  );
};

export default SearchResults;
