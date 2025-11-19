// LeadsCardHistory.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./leadsCards.css";
import { useSelector, useDispatch } from "react-redux";
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
  ArrowBackIosNew as BackIcon
} from "@mui/icons-material";

import { Button, Modal, Box, Typography, Chip, IconButton } from "@mui/material";
import CardsSearch from "../../CardsSearch/CardsSearch";
import { getAllSearchLogs } from "../../../../redux/actions/businessListAction";

const logoUrl =
  "/mnt/data/30429df4-c55e-4274-a7ab-b2327308fb94.png";

const LeadsCardHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { searchLogs } = useSelector(
    (state) => state.businessListReducer
  );

  const searchHistory = location.state?.searchHistory || [];
  const userDetails = location.state?.userDetails || {};

  const { mobileNumber1, emailVerified } = userDetails;

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalPayload, setModalPayload] = useState(null);

  useEffect(() => {
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  const handleOpenModal = (type, payload = null) => {
    setModalType(type);
    setModalPayload(payload);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setModalType("");
    setModalPayload(null);
    setOpenModal(false);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "phone":
        return (
          <>
            <Typography variant="h6">Call User</Typography>
            <Typography sx={{ mt: 2 }}>
              {modalPayload?.mobile || mobileNumber1}
            </Typography>
            <Button
              variant="contained"
              color="success"
              href={`tel:${modalPayload?.mobile || mobileNumber1}`}
              sx={{ mt: 3 }}
            >
              Call Now
            </Button>
          </>
        );

      case "email":
        return (
          <>
            <Typography variant="h6">Email Status</Typography>
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
            <Typography variant="h6">WhatsApp</Typography>
            <Typography sx={{ mt: 2 }}>
              {modalPayload?.mobile || mobileNumber1}
            </Typography>

            <Button
              variant="contained"
              color="success"
              href={`https://wa.me/${modalPayload?.mobile || mobileNumber1}`}
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
      {/* HEADER BAR */}
      <div className="lh-topbar">
        <div className="lh-topbar-inner">
          <div className="lh-brand">
            <img src={logoUrl} className="lh-logo" alt="Massclick" />
            <div>
              <div className="lh-title">Massclick</div>
              <div className="lh-sub">India's Leading Local Search Engine</div>
            </div>
          </div>

          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="lh-container">
        <CardsSearch />

        <section className="lh-content-card">
          <header className="lh-header">
            <h2>User Search History</h2>
            <div className="lh-header-meta">
              <div className="lh-count">
                {searchHistory.length} results
              </div>
            </div>
          </header>

          {searchHistory.length === 0 ? (
            <div className="lh-empty">
              <p>No matching search history found.</p>
            </div>
          ) : (
            <div className="lh-grid">
              {searchHistory.map((item) => (
                <article className="lh-card" key={item._id}>
                  <div className="lh-card-head">
                    <div>
                      <div className="lh-card-title">{item.query}</div>
                      <div className="lh-card-meta">
                        <span>
                          {new Date(item.searchedAt).toLocaleString()}
                        </span>
                        <span className="lh-dot">•</span>
                        <span>{item.category}</span>
                        <span className="lh-location">
                          — {item.location || "Global"}
                        </span>
                      </div>
                    </div>

                    <div className="lh-card-icons">
                      <IconButton onClick={() => handleOpenModal("phone")}>
                        <PhoneIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal("whatsapp")}>
                        <WhatsAppIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal("email")}>
                        <EmailIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          navigator.share
                            ? navigator.share({
                                title: item.query,
                                text: item.query,
                                url: window.location.href,
                              })
                            : alert("Sharing not supported")
                        }
                      >
                        <ShareIcon />
                      </IconButton>
                    </div>
                  </div>

                  <div className="lh-divider" />

                  <div className="lh-card-body">
                    This search <strong>{item.query}</strong> matches your
                    business category.
                  </div>

                  <div className="lh-card-actions">
                    <Button startIcon={<NoteIcon />}>Add Note</Button>
                    <Button startIcon={<ReminderIcon />}>Reminder</Button>
                    <Button variant="contained" startIcon={<StarIcon />}>
                      Ask Rating
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="lh-modal">{renderModalContent()}</Box>
      </Modal>
    </>
  );
};

export default LeadsCardHistory;
