import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSearchLogs,
  getBackendSuggestions,
  backendMainSearch,
  logSearchActivity,
} from "../../../redux/actions/businessListAction";
import { logUserSearch } from "../../../redux/actions/otpAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import "./hero.css";

const CategoryDropdown = ({ label, options, onSelect }) => {
  const MAX_HEIGHT_PX = 220;
  if (!options || options.length === 0) return null;

  return (
    <div className="category-custom-dropdown" style={{ zIndex: 1200 }}>
      <div className="trending-label">{label}</div>
      <div
        className="options-list-container"
        style={{
          maxHeight: `${MAX_HEIGHT_PX}px`,
          overflowY: "auto",
        }}
      >
        {options.map((option, index) => {
          const displayText =
            typeof option === "string"
              ? option
              : option.category || option.businessName || option.location || "";

          return (
            <div
              key={index}
              className="option-item"
              onClick={() => onSelect(option)}
            >
              {label.toLowerCase().includes("location") ? (
                <LocationOnIcon className="option-icon" />
              ) : label === "RECENT SEARCHES" ? (
                <HistoryToggleOffIcon className="option-icon" />
              ) : (
                <SearchIcon className="option-icon" />
              )}

              <span className="option-text-main">{displayText}</span>

              {label === "RECENT SEARCHES" &&
                typeof option !== "string" &&
                option.category && (
                  <span className="option-text-sub">{option.category}</span>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HeroSection = ({
  searchTerm,
  setSearchTerm,
  locationName,
  setLocationName,
  categoryName,
  setCategoryName,
  setSearchResults,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryRef = useRef(null);
  const locationRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const businessState = useSelector((state) => state.businessListReducer);
  const { searchLogs = [], backendSuggestions = [] } = businessState;

  useEffect(() => {
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm || ""), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      dispatch(getBackendSuggestions(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedLocation(locationName || ""), 250);
    return () => clearTimeout(t);
  }, [locationName]);

  useEffect(() => {
    if (debouncedLocation.trim().length >= 2) {
      dispatch(getBackendSuggestions(debouncedLocation));
    }
  }, [debouncedLocation, dispatch]);

  const recentSearchOptions = [
    ...new Set(
      (searchLogs || [])
        .map((log) => (log.categoryName ? log.categoryName.trim() : ""))
        .filter(Boolean)
    ),
  ];

const isLikelyCategorySearch = (text) => {
  const lower = text.toLowerCase();

  return lower.length <= 4 || !lower.includes(" ");
};


 const suggestionCategories = (() => {
  if (!Array.isArray(backendSuggestions) || backendSuggestions.length === 0)
    return [];

  const seen = new Set();
  const list = [];

  const userInput = searchTerm.trim().toLowerCase();
  const categoryOnly = isLikelyCategorySearch(userInput);

  backendSuggestions.forEach((item) => {
    if (categoryOnly) {
      const val = item.category;
      if (!val) return;

      const text = String(val).trim();
      if (!text) return;

      const key = text.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(text);
      }
      return;
    }

    const val = item.businessName || item.category;
    if (!val) return;

    const text = String(val).trim();
    if (!text) return;

    const key = text.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(text);
    }
  });

  return list;
})();


  const parsedLocationSuggestions = (() => {
    if (!Array.isArray(backendSuggestions) || backendSuggestions.length === 0)
      return [];

    const seen = new Set();
    const list = [];

    backendSuggestions.forEach((item) => {
      const locFields = [
        item.location,
        item.locationDetails,
        item.street,
        item.plotNumber,
        item.pincode,
      ];

      locFields.forEach((loc) => {
        if (!loc) return;
        const text = String(loc).trim();
        if (!text) return;
        const key = text.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push(text);
        }
      });
    });

    return list;
  })();

  const handleSearch = async (e) => {
    e.preventDefault();

    const term = searchTerm.trim();
    const location = locationName.trim();
    const category = categoryName.trim();

    const response = await dispatch(backendMainSearch(term, location, category));
    const results = response?.payload || [];

    if (setSearchResults) setSearchResults(results);

    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    const userId = authUser?._id;
    const userDetails = {
      userName: authUser?.userName,
      mobileNumber1: authUser?.mobileNumber1,
      mobileNumber2: authUser?.mobileNumber2,
      email: authUser?.email,
    };

    if (userId && term) {
      dispatch(logUserSearch(userId, term, location || "Global", category || "All Categories"));
    }

    dispatch(logSearchActivity(category || "All Categories", location || "Global", userDetails, term));

    navigate(`/${location || "All"}/${term || "All"}`, { state: { results } });
  };

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

        <form className="search-bar-container" onSubmit={handleSearch}>
          <div className="input-group location-group" ref={locationRef}>
            <LocationOnIcon className="input-adornment start" />
            <input
              className="custom-input"
              placeholder="Enter location manually..."
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
            />

            {showLocationDropdown && parsedLocationSuggestions.length > 0 && (
              <CategoryDropdown
                label="LOCATION SUGGESTIONS"
                options={parsedLocationSuggestions}
                onSelect={(val) => {
                  const chosen = typeof val === "string" ? val : String(val);
                  setLocationName(chosen);
                  setShowLocationDropdown(false);
                }}
              />
            )}
          </div>

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

            {isDropdownOpen && searchTerm.trim().length < 2 && (
              <CategoryDropdown
                label="RECENT SEARCHES"
                options={recentSearchOptions}
                onSelect={(val) => {
                  const chosen = typeof val === "string" ? val : String(val);
                  setSearchTerm(chosen);
                  if (setCategoryName) setCategoryName(chosen);
                  setIsDropdownOpen(false);
                }}
              />
            )}

            {isDropdownOpen && searchTerm.trim().length >= 2 && (
              <CategoryDropdown
                label="SUGGESTIONS"
                options={suggestionCategories}
                onSelect={(val) => {
                  const chosen = typeof val === "string" ? val : String(val);
                  setSearchTerm(chosen);
                  if (setCategoryName) setCategoryName(chosen);
                  setIsDropdownOpen(false);
                }}
              />
            )}

            <MicIcon className="input-adornment end" />
          </div>

          <button type="submit" className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
