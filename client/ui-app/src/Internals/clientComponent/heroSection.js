import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    InputAdornment,
    IconButton,
    Autocomplete,
    Container,
    TextField,
    ListItemButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { getAllLocation } from "../../redux/actions/locationAction";
import { getAllBusinessList, logSearchActivity } from "../../redux/actions/businessListAction";
import { getAllCategory } from "../../redux/actions/categoryAction";
import backgroundImage from "../../assets/background.png";
import { useNavigate } from 'react-router-dom';
import qs from 'qs'; // optional, for query string formatting

// Refined custom-styled TextField component
const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "40px",
        height: "65px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.4)",
        transition: "all 0.4s ease-in-out",
        "&:hover": {
            boxShadow: "0px 12px 40px rgba(0,0,0,0.2)",
            transform: "translateY(-2px)",
        },
        "&.Mui-focused": {
            boxShadow: `0 0 0 4px ${theme.palette.primary.light}, 0px 10px 35px rgba(0,0,0,0.2)`,
            border: `1px solid ${theme.palette.primary.main}`,
        },
    },
    "& .MuiInputBase-input": {
        padding: "15px 25px",
        fontSize: "1.1rem",
        color: "#333",
    },
}));

const LocationListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const orangeIconStyle = { color: '#ea6d11', fontSize: 20 };

    return (
        <Box ref={ref} {...other} sx={{ padding: 0, borderRadius: '8px', overflow: 'hidden' }}>
            {/* --- Detect Location Header --- */}
            <ListItemButton
                // You would implement your geo-location detection logic here
                onClick={() => console.log('Detect Location clicked')}
                sx={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                        backgroundColor: 'rgba(234, 109, 17, 0.05)', // Light orange hover
                    }
                }}
            >
                <LocationSearchingIcon sx={{ ...orangeIconStyle, marginRight: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Detect Location
                </Typography>
            </ListItemButton>

            {/* --- TRENDING AREAS Title --- */}
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

            {/* The actual list of options */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {children}
            </ul>
        </Box>
    );
});

// --- 💡 SOLUTION: TrendingListbox Definition for Category Field ---
const TrendingListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    return (
        <Box ref={ref} {...other} sx={{
            padding: '16px 0',
            border: '1px solid #ccc',
            borderRadius: '8px',
        }}>
            {/* The Heading */}
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
            {/* The actual list of options */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {children}
            </ul>
        </Box>
    );
});

