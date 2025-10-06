import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CardsSearch.css';
// Import Redux actions (assuming these paths are correct in your project)
import { getAllLocation } from "../../../redux/actions/locationAction";
import { getAllBusinessList } from "../../../redux/actions/businessListAction";
import { getAllCategory } from "../../../redux/actions/categoryAction";
import {
    Box,
    Typography,
    Button,
    InputAdornment,
    IconButton,
    Autocomplete,
    ListItemButton,
    TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { styled } from "@mui/system";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MI from "../../../assets/Mi.png";
import AddIcon from '@mui/icons-material/Add';

// Keep CustomTextField styling as it is good
const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "40px",
        height: "50px", // 🔽 Reduced height from 65px to 50px
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", // 🔽 Reduced shadow
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.4)",
        transition: "all 0.4s ease-in-out",
        "&:hover": {
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)", // 🔽 Reduced hover shadow
            transform: "none", // ❌ Removed translateY for stability
        },
        "&.Mui-focused": {
            boxShadow: `0 0 0 4px ${theme.palette.primary.light}, 0px 5px 15px rgba(0,0,0,0.1)`, // 🔽 Reduced focus shadow
            border: `1px solid ${theme.palette.primary.main}`,
        },
    },
    "& .MuiInputBase-input": {
        padding: "10px 20px", // 🔽 Adjusted padding
        fontSize: "1rem", // 🔽 Slightly smaller font
        color: "#333",
    },
}));

// LocationListbox and TrendingListbox remain the same for functionality

const LocationListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const orangeIconStyle = { color: '#ea6d11', fontSize: 20 };

    return (
        <Box ref={ref} {...other} sx={{ padding: 0, borderRadius: '8px', overflow: 'hidden' }}>
            <ListItemButton
                onClick={() => console.log('Detect Location clicked')}
                sx={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                        backgroundColor: 'rgba(234, 109, 17, 0.05)',
                    }
                }}
            >
                <LocationSearchingIcon sx={{ ...orangeIconStyle, marginRight: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Detect Location
                </Typography>
            </ListItemButton>

            <Typography
                variant="caption"
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'gray',
                    padding: '8px 16px 4px 16px',
                    display: 'block',
                }}
            >
                Trending Areas
            </Typography>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {children}
            </ul>
        </Box>
    );
});

const TrendingListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    return (
        <Box ref={ref} {...other} sx={{
            padding: '16px 0',
            border: '1px solid #ccc',
            borderRadius: '8px',
        }}>
            <Typography
                variant="subtitle2"
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginLeft: '16px',
                    marginBottom: '8px',
                    color: '#333',
                    letterSpacing: '0.5px',
                }}
            >
                Trending Searches
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {children}
            </ul>
        </Box>
    );
});

const CardsSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Redux State Setup (kept same)
    const locationState = useSelector((state) => state.locationReducer || { location: [] });
    const businessListState = useSelector((state) => state.businessListReducer || { businessList: [] });
    const categoryState = useSelector((state) => state.categoryReducer || { category: [] });

    const { location = [] } = locationState;
    const { businessList = [] } = businessListState;
    const { category = [] } = categoryState;

    // 2. Local State for Input Fields (kept same)
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [locationName, setLocationName] = useState("");


    const locationOptions = location.map((loc) => ({
        label: typeof loc.city === "object" ? loc.city.en : loc.city,
        id: loc._id,
    }));

    const categoryOptions = category.map((cat) => ({
        label: typeof cat.category === "object" ? cat.category.en : cat.category,
        id: cat._id,
    }));

    // 3. Data Fetching (Redux) (kept same)
    useEffect(() => {
        dispatch(getAllLocation());
        dispatch(getAllBusinessList());
        dispatch(getAllCategory());
    }, [dispatch]);

    // handleSearch (kept same)
    const handleSearch = () => {
        const filteredBusinesses = businessList.filter((business) => {
            const matchesSearchTerm =
                !searchTerm ||
                (business.businessName &&
                    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

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

        const loc = (locationName || 'All').replace(/\s+/g, '');
        const cat = (categoryName || 'All').replace(/\s+/g, '');
        const term = (searchTerm || 'All').replace(/\s+/g, '');

        navigate(`/${loc}/${cat}/${term}`, { state: { results: filteredBusinesses } });
    };

    const handleMobileSearch = () => {
        handleSearch();
    };

    return (
        <>
            <div className="topbar-wrapper">
                {/* --- 1. Logo and Title Section --- */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
                        <Box
                            sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "#fff",
                                boxShadow: "0 6px 15px rgba(234, 109, 17, 0.4)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <img
                                src={MI}
                                alt="Logo"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
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
                                Mass<Box component="span">click</Box>
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
                    </Box>
                </Box>

                {/* --- 2. DESKTOP/TABLET Search Bar (Show on md and up) --- */}
                <Box
                    className="search-bar-container-desktop"
                    sx={{
                        display: { xs: 'none', md: 'flex' }, // 🛑 Hides on mobile
                        alignItems: "center",
                        gap: 1.5,
                        flexGrow: 1,
                        justifyContent: "center",// 💡 CHANGED from "flex-end" to "center"
                        ml: 2,
                    }}
                >
                    {/* Location Autocomplete - Desktop */}
                    <Autocomplete
                        options={locationOptions}
                        getOptionLabel={(option) => option.label || ""}
                        value={locationOptions.find(opt => opt.label === locationName) || null}
                        onChange={(event, newValue) => {
                            setLocationName(newValue ? newValue.label : "");
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: 180 }}
                        ListboxComponent={LocationListbox}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                placeholder="Location"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon sx={{ color: "#ea6d11", fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    {/* Category Autocomplete - Desktop */}
                    <Autocomplete
                        options={categoryOptions}
                        getOptionLabel={(option) => option.label || ""}
                        value={categoryOptions.find(opt => opt.label === categoryName) || null}
                        onChange={(event, newValue) => {
                            setCategoryName(newValue ? newValue.label : "");
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: 200 }}
                        ListboxComponent={TrendingListbox}
                        renderInput={(params) => (
                            <CustomTextField {...params} placeholder="Category" InputProps={{ ...params.InputProps }} />
                        )}
                    />

                    {/* Main Search Input - Desktop */}
                    <CustomTextField
                        sx={{ width: 300 }}
                        placeholder="Search for Spa, Salons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <MicIcon sx={{ color: "#ea6d11", fontSize: 20 }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Search Button - Desktop */}
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            flexShrink: 0,
                            width: 120,
                            height: "50px", // Match input height
                            background: "linear-gradient(45deg, #FF7B00, #FFD166)",
                            color: "white", textTransform: "none", fontSize: "1rem", fontWeight: 600,
                            borderRadius: "40px", px: 3,
                            boxShadow: "0 4px 15px rgba(255, 123, 0, 0.3)",
                            "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        Search
                    </Button>

                    {/* Add Business Button - Desktop */}
                    <Button
                        variant="contained"
                        sx={{
                            flexShrink: 0,
                            width: 230,
                            height: "50px", // Match input height
                            background: "linear-gradient(45deg, #ff9900, #ff4d00)",
                            color: "white", textTransform: "none", fontSize: "1rem", fontWeight: 600,
                            borderRadius: "40px", px: 3,
                            boxShadow: "0 4px 15px rgba(255, 123, 0, 0.3)",
                            "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                        }}
                    >
                        <AddIcon sx={{ fontSize: 20, mr: 0.5, transform: 'rotate(90deg)' }} />
                        Add Your Business
                    </Button>
                </Box>
            </div >

            {/* --- 3. MOBILE Search Bar (Show only on xs - ALL THREE FIELDS STACKED) --- */}
            {/* This box is OUTSIDE the topbar-wrapper for full-width search bar below the logo. */}
            <Box
                className="search-bar-container-mobile"
                sx={{
                    display: { xs: 'flex', md: 'none' }, // ✅ Show only on XS (mobile)
                    flexDirection: 'column',            // 💡 STACKS FIELDS VERTICALLY
                    gap: 1,                             // Space between stacked fields
                    p: 1.5,
                    width: '100%',
                    bgcolor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    boxSizing: 'border-box',
                }}
            >
                {/* 3a. Location Autocomplete - Mobile (Full Width) */}
                <Autocomplete
                    options={locationOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={locationOptions.find(opt => opt.label === locationName) || null}
                    onChange={(event, newValue) => {
                        setLocationName(newValue ? newValue.label : "");
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: '100%' }} // Make it full width
                    ListboxComponent={LocationListbox}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            placeholder="Location"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOnIcon sx={{ color: "#ea6d11", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />

                {/* 3b. Category Autocomplete - Mobile (Full Width) */}
                <Autocomplete
                    options={categoryOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={categoryOptions.find(opt => opt.label === categoryName) || null}
                    onChange={(event, newValue) => {
                        setCategoryName(newValue ? newValue.label : "");
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: '100%' }} // Make it full width
                    ListboxComponent={TrendingListbox}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            placeholder="Category"
                            InputProps={{ ...params.InputProps }}
                        />
                    )}
                />

                {/* 3c. Main Search Input and Search Button - Mobile */}
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    {/* Main Search Input */}
                    <CustomTextField
                        fullWidth // Take remaining space
                        placeholder="Search for Spa, Salons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <MicIcon sx={{ color: "#ea6d11", fontSize: 20 }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Search Button (Icon only) */}
                    <Button
                        variant="contained"
                        onClick={handleMobileSearch} // Use the new handler or main handler
                        sx={{
                            flexShrink: 0,
                            width: 50,
                            minWidth: 50,
                            height: "50px", // Match input height
                            background: "linear-gradient(45deg, #FF7B00, #FFD166)",
                            color: "white",
                            borderRadius: "40px",
                            px: 0,
                            boxShadow: "0 4px 15px rgba(255, 123, 0, 0.3)",
                            "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </Button>
                </Box>

                <Button
                    variant="contained"
                    sx={{
                        flexShrink: 0,
                        width: '100%',
                        height: "50px",
                        background: "linear-gradient(45deg, #ff9900, #ff4d00)",
                        color: "white", textTransform: "none", fontSize: "1rem", fontWeight: 600,
                        borderRadius: "40px",
                        boxShadow: "0 4px 15px rgba(255, 123, 0, 0.3)",
                        "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                        mt: 1, // Margin top to separate it slightly
                    }}
                >
                    <AddIcon sx={{ fontSize: 20, mr: 0.5, transform: 'rotate(90deg)' }} />
                    Add Your Business
                </Button>

            </Box>
        </>
    );
}

export default CardsSearch;