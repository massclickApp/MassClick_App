import React, { useState, useEffect } from "react"; // <-- added useEffect
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewOtpUser } from "../../redux/actions/otpAction.js";

import {
    Box,
    Button,
    Select,
    FormControl,
    IconButton,
    Menu,
    Typography,
    MenuItem,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemButton,
    ListItemText,
    SwipeableDrawer,
    ListItemIcon,

} from "@mui/material";
import {
    ListAlt as ListAltIcon,
    Notifications as NotificationsIcon,
    Campaign as CampaignIcon,
    Mail as MailIcon,
    Menu as MenuIcon,
    AccountCircle as AccountCircleIcon,
    Add as AddIcon,
    Close as CloseIcon,
    ExitToApp as ExitToAppIcon,
    Language as LanguageIcon

} from "@mui/icons-material";
import MI from "../../assets/Mi.png";
import AddBusinessModal from "./AddBusinessModel.js";


import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PolicyIcon from "@mui/icons-material/Policy";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Divider } from "@mui/material";



import DashboardPage from "../clientComponent/userMenu/DashboardPage/Dashboard.js";
import AccountPage from "../clientComponent/userMenu/AccountPage/AccountPage.js";
import BusinessListPage from "../clientComponent/userMenu/BusinessList/BusinessListPage.js";
import FavoritesPage from "../clientComponent/userMenu/FavouritePage/FavouritePage.js";
import SavedPage from "../clientComponent/userMenu/SavedPage/SavedPage.js";
import EditProfilePage from "../clientComponent/userMenu/EditProfile/EditProfilePage.js";
import MyTransactionPage from "../clientComponent/userMenu/MyTransaction/MyTransaction.js";
import NotificationsPage from "../clientComponent/userMenu/NotificationPage/NotificaPage.js";
import CustomerServicePage from "../clientComponent/userMenu/CustomerService/CustomerServicePage.js";
import InvestorRelationsPage from "../clientComponent/userMenu/InvesterRelation/InvestorRelationPage.js";
import PolicyPage from "../clientComponent/userMenu/PolicyPage/PolicyPage.js";
import FeedbackPage from "../clientComponent/userMenu/FeedbackPage/FeedBackPage.js";
import HelpPage from "../clientComponent/userMenu/HelpPage/HelpPage.js";

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


export const userMenuItems = [
    { name: "User Dashboard", path: "/user_dashboard", icon: <DashboardIcon color="action" />, component: DashboardPage },
    { name: "User Edit Profile", path: "/user_edit-profile", icon: <EditIcon color="action" />, component: EditProfilePage },
    // { name: "User Account", path: "/user_account", icon: <AccountBoxIcon color="action" />, component: AccountPage },
    { name: "User BusinessList", path: "/user_business-list", icon: <BusinessCenterIcon color="action" />, component: BusinessListPage },
    { name: "User Favorites", path: "/user_favorites", icon: <FavoriteBorderIcon color="action" />, component: FavoritesPage },
    { name: "User Saved", path: "/user_saved", icon: <BookmarkBorderIcon color="action" />, component: SavedPage },
    { name: "User My Transaction", path: "/user_my-transaction", icon: <AccountBalanceWalletIcon color="action" />, component: MyTransactionPage },
    { name: "User Notifications", path: "/user_notifications", icon: <NotificationsActiveIcon color="action" />, component: NotificationsPage },
    { name: "User Customer Service", path: "/user_customer-service", icon: <HeadsetMicIcon color="action" />, component: CustomerServicePage },
    { name: "User Investor Relations", path: "/user_investor-relations", icon: <TrendingUpIcon color="action" />, component: InvestorRelationsPage },
    { name: "User Policy", path: "/user_policy", icon: <PolicyIcon color="action" />, component: PolicyPage },
    { name: "User Feedback", path: "/user_feedback", icon: <FeedbackIcon color="action" />, component: FeedbackPage },
    { name: "User Help", path: "/user_help", icon: <HelpOutlineIcon color="action" />, component: HelpPage },
    { name: "Change Language", isLanguageSwitch: true, icon: <LanguageIcon color="action" /> }, // <-- NEW: Custom item flag
    { name: "Logout", isLogout: true, path: "/logout", icon: <ExitToAppIcon color="action" /> }, // <-- NEW: Logout item flag
];

const CategoryBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
  const dispatch = useDispatch();

    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const otpState = useSelector((state) => state.otpReducer || {});
    const { viewResponse, verifyResponse } = otpState;
    const userName = viewResponse?.user?.userName || '';
    useEffect(() => {
    const mobile = localStorage.getItem("mobileNumber"); 
    if (mobile) {
        dispatch(viewOtpUser(mobile));
    }
}, [dispatch]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const checkLogin = () => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("mobileNumber");

        setIsLoggedIn(false);
        setIsDrawerOpen(false);
        navigate("/home");
        window.dispatchEvent(new Event('authChange'));
    };

    useEffect(() => {
        checkLogin();

        window.addEventListener("storage", checkLogin);

        window.addEventListener("authChange", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
            window.removeEventListener("authChange", checkLogin);
        };
    }, []);

    const handleDrawerToggle = (open) => (event) => {
        if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const handleDrawerItemClick = (item) => {
        setIsDrawerOpen(false);
        if (item.isLogout) {
            handleLogout();
        } else if (item.path) {
            navigate(item.path);
        }
    };
    const handleCategoryClick = (name) => {
        if (name === "Leads") {
            navigate("/leads");
        } else if (name === "Advertise") {
            navigate("/advertise"); 
        } else if (name === "Free Listing") {
            navigate("/free-listing"); 
        }
    };

    const drawerList = (currentPath) => (
        <Box sx={{ width: 320 }} role="presentation" onClick={handleDrawerToggle(false)} onKeyDown={handleDrawerToggle(false)}>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                bgcolor: '#fafafa',
                borderBottom: '1px solid #eee'
            }}>
                <IconButton onClick={handleDrawerToggle(false)} sx={{ color: 'text.secondary', mr: 2, p: 0 }}>
                    <CloseIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}>
                        Click to view profile
                    </Typography>
                </Box>

                <Avatar sx={{ width: 48, height: 48, ml: 2, bgcolor: '#F7941D' }}>P</Avatar> {/* Added an initial for visual */}
            </Box>

            <List disablePadding>
                {userMenuItems.map((item, index) => {

                    const isActive = currentPath === item.path;

                    if (item.isLanguageSwitch) {
                        return (
                            <ListItem key={item.name} disablePadding sx={{ py: 1.5, px: 3, borderTop: '1px solid #f0f0f0' }}>
                                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} sx={{ m: 0, flex: 'none', color: 'text.primary', fontWeight: 500 }} />
                                <FormControl size="small" sx={{ ml: 'auto', minWidth: 100 }}>
                                    <Select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            fontSize: "0.9rem",
                                            height: 36,
                                            boxShadow: 'none',
                                            '& fieldset': { border: '1px solid #ddd !important' },
                                            '.MuiSelect-select': { py: '6px' }
                                        }}
                                    >
                                        {languages.map((lang) => (
                                            <MenuItem key={lang.name} value={lang.name} sx={{ fontSize: "0.9rem" }}>
                                                {lang.nativeName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ListItem>
                        );
                    }

                    /* Standard Menu Item */
                    return (
                        <React.Fragment key={index}>
                            {(item.name === "User Edit Profile" || item.name === "User Policy") && (
                                <Divider sx={{ my: 1, borderColor: '#f0f0f0' }} />
                            )}

                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => handleDrawerItemClick(item)}
                                    sx={{
                                        py: 1.2,
                                        px: 3, // Consistent padding
                                        bgcolor: isActive ? 'rgba(247, 148, 29, 0.08)' : (item.isLogout ? 'rgba(255, 0, 0, 0.05)' : 'transparent'),
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(247, 148, 29, 0.15)' : (item.isLogout ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)')
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {/* Use a Box to control icon color and size */}
                                        <Box sx={{ color: isActive ? '#F7941D' : (item.isLogout ? 'error.main' : 'text.secondary') }}>
                                            {item.icon}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name.startsWith('User ') ? item.name.replace('User ', '') : item.name} // Clean up redundant "User" prefix
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 500,
                                            fontSize: '0.95rem',
                                            color: isActive ? '#F7941D' : (item.isLogout ? 'error.main' : 'text.primary')
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );

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
                            "&:hover": { transform: "scale(1.05)" },
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
                                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
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

                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            variant="text"
                            startIcon={category.icon}
                            onClick={() => handleCategoryClick(category.name)}
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
                                "&:hover:after": { width: "80%" },
                            }}
                        >
                            {category.name}
                        </Button>
                    ))}
                </Box>

                {/* Desktop Right Section */}
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: { sm: 1.5, md: 2 },
                    }}
                >
                    {/* <-- UPDATED: Conditional rendering based on login */}
                    {!isLoggedIn ? (
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
                    ) : (
                        <IconButton
                            onClick={handleDrawerToggle(true)}
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
                    )}

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
                </Box>

                {/* Mobile Section */}
                <Box
                    sx={{
                        display: { xs: "flex", sm: "none" },
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {!isLoggedIn ? (
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
                    ) : (
                        <IconButton
                            sx={{ color: "gray" }}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                    )}

                    <IconButton
                        sx={{ color: "text.primary", display: { xs: "inline-flex", sm: "none" } }}
                        onClick={handleMenuClick}
                    >
                        <MenuIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Mobile Menu */}
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

            {/* Add Business Modal */}
            <AddBusinessModal open={isModalOpen} handleClose={handleCloseModal} />
            <SwipeableDrawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleDrawerToggle(false)}
                onOpen={handleDrawerToggle(true)}
            >
                {drawerList(location.pathname)}
            </SwipeableDrawer>
        </Box>
    );
};

export default CategoryBar;