// --- Main Component ---
const HeroSection = ({ searchTerm, setSearchTerm, setSearchResults }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const locationState = useSelector((state) => state.locationReducer || { location: [] });
    const businessListState = useSelector((state) => state.businessListReducer || { businessList: [] });
    const categoryState = useSelector((state) => state.categoryReducer || { category: [] });


    const { location = [] } = locationState;
    const { businessList = [] } = businessListState;
    const { category = [] } = categoryState;

    const [categoryName, setCategoryName] = useState(""); // store name instead of ID
    const [locationName, setLocationName] = useState("")

    useEffect(() => {
        // Dispatch actions to fetch data (will only work if wrapped in Redux Provider)
        dispatch(getAllLocation());
        dispatch(getAllBusinessList());
        dispatch(getAllCategory());
    }, [dispatch]);

    const locationOptions = location.map((loc) => ({
        label: typeof loc.city === "object" ? loc.city.en : loc.city,
        id: loc._id,
    }));

    const categoryOptions = category.map((cat) => ({
        label: typeof cat.category === "object" ? cat.category.en : cat.category,
        id: cat._id,
    }));


    const handleSearch = () => {
        const logCategory = categoryName || searchTerm || 'All Categories';
        const logLocation = locationName || 'Global'; 

        dispatch(logSearchActivity(logCategory, logLocation));


        const filteredBusinesses = businessList.filter((business) => {
            const matchesSearchTerm =
                !searchTerm ||
                (business.businessName &&
                    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

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

        const loc = (locationName || 'All').replace(/\s+/g, '');
        const cat = (categoryName || 'All').replace(/\s+/g, '');
        const term = (searchTerm || 'All').replace(/\s+/g, '');

        navigate(`/${loc}/${cat}/${term}`, { state: { results: filteredBusinesses } });
    };




    return (
        <Box
            sx={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                minHeight: { xs: "80vh", sm: "85vh", md: "87vh" },
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "center",
                pt: { xs: 6, sm: 8, md: 10 },
                overflow: "hidden",
            }}
        >

            <Container maxWidth={false} disableGutters>
                <Box
                    sx={{
                        p: { xs: 3, sm: 6, md: 8 },
                        width: "100%",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: { xs: 2, sm: 4 },
                        backgroundColor: "rgba(0,0,0,0.1)",
                        backdropFilter: "blur(3px)",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            background: "linear-gradient(90deg, #FF7B00, #FFD166)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "2px",
                            textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                            fontSize: { xs: "2rem", sm: "3.5rem", md: "4.5rem" },
                        }}
                    >
                        MassClick Find Your Local Business
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            color: "white",
                            fontWeight: 400,
                            lineHeight: 1.6,
                            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                            fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                            textAlign: "center",
                            maxWidth: { xs: "100%", sm: 650 },
                            mx: "auto",
                        }}
                    >
                        One of the most widely used local search engines in India, it offers user reviews, ratings, contact details, and directions.
                        <br />
                        MassClick provides information on a vast range of businesses, including restaurants, shops, service providers, and more.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 1.5, sm: 2 },
                            width: { xs: "100%", sm: "85%" },
                            maxWidth: 1000,
                            mt: { xs: 2, sm: 3 },
                            alignSelf: "flex-start",
                            justifyContent: "flex-start",
                            ml: { xs: 0, sm: 30 },

                        }}
                    >
                        <Autocomplete
                            freeSolo
                            disableClearable
                            options={locationOptions}
                            getOptionLabel={(option) => option.label || ""}
                            value={locationOptions.find(opt => opt.label === locationName) || null} // ✅ bind value

                            onChange={(event, newValue) => setLocationName(newValue ? newValue.label : "")}
                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 250 } }}

                            // 💡 Use the custom Listbox for the Location header/title
                            ListboxComponent={LocationListbox}

                            renderOption={(props, option) => {
                                const { key, ...restProps } = props;
                                return (
                                    <ListItemButton key={option.id} {...restProps} sx={{ padding: "8px 16px" }}>
                                        <Typography variant="body1">{option.label}</Typography>
                                    </ListItemButton>
                                );
                            }}

                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    placeholder="Location"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOnIcon sx={{ color: "#ea6d11", fontSize: 24 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        {/* <Autocomplete
                            freeSolo
                            disableClearable
                            options={categoryOptions}
                            getOptionLabel={(option) => option.label || ""}
                            value={categoryOptions.find(opt => opt.label === categoryName) || null} // ✅ bind value

                            onChange={(event, newValue) => setCategoryName(newValue ? newValue.label : "")}
                            sx={{ flex: 1, minWidth: { xs: "100%", sm: 350 } }}
                            ListboxComponent={TrendingListbox}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    placeholder="Select Category"
                                    InputProps={{ ...params.InputProps }}
                                />
                            )}
                            renderOption={(props, option) => {
                                const { key, ...restProps } = props;
                                return (
                                    <Box key={option.id} component="li" {...restProps} sx={{ padding: "8px 16px !important" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#ff6600",
                                                padding: "6px",
                                                borderRadius: "4px",
                                                marginRight: "12px",
                                            }}
                                        >
                                            <TrendingUpIcon sx={{ color: "white", fontSize: "18px" }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                {option.label}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "gray" }}>
                                                Category
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            }}
                        /> */}
                        {/* FIRST FIELD: Search Term */}
                        <CustomTextField
                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 400 } }}
                            placeholder="Search for Spa, Salons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                                        <IconButton>
                                            <MicIcon sx={{ color: "#ea6d11" }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* SECOND FIELD: Category */}


                        {/* THIRD FIELD: Location */}


                        {/* Search Button */}
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            sx={{
                                flexShrink: 0,
                                width: { xs: "100%", sm: "15%" },
                                background: "linear-gradient(45deg, #FF7B00, #FFD166)",
                                color: "white",
                                textTransform: "none",
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                borderRadius: "40px",
                                height: "60px",
                                px: 5,
                                whiteSpace: "nowrap",
                                boxShadow: "0 6px 20px rgba(255, 123, 0, 0.4)",
                                "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                            }}
                        >
                            Search
                            <SearchIcon sx={{ ml: 1, fontSize: 28 }} />
                        </Button>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;