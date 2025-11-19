// LeadsCardHistory.jsx
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
  ArrowBackIosNew as BackIcon
} from "@mui/icons-material";

import { Button, Modal, Box, Typography, Chip, IconButton } from "@mui/material";

import CardsSearch from "../../CardsSearch/CardsSearch";

const logoUrl = "/mnt/data/30429df4-c55e-4274-a7ab-b2327308fb94.png";

const LeadsCardHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchHistory = location.state?.searchHistory || [];
  const userDetails = location.state?.userDetails || {};

  const { mobileNumber1, emailVerified } = userDetails;

  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const [modalPayload, setModalPayload] = React.useState(null);

  const handleOpenModal = (type, payload = null) => {
    setModalType(type);
    setModalPayload(payload);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType("");
    setModalPayload(null);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "phone":
        return (
          <>
            <Typography variant="h6" className="mh-title">📞 Call User</Typography>
            <Typography className="mh-body">{modalPayload?.mobile || mobileNumber1 || "—"}</Typography>
            <div className="mh-cta-row">
              <Button variant="contained" color="success" href={`tel:${modalPayload?.mobile || mobileNumber1}`}>Call Now</Button>
              <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
            </div>
          </>
        );

      case "email":
        return (
          <>
            <Typography variant="h6" className="mh-title">📧 Email Verification</Typography>
            <Chip
              icon={emailVerified ? <VerifiedIcon /> : <CancelIcon />}
              label={emailVerified ? "Verified" : "Not Verified"}
              color={emailVerified ? "success" : "error"}
              className="mh-chip"
            />
            <div className="mh-cta-row">
              <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
            </div>
          </>
        );

      case "whatsapp":
        return (
          <>
            <Typography variant="h6" className="mh-title">💬 WhatsApp</Typography>
            <Typography className="mh-body">{modalPayload?.mobile || mobileNumber1 || "—"}</Typography>
            <div className="mh-cta-row">
              <Button
                variant="contained"
                color="success"
                href={`https://wa.me/${modalPayload?.mobile || mobileNumber1}`}
                target="_blank"
                rel="noreferrer"
              >
                Open WhatsApp
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="lh-topbar">
        <div className="lh-topbar-inner">
          <div className="lh-brand">
            <img src={logoUrl} alt="Massclick" className="lh-logo" />
            <div className="lh-brand-texts">
              <div className="lh-title">Massclick</div>
              <div className="lh-sub">India's Leading Local Search Engine</div>
            </div>
          </div>

          <div className="lh-actions">
            <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>
      </div>

      <main className="lh-container">
        <CardsSearch />

        <section className="lh-content-card">
          <header className="lh-header">
            <h2>User Search History</h2>
            <div className="lh-header-meta">
              <div className="lh-count">{searchHistory.length} {searchHistory.length === 1 ? 'result' : 'results'}</div>
              <div className="lh-header-actions">
                <Button variant="contained" color="primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Top</Button>
              </div>
            </div>
          </header>

          {searchHistory.length === 0 ? (
            <div className="lh-empty">
              <p>No matching history found.</p>
              <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          ) : (
            <div className="lh-grid">
              {searchHistory.map((item) => (
                <article className="lh-card" key={item._id}>
                  <div className="lh-card-head">
                    <div className="lh-card-left">
                      <div className="lh-card-title">{item.query}</div>
                      <div className="lh-card-meta">
                        <span className="lh-date">{item.searchedAt ? new Date(item.searchedAt).toLocaleString() : "—"}</span>
                        <span className="lh-dot" aria-hidden>•</span>
                        <span className="lh-category">{item.category || "—"}</span>
                        <span className="lh-location">— {item.location || "Global"}</span>
                      </div>
                    </div>

                    <div className="lh-card-icons" role="group" aria-label="contact actions">
                      <IconButton aria-label="call" className="icon-btn call" onClick={() => handleOpenModal("phone", { mobile: mobileNumber1 })}>
                        <PhoneIcon />
                      </IconButton>

                      <IconButton aria-label="whatsapp" className="icon-btn whatsapp" onClick={() => handleOpenModal("whatsapp", { mobile: mobileNumber1 })}>
                        <WhatsAppIcon />
                      </IconButton>

                      <IconButton aria-label="email" className="icon-btn mail" onClick={() => handleOpenModal("email")}>
                        <EmailIcon />
                      </IconButton>

                      <IconButton aria-label="share" className="icon-btn share" onClick={() => navigator.share ? navigator.share({ title: item.query, text: item.query, url: window.location.href }) : alert('Share not supported')} >
                        <ShareIcon />
                      </IconButton>
                    </div>
                  </div>

                  <div className="lh-divider" />

                  <div className="lh-card-body">
                    <p className="lh-match">This search <strong>{item.query}</strong> matches your business category.</p>
                  </div>

                  <div className="lh-card-actions">
                    <Button variant="outlined" startIcon={<NoteIcon />}>Add Note</Button>
                    <Button variant="outlined" startIcon={<ReminderIcon />}>Reminder</Button>
                    <Button variant="contained" startIcon={<StarIcon />}>Ask Rating</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="lh-modal-title" aria-describedby="lh-modal-desc">
        <Box className="lh-modal">
          {renderModalContent()}
        </Box>
      </Modal>
    </>
  );
};

export default LeadsCardHistory;
