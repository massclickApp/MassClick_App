import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CardsSearch.css";

import { getAllLocation } from "../../../redux/actions/locationAction";
import { getAllBusinessList, getAllSearchLogs, logSearchActivity } from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import Tooltip from "@mui/material/Tooltip";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import MI from "../../../assets/Mi.png";
import AddBusinessModel from "../AddBusinessModel";

const LocationDropdown = ({ options, setLocationName, closeDropdown }) => {
  const MAX_HEIGHT_PX = 200;
  const handleOptionClick = (label) => {
    setLocationName(label);
    closeDropdown();
  };
  return (
    <div className="location-custom-dropdown">
      <div className="dropdown-header" onClick={closeDropdown}>
        <LocationOnIcon style={{ verticalAlign: 'middle', marginRight: '4px' }} />
        Detect Location
      </div>
      <div className="trending-label">TRENDING AREAS</div>
      <div className="options-list-container" style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}>
        {options.map((option, index) => (
          <div
            key={index}
            className="option-item"
            onClick={() => handleOptionClick(option.label)}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', cursor: 'pointer' }}

          >
            <LocationSearchingIcon style={{ marginRight: '6px', color: '#ff7b00' }} />

            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const CategoryDropdown = ({ options, setSearchTerm, closeDropdown }) => {
  const MAX_HEIGHT_PX = 200;

  const handleOptionClick = (value) => {
    setSearchTerm(value);
    closeDropdown();
  };

  if (options.length === 0) return null;

  return (
    <div className="category-custom-dropdown">
      <div className="trending-label">RECENT SEARCHES</div>
      <div className="options-list-container" style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}>
        {options.map((option, index) => (
          <div
            key={index}
            className="option-item"
            onClick={() => handleOptionClick(option)}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', cursor: 'pointer' }}
          >
            <HistoryToggleOffIcon style={{ marginRight: '6px', color: '#ff7b00' }} />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const CardsSearch = ({ locationName: propLocationName, setLocationName: propSetLocationName, setSearchResults }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const locationRef = useRef(null);
  const categoryRef = useRef(null);

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
  const { searchLogs, businessList = [] } = businessListState;
  const { category = [] } = categoryState;

  // Local state
  const [internalLocationName, setInternalLocationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locationName = propLocationName !== undefined ? propLocationName : internalLocationName;
  const setLocationName = propSetLocationName !== undefined ? propSetLocationName : setInternalLocationName;


  useEffect(() => {
    dispatch(getAllLocation());
    dispatch(getAllBusinessList());
    dispatch(getAllCategory());
    dispatch(getAllSearchLogs());

  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationRef, categoryRef]);

  const allLocationIds = businessList
    .map(loc => (typeof loc.location === "object" ? loc.location.en : loc.location))
    .filter(Boolean);

  const locationOptions = location
    .filter(loc => allLocationIds.includes(loc._id.$oid || loc._id))
    .map(loc => ({
      value: loc._id.$oid || loc._id,
      label: `${loc.addressLine1},${loc.city}, ${loc.state}`
    }));

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };
  const categoryOptions = [...new Set(
    businessListState.searchLogs.map(log => capitalizeWords(log.categoryName))
  )].filter(Boolean);

  const handleSearch = (e) => {
    e.preventDefault();

    const finalSearchTerm = searchTerm;

    const logCategory = categoryName || finalSearchTerm || 'All Categories';
    const logLocation = locationName || 'Global';

    dispatch(logSearchActivity(logCategory, logLocation));

    const selectedLocation = locationOptions.find(
      (loc) => loc.label === locationName
    );
    const selectedLocationId = selectedLocation ? selectedLocation.value : null;

    const filteredBusinesses = businessList.filter((business) => {
      const matchesSearchTerm =
        !finalSearchTerm ||
        (business.category && business.category.toLowerCase().includes(finalSearchTerm.toLowerCase())) ||
        (business.businessName && business.businessName.toLowerCase().includes(finalSearchTerm.toLowerCase()));

      const matchesCategory =
        !categoryName ||
        (business.category && business.category.toLowerCase() === categoryName.toLowerCase());

      const matchesLocation =
        !selectedLocationId ||
        (business.location === selectedLocationId);

      return matchesSearchTerm && matchesCategory && matchesLocation;
    });

    if (setSearchResults) setSearchResults(filteredBusinesses);

    const loc = (locationName || 'All').replace(/\s+/g, '');
    const cat = (categoryName || 'All').replace(/\s+/g, '');
    const term = (finalSearchTerm || 'All').replace(/\s+/g, '');

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
              <Tooltip title="Go to Home Page" arrow placement="bottom">

                <img src={MI} alt="Logo"
                  className="logo-image"
                  onClick={() => (window.location.href = "/home")}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                />
              </Tooltip>

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
            <div className="input-group location-group" ref={locationRef}>
              <LocationOnIcon className="input-adornment start" />
              <input
                className="custom-input"
                placeholder="Location"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onFocus={() => setIsLocationDropdownOpen(true)}
              />
              {isLocationDropdownOpen && (
                <LocationDropdown
                  options={locationOptions}
                  setLocationName={setLocationName}
                  closeDropdown={() => setIsLocationDropdownOpen(false)}
                />
              )}
            </div>

            <div className="input-group search-group" ref={categoryRef}>
              <input
                className="custom-input"
                placeholder="Search for Spa, Salons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsCategoryDropdownOpen(true)}

              />
              {isCategoryDropdownOpen && searchTerm.length < 1 && (
                <CategoryDropdown
                  options={categoryOptions}
                  setSearchTerm={setSearchTerm}
                  closeDropdown={() => setIsCategoryDropdownOpen(false)}
                />
              )}
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
