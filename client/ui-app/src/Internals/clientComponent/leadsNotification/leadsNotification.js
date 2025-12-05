// LeadsNotificationModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./leadsNotification.css";

const LeadsNotificationModal = ({ open, onClose, notifications }) => {
  const formatTime = (t) => {
    if (!t) return "";
    return new Date(t).toLocaleString();
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: 15, paddingBottom: 20 }
      }}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>Notifications</span>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {notifications.length === 0 ? (
          <div className="ln-empty">No notifications found.</div>
        ) : (
          <ul className="ln-list">
            {notifications.map((n, i) => (
              <li key={i} className="ln-item">
                <div className="ln-avatar">
                  {(n.userName || "U").charAt(0).toUpperCase()}
                </div>

                <div className="ln-body">
                  <div className="ln-text">
                    <strong>{n.userName || "Unknown"}</strong> searched "
                    <em>{n.searchedUserText}</em>"
                  </div>

                  <div className="ln-meta">
                    {n.email && <span>{n.email}</span>}
                    {n.mobileNumber1 && <span> • {n.mobileNumber1}</span>}
                    <span className="ln-time">{formatTime(n.time)}</span>
                  </div>
                </div>

                <div className="ln-dot"></div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadsNotificationModal;
