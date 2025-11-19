import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllClientBusinessList,
  getAllSearchLogs,
} from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import { logUserSearch } from "../../../redux/actions/otpAction";
import { logSearchActivity } from "../../../redux/actions/businessListAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import "./hero.css";

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

// Main Hero Section
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

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const businessListState = useSelector(
    (state) => state.businessListReducer || { clientBusinessList: [] }
  );
  const { searchLogs, clientBusinessList = [] } = businessListState;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      (searchLogs || []).map((log) => capitalizeWords(log.categoryName))
    ),
  ].filter(Boolean);

  const handleSearch = async (e) => {
    e.preventDefault();

    const finalSearchTerm = searchTerm?.trim();
    const logLocation = locationName || "Global";

    // Filter businesses first
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
          )) ||

        (business.description &&
          business.description
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (business.seoDescription &&
          business.seoDescription
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (business.seoTitle &&
          business.seoTitle
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (business.title &&
          business.title
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase())) ||
        (business.slug &&
          business.slug
            .toLowerCase()
            .includes(finalSearchTerm.toLowerCase()));

      const matchesCategory =
        !categoryName ||
        (business.category &&
          business.category.toLowerCase() === categoryName.toLowerCase());

      const matchesLocation =
        !locationName ||
        [business.location, business.plotNumber, business.street, business.pincode]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(locationName.toLowerCase())
          );

      return matchesSearchTerm && matchesCategory && matchesLocation;
    });

    const derivedCategory =
      filteredBusinesses.length > 0 && filteredBusinesses[0].category
        ? filteredBusinesses[0].category
        : categoryName || finalSearchTerm || "All Categories";

    const logCategory = derivedCategory;

    let authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    let userId = authUser?._id;
    let userDetails = {
      userName: authUser?.userName,
      mobileNumber1: authUser?.mobileNumber1,
      mobileNumber2: authUser?.mobileNumber2,
      email: authUser?.email
    };
    console.log("userDetails", userDetails);

    if (userId && finalSearchTerm) {
      dispatch(logUserSearch(userId, finalSearchTerm, logLocation, logCategory));
    }
    dispatch(logSearchActivity(logCategory, logLocation, userDetails));


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

        {/* ===== SEARCH BAR ===== */}
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

          {/* Search Term Input */}
          <div className="input-group search-group" ref={categoryRef}>
            <input
              className="custom-input"
              placeholder="Search for..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                setIsCategoryDropdownOpen(true);
              }}
              onFocus={() => setIsCategoryDropdownOpen(true)}
            />

            {/* RECENT SEARCHES DROPDOWN */}
            {isCategoryDropdownOpen && searchTerm.trim().length < 2 && (
              <CategoryDropdown
                options={categoryOptions}
                setSearchTerm={setSearchTerm}
                closeDropdown={() => setIsCategoryDropdownOpen(false)}
              />
            )}

            {/* LIVE SEARCH SUGGESTIONS */}
            {isCategoryDropdownOpen && searchTerm.trim().length >= 2 && (
              <div className="category-custom-dropdown">
                <div className="trending-label">SUGGESTIONS</div>
                <div
                  className="options-list-container"
                  style={{ maxHeight: "200px" }}
                >
                  {clientBusinessList
                    .filter((business) => {
                      const value = debouncedSearch.toLowerCase();
                      return (
                        business.businessName?.toLowerCase().includes(value) ||
                        business.category?.toLowerCase().includes(value)
                      );
                    })
                    .slice(0, 10)
                    .map((business, index) => (
                      <div
                        key={index}
                        className="option-item"
                        onClick={() => {
                          setSearchTerm(business.businessName);
                          setIsCategoryDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        <SearchIcon
                          style={{ marginRight: "6px", color: "#ff7b00" }}
                        />
                        <span>{business.businessName}</span>
                        <span
                          style={{
                            marginLeft: "auto",
                            color: "gray",
                            fontSize: "12px",
                          }}
                        >
                          {business.category}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
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