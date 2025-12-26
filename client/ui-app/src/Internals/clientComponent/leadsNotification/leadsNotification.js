// LeadsNotificationModal.jsx
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

import "./leadsNotification.css";

const LeadsNotificationModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const runtimeLeads =
    useSelector((state) => state.otp.runtimeLeadsNotifications) || [];

  const [selectedLead, setSelectedLead] = useState(null);

  const timeAgo = (time) => {
    if (!time) return "";
    const diff = (Date.now() - new Date(time)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return new Date(time).toLocaleDateString();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="ln-header">
        <Stack direction="row" alignItems="center" spacing={1}>
          <NotificationsActiveIcon color="warning" />
          <Typography fontWeight={700}>Notifications</Typography>
        </Stack>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent className="ln-content">
        {!selectedLead ? (
          runtimeLeads.length ? (
            <ul className="ln-modern-list">
              {runtimeLeads.map((n) => (
                <li
                  key={n._id}
                  className="ln-modern-item unread"
                  onClick={() => setSelectedLead(n)}
                >
                  <div className="ln-modern-avatar">
                    {(n.userName || "U")[0]}
                  </div>
                  <div className="ln-modern-body">
                    <span className="ln-modern-title">
                      <strong>{n.userName}</strong> searched{" "}
                      <strong>"{n.searchedUserText}"</strong>
                    </span>
                    <span className="ln-modern-time">
                      {timeAgo(n.time)}
                    </span>
                  </div>
                  <span className="ln-modern-dot" />
                </li>
              ))}
            </ul>
          ) : (
            <Box className="ln-empty">
              <Typography>No notifications yet</Typography>
            </Box>
          )
        ) : (
          <Box className="ln-details">
            <Stack direction="row" spacing={1} mb={2}>
              <IconButton onClick={() => setSelectedLead(null)}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <Typography fontWeight={600}>Lead Details</Typography>
            </Stack>

            <Paper className="ln-details-card">
              <DetailRow icon={<AttachEmailIcon />} value={selectedLead.email || "N/A"} />
              <DetailRow icon={<PhoneIphoneIcon />} value={selectedLead.mobileNumber1 || "N/A"} />
              <DetailRow icon={<CategoryIcon />} value={selectedLead.searchedUserText} />
              <DetailRow
                icon={<AccessTimeIcon />}
                value={new Date(selectedLead.time).toLocaleString()}
              />
            </Paper>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DetailRow = ({ icon, value }) => (
  <Stack direction="row" spacing={2} alignItems="center" className="ln-row">
    {icon}
    <Typography>{value}</Typography>
  </Stack>
);

export default LeadsNotificationModal;
