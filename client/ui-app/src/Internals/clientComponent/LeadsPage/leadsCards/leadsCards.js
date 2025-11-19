// LeadsCardHistory.jsx
import React, { useState } from "react";
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
  ArrowBackIosNew as BackIcon,
} from "@mui/icons-material";

import {
  Button,
  Modal,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";

import CardsSearch from "../../CardsSearch/CardsSearch";

const logoUrl = "/mnt/data/30429df4-c55e-4274-a7ab-b2327308fb94.png";

const LeadsCardHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 Comes from LeadsPage navigate(...)
  const leadsUsers = location.state?.leadsUsers || [];

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setModalType("");
    setSelectedUser(null);
    setOpenModal(false);
  };

  const renderModalContent = () => {
    if (!selectedUser) return null;

    const phone = selectedUser.mobileNumber1 || selectedUser.mobileNumber2;
    const email = selectedUser.email;

    switch (modalType) {
      case "phone":
        return (
          <>
            <Typography variant="h6">Call User</Typography>
            <Typography sx={{ mt: 2 }}>{phone || "No number"}</Typography>
            {phone && (
              <Button
                variant="contained"
                color="success"
                href={`tel:${phone}`}
                sx={{ mt: 3 }}
              >
                Call Now
              </Button>
            )}
          </>
        );

      case "email":
        return (
          <>
            <Typography variant="h6">Email</Typography>
            <Typography sx={{ mt: 2 }}>{email || "No email"}</Typography>
            <Chip
              icon={email ? <VerifiedIcon /> : <CancelIcon />}
              label={email ? "Email Available" : "No Email"}
              color={email ? "success" : "error"}
              sx={{ mt: 2 }}
            />
          </>
        );

      case "whatsapp":
        return (
          <>
            <Typography variant="h6">WhatsApp</Typography>
            <Typography sx={{ mt: 2 }}>{phone || "No number"}</Typography>
            {phone && (
              <Button
                variant="contained"
                color="success"
                href={`https://wa.me/${phone}`}
                target="_blank"
                sx={{ mt: 3 }}
              >
                Open WhatsApp
              </Button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="lh-topbar">
        <div className="lh-topbar-inner">
          <div className="lh-brand">
            <img src={logoUrl} className="lh-logo" alt="Massclick" />
            <div>
              <div className="lh-title">Massclick</div>
              <div className="lh-sub">India&apos;s Leading Local Search Engine</div>
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

      {/* MAIN */}
      <main className="lh-container">
        <CardsSearch />

        <section className="lh-content-card">
          <header className="lh-header">
            <h2>Leads (Users who searched your category)</h2>
            <div className="lh-header-meta">
              <div className="lh-count">{leadsUsers.length} results</div>
            </div>
          </header>

          {leadsUsers.length === 0 ? (
            <div className="lh-empty">
              <p>No leads found.</p>
            </div>
          ) : (
            <div className="lh-grid">
              {leadsUsers.map((user, index) => (
                <article className="lh-card" key={index}>
                  <div className="lh-card-head">
                    <div>
                      <div className="lh-card-title">
                        {user.userName || "Unknown User"}
                      </div>
                      <div className="lh-card-meta">
                        {user.time && (
                          <span>{new Date(user.time).toLocaleString()}</span>
                        )}
                        <span className="lh-dot">•</span>
                        <span>{user.email || "No email"}</span>
                        <span className="lh-location">
                          — {user.mobileNumber1 || user.mobileNumber2 || "No phone"}
                        </span>
                      </div>
                    </div>

                    <div className="lh-card-icons">
                      <IconButton onClick={() => handleOpenModal("phone", user)}>
                        <PhoneIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal("whatsapp", user)}>
                        <WhatsAppIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal("email", user)}>
                        <EmailIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          navigator.share
                            ? navigator.share({
                                title: user.userName || "Lead",
                                text: `${user.userName || ""} - ${
                                  user.email || ""
                                }`,
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
                    <p>
                      This user searched your business category recently.
                      <br />
                      <strong>
                        📞 {user.mobileNumber1}
                        {user.mobileNumber2 ? `, ${user.mobileNumber2}` : ""}
                      </strong>
                      <br />
                      <strong>✉️ {user.email || "No email"}</strong>
                    </p>
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
