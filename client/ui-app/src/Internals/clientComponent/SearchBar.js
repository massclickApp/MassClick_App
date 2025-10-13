import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Autocomplete,
    InputAdornment,
    IconButton,
    Typography,
    ListItemButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MicIcon from "@mui/icons-material/Mic";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { styled } from "@mui/system";
import MI from "../../assets/Mi.png"; 
import AddIcon from '@mui/icons-material/Add';
import AddBusinessModel from "./AddBusinessModel.js"; 

const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "40px",
        height: "50px", 
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", 
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.4)",
        transition: "all 0.4s ease-in-out",
        "&:hover": {
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
            transform: "none",
        },
        "&.Mui-focused": {
            boxShadow: `0 0 0 4px ${theme.palette.primary.light}, 0px 5px 15px rgba(0,0,0,0.1)`,
            border: `1px solid ${theme.palette.primary.main}`,
        },
    },
    "& .MuiInputBase-input": {
        padding: "10px 20px", 
        fontSize: "1rem", 
        color: "#333",
    },
}));


const LocationListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    return <ul ref={ref} {...other} style={{ padding: 0, margin: 0 }}>{children}</ul>;
});

const TrendingListbox = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    return <ul ref={ref} {...other} style={{ padding: 0, margin: 0 }}>{children}</ul>;
});
// --------------------------------------------------------


const SearchBar = ({
    searchTerm,
    setSearchTerm,
    locationName,
    setLocationName,
    categoryName,
    setCategoryName,
    handleSearch,
    locationOptions = [],
    categoryOptions = [],
    isScrolled = false,
    isSearching = false, // Critical prop
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const safeLocationOptions = locationOptions || [];
 
    const isVisible = isScrolled || isSearching;

    return (
       <Box
    sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: 'white',
        
        // FIXED HEADER VISIBILITY LOGIC
        transform: isVisible ? 'translateY(0)' : 'translateY(-120%)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: isVisible ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        
        padding: { xs: '10px 15px', sm: '10px 40px' },
        display: "flex",
        flexDirection: { xs: "row", sm: "row" },
        gap: { xs: 1.5, sm: 2 },
        // ✅ CHANGE: Use 'center' for desktop (sm and up) and 'space-between' for mobile (xs)
        justifyContent: { xs: 'space-between', sm: 'center' }, 
        alignItems: 'center',
        flexWrap: "nowrap",
        height: { xs: 'auto', sm: 'auto' },
    }}
>
            {/* Logo and Title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
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
                {/* Hide the full text logo on mobile when space is tight in the header */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: "column" }}>
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

            {/* Mobile-specific buttons (Add Business and Menu) */}
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleOpenModal}
                    sx={{
                        background: "linear-gradient(45deg, #ea6d11, #ff9c3b)",
                        color: "white",
                        textTransform: "none",
                        fontSize: "0.85rem",
                        borderRadius: "20px",
                        px: 2.5,
                        py: 1,
                        whiteSpace: "nowrap",
                        boxShadow: "0 3px 10px rgba(234,109,17,0.35)",
                        "&:hover": { background: "linear-gradient(45deg, #cc5a0f, #ff8a2d)" },
                    }}
                >
                    Add Your Business
                </Button>
            </Box>

            {/* Desktop Search Fields and Buttons (Hidden on mobile) */}
            <Box
                sx={{
                    display: { xs: "none", sm: "flex" }, // Hide on mobile, show on sm+
                    flexDirection: "row",
                    gap: { xs: 1.5, sm: 2 },
                    // Allow search bar to take remaining space and center its content
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    flexGrow: 1, // Allows it to take up the remaining space
                    maxWidth: 1200,
                    flexWrap: "nowrap",
                    ml: { sm: 4, md: 8 } // Add margin to separate from the logo
                }}
            >
                {/* 1. Location Autocomplete */}
                <Autocomplete
                    options={safeLocationOptions}
                    value={safeLocationOptions.find(opt => opt.label === locationName) || null}
                    onChange={(event, newValue) => setLocationName(newValue ? newValue.label : "")}
                    // Adjusted flex to make this input visually balanced
                    sx={{ width: 200, flexShrink: 0 }} 
                    freeSolo
                    disableClearable
                    disablePortal
                    getOptionLabel={(option) => option.label || ""}
                    ListboxComponent={LocationListbox}
                    renderOption={(props, option) => (
                        <ListItemButton key={option.id} {...props} sx={{ padding: "8px 16px" }}>
                            <Typography variant="body1">{option.label}</Typography>
                        </ListItemButton>
                    )}
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

                {/* 2. Search Term Field (Main Search) */}
                <CustomTextField
                    // Flex grow allows this to take the primary search space
                    sx={{ flex: 1, minWidth: 250, maxWidth: 500 }}
                    placeholder="Search for Spa, Salons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { // Added keyboard support for search
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
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

                {/* 3. Search Button */}
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        flexShrink: 0,
                        width: "120px", // Fixed width for consistency
                        height: "50px",
                        background: "linear-gradient(45deg, #FF7B00, #FFD166)",
                        color: "white",
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: "35px",
                        px: 2.5,
                        whiteSpace: "nowrap",
                        boxShadow: "0 5px 15px rgba(255, 123, 0, 0.35)",
                        "&:hover": { background: "linear-gradient(45deg, #FF5B00, #FFC044)" },
                    }}
                >
                    Search
                    <SearchIcon sx={{ ml: 1, fontSize: 24 }} />
                </Button>

                {/* 4. Add Business Button */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexShrink: 0,
                        width: "200px", // Fixed width
                        height: "50px",
                        background: "linear-gradient(45deg, #FF6F00, #F7941D)",
                        color: "white",
                        textTransform: "none",
                        fontSize: "1rem",
                        borderRadius: "30px",
                        px: 3.5,
                        py: 1.2,
                        whiteSpace: "nowrap",
                        boxShadow: "0 10px 30px rgba(255, 123, 0, 0.4)",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&:hover": {
                            background: "linear-gradient(45deg, #cc5a0f, #ff8a2d)",
                            transform: "translateY(-3px)",
                            boxShadow: "0 15px 40px rgba(255, 123, 0, 0.5)",
                        },
                    }}
                >
                    Add Your Business
                </Button>
            </Box>

            {/* Modal Component */}
            <AddBusinessModel
                open={isModalOpen}
                handleClose={handleCloseModal}
            />
        </Box>
    );
};

export default SearchBar;