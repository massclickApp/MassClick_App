import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { updateOtpUser, viewOtpUser } from "../../../redux/actions/otpAction";

import "./leadsNotification.css";

const LeadsNotificationModal = ({ open, onClose,  notifications = []  }) => {
  const dispatch = useDispatch();

  const [selectedLead, setSelectedLead] = useState(null);
  const [readItems, setReadItems] = useState([]);

  const authUser = useSelector((state) => state.otp.viewResponse) || {};
  const leadsData = authUser?.leadsData || [];

  const timeAgo = (time) => {
    if (!time) return "";
    const now = new Date();
    const diff = (now - new Date(time)) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return new Date(time).toLocaleDateString();
  };

  const handleRead = async (n) => {
    setSelectedLead(n);

    setReadItems((prev) => [...prev, n._id]);

    const businessMobile = localStorage.getItem("mobileNumber");

    await dispatch(
      updateOtpUser(businessMobile, {
        markRead: { leadId: n._id }
      })
    );

    await dispatch(viewOtpUser(businessMobile));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 22,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0px 15px 45px rgba(0,0,0,0.15)"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "2px solid #ffe5c4",
          background: "linear-gradient(90deg, #fff, #fff7ef)"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "#F7941D",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <NotificationsActiveIcon sx={{ color: "#F7941D" }} />
          Notifications
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {!selectedLead ? (
          <ul className="ln-modern-list">
            {notifications.map((n, i) => {
        
              const isRead =
                readItems.includes(n._id) || n.isReaded === true;

              return (
                <li
                  key={i}
                  className={`ln-modern-item ${
                    isRead ? "read" : "unread"
                  }`}
                  onClick={() => handleRead(n)}
                >
                  <div className="ln-modern-avatar">
                    {(n.userName || "U").charAt(0).toUpperCase()}
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

                  {!isRead && <div className="ln-modern-dot"></div>}
                </li>
              );
            })}
          </ul>
        ) : (
          <Box sx={{ p: 3 }}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "#fff",
                p: 2,
                boxShadow: "0 5px 15px rgba(247,148,29,0.25)"
              }}
            >
              <Box
                sx={{
                  background: "#fff7ef",
                  p: 2,
                  borderRadius: 3,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #ffd6aa"
                }}
              >
                <Box>
                  <Typography
                    fontWeight={700}
                    fontSize={18}
                    color="#F7941D"
                  >
                    {selectedLead.userName}
                  </Typography>
                  <Typography fontSize={13} color="#e97700">
                    Lead ID: {selectedLead._id}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    cursor: "pointer",
                    color: "#666"
                  }}
                  onClick={() => setSelectedLead(null)}
                >
                  Hide
                </Typography>
              </Box>

              {/* DETAILS */}
              <Box
                sx={{
                  background: "linear-gradient(180deg,#fff7ef,#ffeedd)",
                  borderRadius: 3,
                  p: 2.5,
                  border: "1px solid #ffdaba"
                }}
              >
                <Box className="ln-row">
                  <PhoneIphoneIcon sx={{ color: "#F7941D" }} />
                  <strong>Mobile:</strong> &nbsp;
                  {selectedLead.mobileNumber1}
                </Box>

                <Box className="ln-row">
                  <PhoneIphoneIcon sx={{ color: "#F7941D" }} />
                  <strong>Mobile 2:</strong> &nbsp;
                  {selectedLead.mobileNumber2}
                </Box>

                <Box className="ln-row">
                  <AttachEmailIcon sx={{ color: "#F7941D" }} />
                  <strong>Email:</strong> &nbsp;
                  {selectedLead.email || "N/A"}
                </Box>

                <Box className="ln-row">
                  <CategoryIcon sx={{ color: "#F7941D" }} />
                  <strong>Category:</strong> &nbsp;
                  {selectedLead.searchedUserText}
                </Box>

                <Box className="ln-row">
                  <AccessTimeIcon sx={{ color: "#F7941D" }} />
                  <strong>Created:</strong> &nbsp;
                  {new Date(selectedLead.time).toLocaleString()}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadsNotificationModal;
