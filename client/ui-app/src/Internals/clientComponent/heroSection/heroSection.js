import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllClientBusinessList,
  getAllSearchLogs,
  logSearchActivity,
} from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import { logUserSearch } from "../../../redux/actions/otpAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import "./hero.css";



const CategoryDropdown = ({ label, options, onSelect }) => {
  const MAX_HEIGHT_PX = 200;

  if (!options || options.length === 0) return null;

  return (
    <div className="category-custom-dropdown">
      <div className="trending-label">{label}</div>

      <div
        className="options-list-container"
        style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="option-item"
            onClick={() => onSelect(option)}
          >
            {label === "RECENT SEARCHES" ? (
              <HistoryToggleOffIcon className="option-icon" />
            ) : (
              <SearchIcon className="option-icon" />
            )}
            <span className="option-text-main">
              {typeof option === "string" ? option : option.businessName}
            </span>

            {typeof option !== "string" && option.category && (
              <span className="option-text-sub">{option.category}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN HERO SECTION
========================================================= */

const HeroSection = ({
  searchTerm,
  setSearchTerm,
  locationName,
  setLocationName,
  categoryName,
  setCategoryName, // currently not used but kept for future needs
  setSearchResults,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm || "");

  const businessListState = useSelector(
    (state) => state.businessListReducer || { clientBusinessList: [] }
  );
  const { searchLogs = [], clientBusinessList = [] } = businessListState;

  /* ---------------------------------------------------------
     1. INITIAL DATA LOAD
  ---------------------------------------------------------- */
  useEffect(() => {
    dispatch(getAllClientBusinessList());
    dispatch(getAllCategory());
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  /* ---------------------------------------------------------
     2. CLICK OUTSIDE TO CLOSE DROPDOWN
  ---------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------------------------------------------
     3. DEBOUNCE SEARCH TERM FOR SUGGESTIONS
  ---------------------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm || ""), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ---------------------------------------------------------
     4. HELPERS
  ---------------------------------------------------------- */
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Recent searches, derived from logs
  const recentSearchOptions = [
    ...new Set(
      (searchLogs || [])
        .map((log) => capitalizeWords(log.categoryName))
        .filter(Boolean)
    ),
  ];

  // Live suggestions from business list
  const suggestionOptions =
    debouncedSearch.trim().length >= 2
      ? clientBusinessList
          .filter((business) => {
            if (business.businessesLive !== true) return false;
            const value = debouncedSearch.toLowerCase();
            return (
              business.businessName?.toLowerCase().includes(value) ||
              business.category?.toLowerCase().includes(value)
            );
          })
          .slice(0, 10)
      : [];

  /* ---------------------------------------------------------
     5. HANDLE SEARCH
  ---------------------------------------------------------- */
  const handleSearch = async (e) => {
    e.preventDefault();

    const finalSearchTerm = (searchTerm || "").trim();
    const logLocation = locationName || "Global";

    const filteredBusinesses = clientBusinessList.filter((business) => {
      if (business.businessesLive !== true) return false;

      const term = finalSearchTerm.toLowerCase();
      const loc = (locationName || "").toLowerCase();
      const cat = (categoryName || "").toLowerCase();

      const matchesSearchTerm =
        !term ||
        (business.businessName &&
          business.businessName.toLowerCase().includes(term)) ||
        (business.category &&
          business.category.toLowerCase().includes(term)) ||
        (Array.isArray(business.keywords) &&
          business.keywords.some((keyword) =>
            keyword.toLowerCase().includes(term)
          )) ||
        (business.description &&
          business.description.toLowerCase().includes(term)) ||
        (business.seoDescription &&
          business.seoDescription.toLowerCase().includes(term)) ||
        (business.seoTitle &&
          business.seoTitle.toLowerCase().includes(term)) ||
        (business.title && business.title.toLowerCase().includes(term)) ||
        (business.slug && business.slug.toLowerCase().includes(term));

      const matchesCategory =
        !cat ||
        (business.category &&
          business.category.toLowerCase() === cat.toLowerCase());

      const matchesLocation =
        !loc ||
        [business.location, business.plotNumber, business.street, business.pincode]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(loc));

      return matchesSearchTerm && matchesCategory && matchesLocation;
    });

    const derivedCategory =
      filteredBusinesses.length > 0 && filteredBusinesses[0].category
        ? filteredBusinesses[0].category
        : categoryName || finalSearchTerm || "All Categories";

    const logCategory = derivedCategory;

    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    const userId = authUser?._id;
    const userDetails = {
      userName: authUser?.userName,
      mobileNumber1: authUser?.mobileNumber1,
      mobileNumber2: authUser?.mobileNumber2,
      email: authUser?.email,
    };

    if (userId && finalSearchTerm) {
      dispatch(logUserSearch(userId, finalSearchTerm, logLocation, logCategory));
    }

    dispatch(logSearchActivity(logCategory, logLocation, userDetails));

    if (setSearchResults) {
      setSearchResults(filteredBusinesses);
    }

    const locSlug = (locationName || "All").replace(/\s+/g, "");
    const termSlug = (finalSearchTerm || "All").replace(/\s+/g, "");

    navigate(`/${locSlug}/${termSlug}`, { state: { results: filteredBusinesses } });
  };

  /* ---------------------------------------------------------
     6. RENDER
  ---------------------------------------------------------- */

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.55)), url(${backgroundImage})`,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">MassClick Find Your Local Business</h1>

        <p className="hero-subtitle">
          MassClick is one of India's most trusted local search platforms,
          offering comprehensive business information including user reviews,
          ratings, contact details, and directions.
          <br />
          Discover a wide variety of businesses, from restaurants and retail
          stores to service providers and more — all at your fingertips with
          MassClick.
        </p>

        {/* ================= SEARCH BAR ================= */}
        <form className="search-bar-container" onSubmit={handleSearch}>
          {/* Location Input */}
          <div className="input-group location-group">
            <LocationOnIcon className="input-adornment start" />
            <input
              className="custom-input"
              placeholder="Enter location manually..."
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          {/* Search Term Input + Dropdowns */}
          <div className="input-group search-group" ref={categoryRef}>
            <input
              className="custom-input"
              placeholder="Search for..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />

            {/* RECENT SEARCHES (when very short input) */}
            {isDropdownOpen && searchTerm.trim().length < 2 && (
              <CategoryDropdown
                label="RECENT SEARCHES"
                options={recentSearchOptions}
                onSelect={(value) => {
                  setSearchTerm(value);
                  setIsDropdownOpen(false);
                }}
              />
            )}

            {/* SUGGESTIONS (when user types more) */}
            {isDropdownOpen && searchTerm.trim().length >= 2 && (
              <CategoryDropdown
                label="SUGGESTIONS"
                options={suggestionOptions}
                onSelect={(business) => {
                  if (typeof business === "string") {
                    setSearchTerm(business);
                  } else {
                    setSearchTerm(business.businessName);
                    if (business.category && setCategoryName) {
                      setCategoryName(business.category);
                    }
                  }
                  setIsDropdownOpen(false);
                }}
              />
            )}

            <MicIcon className="input-adornment end" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
