import React, { useEffect, useState, useRef } from "react";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";

import { useDispatch, useSelector } from "react-redux";
import { getAllLocation } from "../../../redux/actions/locationAction";
import { getAllBusinessList, logSearchActivity, getAllSearchLogs } from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from 'react-router-dom';
import './hero.css'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

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

// New CategoryDropdown Component

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

const HeroSection = ({
    searchTerm,
    setSearchTerm,
    locationName,
    setLocationName,
    categoryName,
    setCategoryName,
    setSearchResults
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    const locationRef = useRef(null);
    const categoryRef = useRef(null);

    const businessListState = useSelector((state) => state.businessListReducer || { businessList: [] });
    const { location = [], loading, error } = useSelector(
        (state) => state.locationReducer || {}
    );

    const { searchLogs, businessList = [] } = businessListState;

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
        .filter(loc => allLocationIds.includes(loc._id.$oid || loc._id)) // match by _id
        .map(loc => ({
            value: loc._id.$oid || loc._id,
            label: `${loc.city}, ${loc.state}, ${loc.country}`
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


    return (
        <div
            className="hero-section"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
            }}
        >
            <div className="hero-content">

                <h1 className="hero-title">
                    MassClick Find Your Local Business
                </h1>
                <p className="hero-subtitle">
                    One of the most widely used local search engines in India, it offers user reviews, ratings, contact details, and directions.
                    <br />
                    MassClick provides information on a vast range of businesses, including restaurants, shops, service providers, and more.
                </p>

                <form className="search-bar-container" onSubmit={handleSearch}>

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

                    <button
                        type="submit"
                        className="search-button"
                    >
                        <SearchIcon className="search-icon" />
                    </button>
                </form>

            </div>
        </div>
    );
};

export default HeroSection;