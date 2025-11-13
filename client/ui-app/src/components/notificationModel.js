import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  useMediaQuery,
  Slide,
  CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllStartProjects } from "../redux/actions/startProjectAction";

export default function NotificationDropdown({ open, handleClose }) {
  const dispatch = useDispatch();
  const { projects = [], loading } = useSelector(
    (state) => state.startProjectReducer || {}
  );

  const [selected, setSelected] = useState(null);
  const [readNotifications, setReadNotifications] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const accentColor = "#f57c00";

  useEffect(() => {
    if (open) dispatch(getAllStartProjects());
  }, [dispatch, open]);

  const handleSelect = (proj) => {
    setSelected(proj);
    if (!readNotifications.includes(proj._id)) {
      setReadNotifications((prev) => [...prev, proj._id]);
    }
  };

  const containerStyle = {
    position: "absolute",
    top: isMobile ? "60px" : "70px",
    right: isMobile ? "10px" : "25px",
    width: isMobile ? "92%" : "360px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
    overflow: "hidden",
    zIndex: 9999,
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  };

  const listContainer = {
    maxHeight: isMobile ? "70vh" : "60vh",
    overflowY: "auto",
    padding: "10px 12px",
  };
const detailItem = {
  fontSize: "0.9rem",
  mb: 1,
  color: "#333",
  lineHeight: 1.4,
  display: "flex",
  gap: "6px",
};

  return (
    open && (
      <Box sx={containerStyle}>
        {/* Header */}
        <Box sx={headerStyle}>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActiveRoundedIcon sx={{ color: accentColor }} />
            <Typography
              sx={{
                fontWeight: 700,
                color: accentColor,
                fontSize: "1rem",
              }}
            >
              Notifications
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Divider />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={5}
          >
            <CircularProgress sx={{ color: accentColor }} />
          </Box>
        ) : (
          <Box sx={listContainer}>
            {!selected ? (
              <List>
                {projects.map((proj) => {
                  const isRead = readNotifications.includes(proj._id);
                  return (
                    <ListItem
                      key={proj._id}
                      onClick={() => handleSelect(proj)}
                      sx={{
                        borderRadius: "14px",
                        mb: 1.2,
                        px: 1.2,
                        py: 1.3,
                        backgroundColor: isRead ? "#fff" : "#fff7ed", // ✅ unread = orange tint
                        boxShadow: isRead
                          ? "0 2px 4px rgba(0,0,0,0.05)"
                          : "0 2px 8px rgba(245,124,0,0.25)", // subtle glow for unread
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          backgroundColor: isRead ? "#fff5eb" : "#ffecdb",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: accentColor,
                            fontWeight: 600,
                          }}
                        >
                          {proj.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              color: "#333",
                            }}
                          >
                            {proj.fullName}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color: "#555",
                              fontSize: "0.8rem",
                              mt: 0.3,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {proj.businessName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Slide direction="left" in={!!selected} mountOnEnter unmountOnExit>
                <Box>
                  {/* Header */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                    px={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: accentColor }}>
                        {selected.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>

                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#333",
                            fontSize: "1rem",
                            lineHeight: 1.1,
                          }}
                        >
                          {selected.fullName}
                        </Typography>

                        <Typography sx={{ color: "#777", fontSize: "0.8rem" }}>
                          {selected.businessName || "No Business Name"}
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton
                      size="small"
                      sx={{ color: accentColor }}
                      onClick={() => setSelected(null)}
                    >
                      <ArrowBackRoundedIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* DETAILS SECTION */}
                  <Box px={1} sx={{ maxHeight: "60vh", overflowY: "auto" }}>

                    {/* Contact Number */}
                    <Typography sx={detailItem}>
                      📞 <b>Contact:</b> {selected.contactNumber || "N/A"}
                    </Typography>

                    {/* Email */}
                    <Typography sx={detailItem}>
                      ✉️ <b>Email:</b> {selected.email || "N/A"}
                    </Typography>

                    {/* Business Name */}
                    <Typography sx={detailItem}>
                      🏢 <b>Business Name:</b> {selected.businessName || "N/A"}
                    </Typography>

                    {/* Business Type */}
                    <Typography sx={detailItem}>
                      🏭 <b>Business Type:</b> {selected.businessType || "N/A"}
                    </Typography>

                    {/* Category */}
                    <Typography sx={detailItem}>
                      📂 <b>Category:</b> {selected.category || "N/A"}
                    </Typography>

                    {/* Sub Category */}
                    <Typography sx={detailItem}>
                      📁 <b>Sub Category:</b> {selected.subCategory || "N/A"}
                    </Typography>

                    {/* Business Phone */}
                    <Typography sx={detailItem}>
                      ☎️ <b>Business Phone:</b> {selected.businessPhone || "N/A"}
                    </Typography>

                    {/* Address */}
                    <Typography sx={detailItem}>
                      📍 <b>Address:</b> {selected.address || "N/A"}
                    </Typography>

                    {/* City */}
                    <Typography sx={detailItem}>
                      🏙️ <b>City:</b> {selected.city || "N/A"}
                    </Typography>

                    {/* State */}
                    <Typography sx={detailItem}>
                      🗺️ <b>State:</b> {selected.state || "N/A"}
                    </Typography>

                    {/* Country */}
                    <Typography sx={detailItem}>
                      🌎 <b>Country:</b> {selected.country || "N/A"}
                    </Typography>

                    {/* Postal Code */}
                    <Typography sx={detailItem}>
                      🔢 <b>Postal Code:</b> {selected.postalCode || "N/A"}
                    </Typography>

                    {/* Message */}
                    <Typography sx={detailItem}>
                      💬 <b>Message:</b> {selected.message || "N/A"}
                    </Typography>

                    {/* Notes */}
                    <Typography sx={detailItem}>
                      📝 <b>Notes:</b> {selected.notes || "N/A"}
                    </Typography>

                    {/* Submitted At */}
                    <Typography sx={{ ...detailItem, color: "#888" }}>
                      🕒 <b>Submitted:</b>{" "}
                      {selected.submittedAt
                        ? new Date(selected.submittedAt).toLocaleString()
                        : ""}
                    </Typography>

                  </Box>
                </Box>
              </Slide>

            )}
          </Box>
        )}
      </Box>
    )
  );
}
