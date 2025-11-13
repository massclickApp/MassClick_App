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
import {
  Button,
  Tooltip,
  Modal,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import CardsSearch from "../../CardsSearch/CardsSearch";
import FastRewindIcon from '@mui/icons-material/FastRewind';

const LeadsCardHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchHistory = location.state?.searchHistory || [];
  const userDetails = location.state?.userDetails || {};

  const { userName, mobileNumber1, emailVerified } = userDetails;

  // ✅ Modal states
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
            <Typography id="modal-title" variant="h6" fontWeight={600}>
              📞 User Phone Number
            </Typography>
            <Typography id="modal-desc" sx={{ mt: 2, fontSize: "1.1rem" }}>
              {mobileNumber1 || "❌ Phone number not available"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 3,
              }}
            >
              {mobileNumber1 && (
                <Button
                  variant="contained"
                  color="success"
                  href={`tel:${mobileNumber1}`}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  Call Now
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </>
        );

      case "email":
        return (
          <>
            <Typography id="modal-title" variant="h6" fontWeight={600}>
              📧 Email Verification Status
            </Typography>
            <Box sx={{ mt: 3 }}>
              {emailVerified ? (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Email Verified"
                  color="success"
                  sx={{ fontSize: "1rem", p: 1 }}
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  label="Not Verified"
                  color="error"
                  sx={{ fontSize: "1rem", p: 1 }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </>
        );

      case "whatsapp":
        return (
          <>
            <Typography id="modal-title" variant="h6" fontWeight={600}>
              💬 WhatsApp Contact
            </Typography>
            <Typography id="modal-desc" sx={{ mt: 2, fontSize: "1.1rem" }}>
              {mobileNumber1 || "❌ Number not available"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 3,
              }}
            >
              {mobileNumber1 && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                  }}
                  href={`https://wa.me/${mobileNumber1}`}
                  target="_blank"
                >
                  Open WhatsApp
                </Button>
              )}
              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
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
      <br />

      <div className="search-history-page">
        <header className="search-history-header">
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            <FastRewindIcon />
          </Button>
          <h2>User Search History</h2>
        </header>

        {searchHistory.length === 0 ? (
          <p className="no-history">No search history found.</p>
        ) : (
          <div className="search-history-cards">
            {searchHistory.map((item, index) => (
              <div className="modern-card" key={item._id || index}>
                <div className="modern-card-header">
                  <div className="card-left">
                    <span className="date">
                      {new Date(item.searchedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="card-right">
                    <Tooltip title="Click to View Number">
                      <PhoneIcon
                        className="mui-icon call"
                        onClick={() => handleOpenModal("phone")}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>

                    <Tooltip title="WhatsApp">
                      <WhatsAppIcon
                        className="mui-icon whatsapp"
                        onClick={() => handleOpenModal("whatsapp")}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>

                    <Tooltip title="Email Verification">
                      <EmailIcon
                        className="mui-icon mail"
                        onClick={() => handleOpenModal("email")}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>

                    <Tooltip title="Share">
                      <ShareIcon className="mui-icon share" />
                    </Tooltip>
                  </div>
                </div>

                <div className="modern-card-content">
                  <h3 className="card-title">{item.query}</h3>
                  <p className="location">{item.location}</p>
                  <p className="category">{item.category}</p>
                </div>

                <div className="divider"></div>

                <div className="card-description">
                  <p>
                    <strong>{item.query}</strong> has a requirement in the
                    category you deal with.
                  </p>
                  <p className="source">
                    Enquiry Source:{" "}
                    <span className="source-highlight">Search History</span>
                  </p>
                </div>

                <div className="card-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<NoteIcon />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Add Note
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReminderIcon />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Add Reminder
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<StarIcon />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Ask Rating
                  </Button>
                </div>

                <div className="whatsapp-section">
                  <p className="whatsapp-title">
                    Choose What You Want to Share on WhatsApp
                  </p>
                  <div className="whatsapp-buttons">
                    {[
                      "Business Photo",
                      "Catalogue",
                      "Address",
                      "Services",
                      "Reviews",
                    ].map((label, i) => (
                      <Button
                        key={i}
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#25d366",
                          textTransform: "none",
                          fontSize: "13px",
                          borderRadius: "8px",
                          "&:hover": { backgroundColor: "#1da851" },
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          {renderModalContent()}
        </Box>
      </Modal>
    </>
  );
};

export default LeadsCardHistory;
