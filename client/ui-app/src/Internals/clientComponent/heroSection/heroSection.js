import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBusinessList,
  getAllClientBusinessList,
  logSearchActivity,
  getAllSearchLogs,
} from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import "./hero.css";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

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
      <div
        className="options-list-container"
        style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="option-item"
            onClick={() => handleOptionClick(option)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            <HistoryToggleOffIcon
              style={{ marginRight: "6px", color: "#ff7b00" }}
            />
            <span>{option}</span>
          </div>
        ))}
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

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef(null);

  const businessListState = useSelector(
    (state) => state.businessListReducer || { clientBusinessList: [] }
  );
  const { searchLogs, clientBusinessList = [] } = businessListState;

  useEffect(() => {
    dispatch(getAllClientBusinessList());
    dispatch(getAllCategory());
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryRef]);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const categoryOptions = [
    ...new Set(
      businessListState.searchLogs.map((log) =>
        capitalizeWords(log.categoryName)
      )
    ),
  ].filter(Boolean);

  const handleSearch = (e) => {
    e.preventDefault();

    const finalSearchTerm = searchTerm;
    const logCategory = categoryName || finalSearchTerm || "All Categories";
    const logLocation = locationName || "Global";

    dispatch(logSearchActivity(logCategory, logLocation));

    const filteredBusinesses = clientBusinessList.filter((business) => {
      const matchesSearchTerm =
        !finalSearchTerm ||
        (business.businessName &&
          business.businessName
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (business.category &&
          business.category
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (Array.isArray(business.keywords) &&
          business.keywords.some((keyword) =>
            keyword.toLowerCase().includes(finalSearchTerm.toLowerCase())
          ));


      const matchesCategory =
        !categoryName ||
        (business.category &&
          business.category.toLowerCase() === categoryName.toLowerCase());

      const matchesLocation =
        !locationName ||
        [
          business.location,
          business.plotNumber,
          business.street,
          business.pincode,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(locationName.toLowerCase())
          );

      return matchesSearchTerm && matchesCategory && matchesLocation;
    });

    if (setSearchResults) setSearchResults(filteredBusinesses);

    const loc = (locationName || "All").replace(/\s+/g, "");
    const term = (finalSearchTerm || "All").replace(/\s+/g, "");

    navigate(`/${loc}/${term}`, { state: { results: filteredBusinesses } });
  };

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
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
          {/* Manual Location Input */}
          <div className="input-group location-group">
            <LocationOnIcon className="input-adornment start" />
            <input
              className="custom-input"
              placeholder="Enter location manually..."
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          {/* Search Term Input */}
          <div className="input-group search-group" ref={categoryRef}>
            <input
              className="custom-input"
              placeholder="Search for..."
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

          <button type="submit" className="search-button">
            <SearchIcon className="search-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;