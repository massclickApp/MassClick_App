// LeadsCardHistory.jsx
import React, { useState, useMemo } from "react";
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
import ListIcon from '@mui/icons-material/List';
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

  // 👇 Comes from LeadsPage navigate(... { state: { leadsUsers } })
  const leadsUsers = location.state?.leadsUsers || [];

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedIcons, setExpandedIcons] = useState({});

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("latest"); 

  const totalLeads = leadsUsers.length;
  const phoneReadyCount = leadsUsers.filter(
    (u) => u.mobileNumber1 || u.mobileNumber2
  ).length;
  const emailReadyCount = leadsUsers.filter((u) => u.email).length;
  const whatsappReadyCount = phoneReadyCount; 

  const filteredLeads = useMemo(() => {
    let data = [...leadsUsers];

    if (searchText.trim()) {
      const value = searchText.toLowerCase();
      data = data.filter((u) => {
        const name = (u.userName || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return name.includes(value) || email.includes(value);
      });
    }

    // Sort
    data.sort((a, b) => {
      const ta = a.time ? new Date(a.time).getTime() : 0;
      const tb = b.time ? new Date(b.time).getTime() : 0;

      if (sortBy === "latest") return tb - ta;
      if (sortBy === "oldest") return ta - tb;

      if (sortBy === "name") {
        const na = (a.userName || "").toLowerCase();
        const nb = (b.userName || "").toLowerCase();
        if (na < nb) return -1;
        if (na > nb) return 1;
        return 0;
      }

      return 0;
    });

    return data;
  }, [leadsUsers, searchText, sortBy]);

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
  const toggleIcons = (index) => {
    setExpandedIcons((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderModalContent = () => {
    if (!selectedUser) return null;

    const phone = selectedUser.mobileNumber1 || selectedUser.mobileNumber2;
    const email = selectedUser.email;

    switch (modalType) {
      case "phone":
        return (
          <>
            <Typography variant="h6" className="mh-title">
              Call User
            </Typography>
            <Typography sx={{ mt: 2 }} className="mh-body">
              {phone || "No number available"}
            </Typography>
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
            <Typography variant="h6" className="mh-title">
              Email
            </Typography>
            <Typography sx={{ mt: 2 }} className="mh-body">
              {email || "No email available"}
            </Typography>
            <Chip
              className="mh-chip"
              icon={email ? <VerifiedIcon /> : <CancelIcon />}
              label={email ? "Email Available" : "No Email"}
              color={email ? "success" : "error"}
            />
          </>
        );

      case "whatsapp":
        return (
          <>
            <Typography variant="h6" className="mh-title">
              WhatsApp
            </Typography>
            <Typography sx={{ mt: 2 }} className="mh-body">
              {phone || "No number available"}
            </Typography>
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
            <div className="lh-brand-texts">
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
        <div className="lh-search-shell">
          <CardsSearch />
        </div>

        <section className="lh-content-card">
          {/* Header row */}
          <header className="lh-header">
            <div>
              <h2>Leads (Users who searched your category)</h2>
              <p className="lh-header-sub">
                Reach out to users who have shown interest in your business – call,
                WhatsApp, or email directly from here.
              </p>
            </div>
            <div className="lh-header-meta">
              <div className="lh-count">
                Showing <strong>{filteredLeads.length}</strong> of{" "}
                <strong>{totalLeads}</strong> leads
              </div>
            </div>
          </header>

          {/* Summary metrics strip */}
          <div className="lh-summary-row">
            <div className="lh-summary-card primary">
              <div className="lh-summary-label">Total Leads</div>
              <div className="lh-summary-value">{totalLeads}</div>
              <div className="lh-summary-chip">All captured users</div>
            </div>

            <div className="lh-summary-card">
              <div className="lh-summary-label">Phone Ready</div>
              <div className="lh-summary-value">{phoneReadyCount}</div>
              <div className="lh-summary-chip">Have at least one phone</div>
            </div>

            <div className="lh-summary-card">
              <div className="lh-summary-label">WhatsApp Ready</div>
              <div className="lh-summary-value">{whatsappReadyCount}</div>
              <div className="lh-summary-chip">Reach via WhatsApp</div>
            </div>

            <div className="lh-summary-card">
              <div className="lh-summary-label">Email Available</div>
              <div className="lh-summary-value">{emailReadyCount}</div>
              <div className="lh-summary-chip">Can send email</div>
            </div>
          </div>

          {/* Controls: search + sort */}
          <div className="lh-controls-row">
            <div className="lh-controls-left">
              <input
                className="lh-search-input"
                placeholder="Search lead by name or email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="lh-controls-right">
              <label className="lh-sort-label">
                Sort by:
                <select
                  className="lh-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {/* Content */}
          {filteredLeads.length === 0 ? (
            <div className="lh-empty">
              <p>No leads match your current filters.</p>
            </div>
          ) : (
            <div className="lh-grid">
              {filteredLeads.map((user, index) => {
                const hasPhone = !!(user.mobileNumber1 || user.mobileNumber2);
                const hasEmail = !!user.email;
                const hasWhatsApp = hasPhone; // simple assumption

                const displayPhone =
                  user.mobileNumber1 || user.mobileNumber2 || "No phone";

                return (
                  <article className="lh-card" key={index}>
                    <div className="lh-card-head">
                      <div className="lh-card-left">
                        <div className="lh-avatar-pill">
                          {(user.userName || "U")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="lh-card-texts">
                          <div className="lh-card-title">
                            {user.userName || "Unknown User"}
                          </div>
                          <div className="lh-card-meta">
                            {user.time && (
                              <span className="lh-date">
                                {new Date(user.time).toLocaleString()}
                              </span>
                            )}
                            <span className="lh-dot">•</span>
                            <span>{user.email || "No email"}</span>
                            <span className="lh-location">
                              — {displayPhone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="lh-card-icons">

                        {!expandedIcons[index] && (
                          <IconButton
                            className="icon-btn menu"
                            onClick={() => toggleIcons(index)}
                          >
                            <ListIcon />
                          </IconButton>
                        )}

                        {expandedIcons[index] && (
                          <>
                            <IconButton
                              className="icon-btn menu"
                              onClick={() => toggleIcons(index)}
                            >
                              <ListIcon />
                            </IconButton>

                            <IconButton
                              className="icon-btn call"
                              onClick={() => handleOpenModal("phone", user)}
                            >
                              <PhoneIcon />
                            </IconButton>

                            <IconButton
                              className="icon-btn whatsapp"
                              onClick={() => handleOpenModal("whatsapp", user)}
                            >
                              <WhatsAppIcon />
                            </IconButton>

                            <IconButton
                              className="icon-btn mail"
                              onClick={() => handleOpenModal("email", user)}
                            >
                              <EmailIcon />
                            </IconButton>

                            <IconButton
                              className="icon-btn share"
                              onClick={() =>
                                navigator.share
                                  ? navigator.share({
                                    title: user.userName || "Lead",
                                    text: `${user.userName || ""} - ${user.email || ""}`,
                                    url: window.location.href,
                                  })
                                  : alert("Sharing not supported")
                              }
                            >
                              <ShareIcon />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="lh-divider" />

                    <div className="lh-card-body">
                      <p className="lh-match">
                        This user recently searched for businesses in your
                        category. Reach out to convert this interest into a
                        customer.
                      </p>

                      <div className="lh-pill-row">
                        <span
                          className={`lh-pill ${hasPhone ? "ok" : "muted"}`}
                        >
                          Phone
                        </span>
                        <span
                          className={`lh-pill ${hasWhatsApp ? "ok" : "muted"
                            }`}
                        >
                          WhatsApp
                        </span>
                        <span
                          className={`lh-pill ${hasEmail ? "ok" : "muted"}`}
                        >
                          Email
                        </span>
                      </div>
                    </div>

                    <div className="lh-card-actions">
                      <Button startIcon={<NoteIcon />} variant="outlined">
                        Add Note
                      </Button>
                      <Button startIcon={<ReminderIcon />} variant="outlined">
                        Reminder
                      </Button>
                      <Button variant="contained" startIcon={<StarIcon />}>
                        Ask Rating
                      </Button>
                    </div>
                  </article>
                );
              })}
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
