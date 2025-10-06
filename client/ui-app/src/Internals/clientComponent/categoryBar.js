
import React, { useState } from "react";
import {
    Box,
    Button,
    Select,
    FormControl,
    IconButton,
    Menu,
    Typography,
    MenuItem
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CampaignIcon from "@mui/icons-material/Campaign";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from '@mui/icons-material/Add';
import MI from "../../assets/Mi.png"; 
import AddBusinessModal from "./AddBusinessModel.js"; 

const categories = [
    { name: "Leads", icon: <MailIcon /> },
    { name: "Advertise", icon: <CampaignIcon /> },
    { name: "Free Listing", icon: <ListAltIcon /> },
];

const languages = [
    { name: "Tamil", nativeName: "தமிழ்" },
    { name: "English", nativeName: "English" },
    { name: "Hindi", nativeName: "हिन्दी" },
    { name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { name: "Telugu", nativeName: "తెలుగు" },
];

const CategoryBar = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <Box
            sx={{
                bgcolor: "white",
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2.5, sm: 4, md: 6 },
                position: "sticky",
                top: 0,
                zIndex: 1100,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                borderBottom: "none",
                transition: "box-shadow 0.3s ease-in-out",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 3 },
                }}
            >
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

                {/* Desktop Navigation (Existing code) */}
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: { sm: 2, md: 3 },
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                borderRadius: "30px",
                                bgcolor: "#f5f5f5",
                                color: "text.primary",
                                "& .MuiSelect-select": { py: 1, px: 2.5 },
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                                "& fieldset": { border: "none" },
                            }}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.name} value={lang.name} sx={{ fontSize: "1rem" }}>
                                    {lang.nativeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Categories */}
                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            variant="text"
                            startIcon={category.icon}
                            sx={{
                                color: "text.primary",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: "1rem",
                                px: 2.5,
                                py: 1,
                                position: "relative",
                                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                "&:hover": {
                                    color: "#F7941D",
                                    bgcolor: "transparent",
                                    transform: "translateY(-3px)",
                                },
                                "&:after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    width: 0,
                                    height: "2px",
                                    bgcolor: "#F7941D",
                                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                    transform: "translateX(-50%)",
                                },
                                "&:hover:after": {
                                    width: "80%",
                                },
                            }}
                        >
                            {category.name}
                        </Button>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: { sm: 1.5, md: 2 },
                    }}
                >
                    {/* Desktop "Add Your Business" Button - ADDED onClick handler */}
                    <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={handleOpenModal}
  sx={{
    background: "linear-gradient(45deg, #FF6F00, #F7941D)",
    color: "white",
    textTransform: "none",
    fontSize: { xs: "0.9rem", sm: "1rem" },
    borderRadius: "30px",
    px: { xs: 2.5, sm: 3.5 },
    py: { xs: 1, sm: 1.2 },
    whiteSpace: "nowrap",
    boxShadow: "0 10px 30px rgba(255, 123, 0, 0.4)",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    "&:hover": {
      background: "linear-gradient(45deg, #cc5a0f, #ff8a2d)",
      boxShadow: "0 15px 40px rgba(255, 123, 0, 0.5)",
    },
  }}
>
  Add Your Business
</Button>


                    {/* Icons (Existing code) */}
                    <IconButton
                        sx={{
                            color: "gray",
                            bgcolor: "rgba(0,0,0,0.04)",
                            width: 48,
                            height: 48,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "white",
                                background: "linear-gradient(45deg, #ea6d11, #ff9c3b)",
                                boxShadow: "0 4px 12px rgba(234,109,17,0.35)",
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        <NotificationsIcon sx={{ fontSize: 26 }} />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: "gray",
                            bgcolor: "rgba(0,0,0,0.04)",
                            width: 48,
                            height: 48,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "white",
                                background: "linear-gradient(45deg, #ea6d11, #ff9c3b)",
                                boxShadow: "0 4px 12px rgba(234,109,17,0.35)",
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        <AccountCircleIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                </Box>

                {/* Mobile Navigation (Existing code) */}
                <Box
                    sx={{
                        display: { xs: "flex", sm: "none" },
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {/* Mobile "Add Your Business" Button - ADDED onClick handler */}
                    <Button
                        variant="contained"
                        onClick={handleOpenModal} // ADDED onClick handler
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
                    <IconButton
                        sx={{
                            color: "text.primary",
                            display: { xs: "inline-flex", sm: "none" },
                        }}
                        onClick={handleMenuClick}
                    >
                        <MenuIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Mobile Menu (Existing code) */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem disabled>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.name} value={lang.name}>
                                    {lang.nativeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>
                {categories.map((category, index) => (
                    <MenuItem key={index} onClick={handleMenuClose}>
                        {category.icon}
                        <Box component="span" sx={{ ml: 1 }}>
                            {category.name}
                        </Box>
                    </MenuItem>
                ))}
                <MenuItem onClick={handleMenuClose}>
                    <NotificationsIcon />
                    <Box component="span" sx={{ ml: 1 }}>
                        Notifications
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <AccountCircleIcon />
                    <Box component="span" sx={{ ml: 1 }}>
                        Account
                    </Box>
                </MenuItem>
            </Menu>

            {/* 4. RENDER THE NEW MODAL COMPONENT */}
            <AddBusinessModal
                open={isModalOpen}
                handleClose={handleCloseModal}
            />
        </Box>
    );
};

export default CategoryBar;