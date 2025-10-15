import React, { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";

import { useDispatch, useSelector } from "react-redux";
import { getAllLocation } from "../../../redux/actions/locationAction";
import { getAllBusinessList, logSearchActivity } from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from 'react-router-dom';
import './hero.css'

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

    const locationState = useSelector((state) => state.locationReducer || { location: [] });
    const businessListState = useSelector((state) => state.businessListReducer || { businessList: [] });
    const categoryState = useSelector((state) => state.categoryReducer || { category: [] });


    const { location = [] } = locationState;
    const { businessList = [] } = businessListState;
    const { category = [] } = categoryState;


    useEffect(() => {
        dispatch(getAllLocation());
        dispatch(getAllBusinessList());
        dispatch(getAllCategory());
    }, [dispatch]);

    const locationOptions = location.map((loc) =>
        typeof loc.city === "object" ? loc.city.en : loc.city
    );




    const handleSearch = (e) => {
        e.preventDefault(); 

        const finalSearchTerm = searchTerm;

        const logCategory = categoryName || finalSearchTerm || 'All Categories';
        const logLocation = locationName || 'Global';

        dispatch(logSearchActivity(logCategory, logLocation));


        const filteredBusinesses = businessList.filter((business) => {
            const matchesSearchTerm =
                !finalSearchTerm ||
                (business.category && business.category.toLowerCase().includes(finalSearchTerm.toLowerCase())) ||
                (business.businessName && business.businessName.toLowerCase().includes(finalSearchTerm.toLowerCase()));

            const matchesCategory =
                !categoryName ||
                (business.category &&
                    business.category.toLowerCase() === categoryName.toLowerCase());

            const matchesLocation =
                !locationName ||
                (business.location &&
                    business.location.toLowerCase() === locationName.toLowerCase());

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

                    <div className="input-group location-group">
                        <LocationOnIcon className="input-adornment start" />
                        <input
                            list="location-suggestions"
                            className="custom-input"
                            placeholder="Location"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            onBlur={(e) => setLocationName(e.target.value)}
                        />
                        <datalist id="location-suggestions">
                            {locationOptions.map((option, index) => (
                                <option key={index} value={option} />
                            ))}
                        </datalist>
                    </div>

                    <div className="input-group search-group">

                        <input
                            list="category-suggestions"
                            className="custom-input"
                            placeholder="Search for Spa, Salons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}

                        />
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