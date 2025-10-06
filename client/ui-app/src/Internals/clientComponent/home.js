import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar';
import CategoryBar from '../clientComponent/categoryBar';
import HeroSection from '../clientComponent/heroSection';
import FeaturedServices from '../clientComponent/featureService';
import ServiceCardsGrid from '../clientComponent/serviceCard';
import TrendingSearchesCarousel from './trendingSearch/trendingSearch';
import CardCarousel from './popularSearch/popularSearch';
import TopTourist from './topTourist/topTourist';
import MassClickBanner from './massClickBanner/massClickBanner';
import SearchResults from './SearchResult/SearchResult';
import RecentActivities from './recentActivities/recentActivites';
import PopularCategories from './popularCategories/popularCategories';
import Footer from './footer/footer';
import CardsSearch from './CardsSearch/CardsSearch';

const STICKY_SEARCH_BAR_HEIGHT = 85;

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationName, setLocationName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const heroSectionRef = useRef(null);
    const navigate = useNavigate();

    const locationState = useSelector((state) => state.locationReducer || { location: [] });
    const categoryState = useSelector((state) => state.categoryReducer || { category: [] });
    const businessListState = useSelector((state) => state.businessListReducer || { businessList: [] });
    const { location = [] } = locationState;
    const { category = [] } = categoryState;
    const { businessList = [] } = businessListState;

    const locationOptions = location.map((loc) => ({
        label: typeof loc.city === "object" ? loc.city.en : loc.city,
        id: loc._id,
    }));

    const categoryOptions = category.map((cat) => ({
        label: typeof cat.category === "object" ? cat.category.en : cat.category,
        id: cat._id,
    }));

    useEffect(() => {
        const handleScroll = () => {
            if (heroSectionRef.current) {
                const heroHeight = heroSectionRef.current.offsetHeight || 600;
                setIsScrolled(window.scrollY > heroHeight + 50);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = () => {
        const filteredBusinesses = businessList.filter((business) => {
          const matchesSearchTerm =
            !searchTerm || (business.businessName && business.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesCategory =
            !categoryName || (business.category && business.category.toLowerCase().includes(categoryName.toLowerCase()));
          const matchesLocation =
            !locationName || (business.location && business.location.toLowerCase().includes(locationName.toLowerCase()));
          return matchesSearchTerm && matchesCategory && matchesLocation;
        });

        setSearchResults(filteredBusinesses);
        const loc = (locationName || 'All').replace(/\s+/g, '');
        const cat = (categoryName || 'All').replace(/\s+/g, '');
        const term = (searchTerm || 'All').replace(/\s+/g, '');
        navigate(`/${loc}/${cat}/${term}`, { state: { results: filteredBusinesses } });
    };

    const handleMobileMenuClose = () => setMobileMenuOpen(false);

    const drawerContent = (
        <Box onClick={handleMobileMenuClose} sx={{ textAlign: 'center' }}>
            <List>
                {['About Us', 'Services', 'Testimonials', 'Portfolio'].map((text) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const isSearching = searchResults !== null;

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', width: '100%' }}>
            <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuClose}>
                {drawerContent}
            </Drawer>

            {!isScrolled && !isSearching && <CategoryBar />}

            <SearchBar
                isScrolled={isScrolled}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                locationName={locationName}
                setLocationName={setLocationName}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                handleSearch={handleSearch}
                locationOptions={locationOptions}
                categoryOptions={categoryOptions}
            />

            <Box sx={{ height: isScrolled ? STICKY_SEARCH_BAR_HEIGHT : 0 }} />

            <Box ref={heroSectionRef}>
                <HeroSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchResults={setSearchResults}
                />
            </Box>

            {isSearching ? (
              
                <Box sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 4, md: 6 } }}>
                    <SearchResults results={searchResults} />
                </Box>
            ) : (
                <>
                    <FeaturedServices />
                    <ServiceCardsGrid />
                    <TrendingSearchesCarousel />
                    <CardCarousel />
                    <TopTourist />
                    <MassClickBanner />
                    <RecentActivities />
                    <PopularCategories />
                    <Footer />
                </>
            )}
        </Box>
    );
};

export default LandingPage;
