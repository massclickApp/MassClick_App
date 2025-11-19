
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./leadsCards.css";

import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  NotificationsActive as NoteIcon,
  AccessAlarm as ReminderIcon,
  StarRate as StarIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { Button, Modal, Box, Typography, Chip } from "@mui/material";

import CardsSearch from "../../CardsSearch/CardsSearch";
import FastRewindIcon from "@mui/icons-material/FastRewind";

const LeadsCardHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchHistory = location.state?.searchHistory || [];
  const userDetails = location.state?.userDetails || {};

  const { mobileNumber1, emailVerified } = userDetails;

  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("");

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const renderModalContent = () => {
    switch (modalType) {
      case "phone":
        return (
          <>
            <Typography variant="h6">📞 User Phone Number</Typography>
            <Typography sx={{ mt: 2 }}>{mobileNumber1}</Typography>
            <Button variant="contained" color="success" href={`tel:${mobileNumber1}`} sx={{ mt: 3 }}>
              Call Now
            </Button>
          </>
        );

      case "email":
        return (
          <>
            <Typography variant="h6">📧 Email Verification</Typography>
            <Chip
              icon={emailVerified ? <VerifiedIcon /> : <CancelIcon />}
              label={emailVerified ? "Verified" : "Not Verified"}
              color={emailVerified ? "success" : "error"}
              sx={{ mt: 2 }}
            />
          </>
        );

      case "whatsapp":
        return (
          <>
            <Typography variant="h6">💬 WhatsApp Contact</Typography>
            <Typography sx={{ mt: 2 }}>{mobileNumber1}</Typography>
            <Button
              variant="contained"
              color="success"
              href={`https://wa.me/${mobileNumber1}`}
              target="_blank"
              sx={{ mt: 3 }}
            >
              Open WhatsApp
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <CardsSearch />
      <br />
      <br />
      <br />

      <div className="search-history-page">
        <header className="search-history-header">
          <Button variant="contained" color="warning" size="small" onClick={() => navigate(-1)}>
            <FastRewindIcon />
          </Button>
          <h2>User Search History</h2>
        </header>

        {searchHistory.length === 0 ? (
          <p className="no-history">No matching history found.</p>
        ) : (
          <div className="search-history-cards">
            {searchHistory.map((item) => (
              <div className="modern-card" key={item._id}>
                <div className="modern-card-header">
                  <span className="date">
                    {item.searchedAt ? new Date(item.searchedAt).toLocaleDateString("en-GB") : "—"}
                  </span>

                  <div className="icon-row">
                    <PhoneIcon onClick={() => handleOpenModal("phone")} />
                    <WhatsAppIcon onClick={() => handleOpenModal("whatsapp")} />
                    <EmailIcon onClick={() => handleOpenModal("email")} />
                    <ShareIcon />
                  </div>
                </div>

                <h3>{item.query}</h3>
                <p>{item.location}</p>
                <p>{item.category}</p>

                <div className="divider" />

                <p>
                  <strong>{item.query}</strong> matches your business category.
                </p>

                <div className="card-actions">
                  <Button variant="contained" startIcon={<NoteIcon />}>Add Note</Button>
                  <Button variant="contained" startIcon={<ReminderIcon />}>Reminder</Button>
                  <Button variant="contained" startIcon={<StarIcon />}>Ask Rating</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          {renderModalContent()}

          <Button variant="outlined" color="error" sx={{ mt: 3 }} onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default LeadsCardHistory;
