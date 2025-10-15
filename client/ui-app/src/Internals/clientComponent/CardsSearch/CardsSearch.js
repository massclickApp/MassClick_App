import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CardsSearch.css";

import { getAllLocation } from "../../../redux/actions/locationAction";
import { getAllBusinessList } from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";

import MI from "../../../assets/Mi.png";
import AddBusinessModel from "../AddBusinessModel"; 

const CardsSearch = ({ locationName, setLocationName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const locationState = useSelector(
    (state) => state.locationReducer || { location: [] }
  );
  const businessListState = useSelector(
    (state) => state.businessListReducer || { businessList: [] }
  );
  const categoryState = useSelector(
    (state) => state.categoryReducer || { category: [] }
  );

  const { location = [] } = locationState;
  const { businessList = [] } = businessListState;
  const { category = [] } = categoryState;

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllLocation());
    dispatch(getAllBusinessList());
    dispatch(getAllCategory());
  }, [dispatch]);

  const locationOptions = location.map((loc) => ({
    label: typeof loc.city === "object" ? loc.city.en : loc.city,
    id: loc._id,
  }));
 

  const handleSearch = () => {
    const filteredBusinesses = businessList.filter((business) => {
      const matchesSearchTerm =
        !searchTerm ||
        (business.category &&
          business.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        !categoryName ||
        (business.category &&
          business.category.toLowerCase().includes(categoryName.toLowerCase()));

      const matchesLocation =
        !locationName ||
        (business.location &&
          business.location.toLowerCase().includes(locationName.toLowerCase()));

      return matchesSearchTerm && matchesCategory && matchesLocation;
    });

    const loc = (locationName || "All").replace(/\s+/g, "");
    const cat = (categoryName || "All").replace(/\s+/g, "");
    const term = (searchTerm || "All").replace(/\s+/g, "");

    navigate(`/${loc}/${cat}/${term}`, { state: { results: filteredBusinesses } });
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <header
        className={`search-header ${isVisible ? "visible" : ""}`}
        style={{ backdropFilter: isVisible ? "blur(8px)" : "none" }}
      >
        <div className="search-header-content">
          <div className="logo-section">
            <div className="logo-circle">
              <img src={MI} alt="Logo" className="logo-image" />
            </div>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                  letterSpacing: "0.5px",
                  lineHeight: 1.1,
                  background: "linear-gradient(45deg, #FF8C00, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Mass<span>click</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.9rem" },
                  color: "text.secondary",
                  fontWeight: 400,
                  mt: 0.5,
                }}
              >
                India's Leading Local Search Engine
              </Typography>
            </Box>
          </div>

          {/* Search Inputs */}
          <div className="search-area">
            {/* Location Input */}
            <div className="search-input location">
              <i className="fa-solid fa-location-dot icon start-icon"></i>
              <input
                type="text"
                placeholder="Location"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                list="locationOptions"
              />
              <datalist id="locationOptions">
                {locationOptions.map((opt, i) => (
                  <option key={i} value={opt.label} />
                ))}
              </datalist>
            </div>

            {/* Main Search Input */}
            <div className="search-input main">
              <input
                type="text"
                placeholder="Search for Spa, Salons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <MicIcon className="input-adornment end" />
            </div>

            {/* Search Button */}
            <button className="search-btn" onClick={handleSearch}>
              <span>Search</span> <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Add Business Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              display: { xs: "none", md: "flex" },
              background: "linear-gradient(45deg, #FF6F00, #F7941D)",
              color: "white",
              textTransform: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              borderRadius: "30px",
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 1, sm: 1.2 },
              whiteSpace: "nowrap",
              boxShadow: "0 10px 30px rgba(255, 123, 0, 0.4)",
              "&:hover": {
                background: "linear-gradient(45deg, #cc5a0f, #ff8a2d)",
                boxShadow: "0 15px 40px rgba(255, 123, 0, 0.5)",
              },
            }}
          >
            Add Your Business
          </Button>
        </div>

        {/* Modal */}
        <AddBusinessModel open={isModalOpen} handleClose={handleCloseModal} />
      </header>
    </>
  );
};

export default CardsSearch;
