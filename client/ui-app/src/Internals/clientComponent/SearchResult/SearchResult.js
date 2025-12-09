import React, { useEffect, useState } from "react";
import { Box, Typography, Card } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import CardsSearch from "../CardsSearch/CardsSearch";
import CardDesign from "../cards/cards.js";
import { backendMainSearch } from "../../../redux/actions/businessListAction";
import "./SearchResult.css";

const SearchResults = () => {
  const dispatch = useDispatch();
  const { location: locParam, searchTerm: termParam } = useParams();
  const locationState = useLocation();

  const resultsFromState = locationState.state?.results || [];

  const [results, setResults] = useState(resultsFromState);
  const [loading, setLoading] = useState(false);

  const locationText = locParam?.toString().trim() || "";
  const valueText = termParam?.toString().trim() || "";

  useEffect(() => {
    if (resultsFromState.length > 0) return;

    const fetchData = async () => {
      setLoading(true);
      const action = await dispatch(
        backendMainSearch(valueText, locationText, valueText)
      );

      setResults(action?.payload || []);
      setLoading(false);
    };

    fetchData();
  }, [valueText, locationText, dispatch, resultsFromState.length]);

  const createSlug = (text) => {
    if (!text) return "unknown";
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "unknown";
  };

  return (
    <>
      <CardsSearch />
      <br /><br />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", pt: 4, pb: 6 }}>
        <Box sx={{ maxWidth: "1200px", margin: "auto", p: 2 }}>

          {loading ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography>Loading...</Typography>
            </Card>
          ) : results.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography>No results found.</Typography>
            </Card>
          ) : (
            <div className="restaurants-list-wrapper">
              {results.map((business) => {
                const slug = createSlug(
                  `${business.businessName}-${business.street}-${business.location}`
                );

                const finalUrl = `/business/${slug}`;

                return (
                  <CardDesign
                    key={business._id}
                    title={business.businessName}
                    phone={business.contact}
                    whatsapp={business.whatsappNumber}
                    address={business.locationDetails || business.location}
                    details={`Experience: ${business.experience || "N/A"
                      } | Category: ${business.category}`}
                    imageSrc={
                      business.bannerImage ||
                      "https://via.placeholder.com/120x100?text=Logo"
                    }
                    rating={business.averageRating || 0}
                    reviews={business.reviews?.length || 0}
                    to={finalUrl}
                    state={{ id: business._id }}

                  />
                );
              })}
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SearchResults;
