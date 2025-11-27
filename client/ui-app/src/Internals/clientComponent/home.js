import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import HeroSection from '../clientComponent/heroSection/heroSection.js';
import CategoryBar from '../clientComponent/categoryBar';
import FeaturedServices from '../clientComponent/featuredService/featureService.js';
import ServiceCardsGrid from '../clientComponent/serviceCard/serviceCard.js';
import TrendingSearchesCarousel from './trendingSearch/trendingSearch';
import CardCarousel from './popularSearch/popularSearch';
import TopTourist from './topTourist/topTourist';
import MassClickBanner from './massClickBanner/massClickBanner';
import SearchResults from './SearchResult/SearchResult';
// import RecentActivities from './recentActivities/recentActivites';
import PopularCategories from './popularCategories/popularCategories';
import Footer from './footer/footer';
import CardsSearch from './CardsSearch/CardsSearch';
import OTPLoginModel from './AddBusinessModel.js'

const STICKY_SEARCH_BAR_HEIGHT = 85;

const LandingPage = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [locationName, setLocationName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const heroSectionRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [checkedLogin, setCheckedLogin] = useState(false);


    const isUserLoggedIn = () => {
        try {
            const storedUser = localStorage.getItem('authUser');
            if (!storedUser) return false;
            const parsedUser = JSON.parse(storedUser);
            return !!(parsedUser && parsedUser.mobileNumber1Verified);
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (heroSectionRef.current) {
                const heroHeight = heroSectionRef.current.offsetHeight || 600;
                const scrolled = window.scrollY > heroHeight + 50;
                setIsScrolled(scrolled);

                if (scrolled && !checkedLogin) {
                    setCheckedLogin(true);
                    const loggedIn = isUserLoggedIn();
                    if (!loggedIn) {
                        setShowLoginModal(true);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [checkedLogin]);

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

            <Box sx={{ display: isScrolled ? 'none' : 'block' }}>
                <CategoryBar />
            </Box>
            {isScrolled && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        bgcolor: "background.paper",
                        boxShadow: 3,
                    }}
                >
                    <CardsSearch
                        locationName={locationName}
                        setLocationName={setLocationName}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categoryName={categoryName}
                        setCategoryName={setCategoryName}
                    />
                </Box>
            )}


            <Box sx={{ height: isScrolled ? STICKY_SEARCH_BAR_HEIGHT : 0 }} />

            <Box ref={heroSectionRef}>
                <HeroSection
                    locationName={locationName}
                    setLocationName={setLocationName}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    setSearchResults={setSearchResults}
                />
            </Box>

            {isSearching ? (
                <Box sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 4, md: 6 } }}>
                    <SearchResults results={searchResults} />
                </Box>
            ) : (
                <>
                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <FeaturedServices />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <ServiceCardsGrid />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <MassClickBanner />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <TrendingSearchesCarousel />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <CardCarousel />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <TopTourist />
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                        <PopularCategories />
                    </Box>

                    <Footer />
                </>

            )}
            <OTPLoginModel open={showLoginModal} handleClose={() => setShowLoginModal(false)} />

        </Box>
    );
};

export default LandingPage;
