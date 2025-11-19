// LeadsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewAllOtpUsers } from "../../../redux/actions/otpAction";
import { getAllSearchLogs } from "../../../redux/actions/businessListAction";
import { useNavigate } from "react-router-dom";
import CardsSearch from "../CardsSearch/CardsSearch";
import "./leadsPage.css";

const logoUrl =
  "/mnt/data/30429df4-c55e-4274-a7ab-b2327308fb94.png";

function StatCard({ label, value, onClick, accent, children }) {
  return (
    <button
      className={`lp-stat-card ${accent ? "lp-stat-accent" : ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="lp-stat-left">
        <div className="lp-stat-value">{value}</div>
        <div className="lp-stat-label">{label}</div>
      </div>
      <div className="lp-stat-icon">{children}</div>
    </button>
  );
}

function LeadRow({ enquiry }) {
  return (
    <article className="lp-lead-row">
      <div className="lp-avatar">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.2" stroke="#2F3A8F" strokeWidth="1.2" />
          <path
            d="M4 20c1.8-4 6.2-6 8-6s6.2 2 8 6"
            stroke="#2F3A8F"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="lp-lead-body">
        <div className="lp-lead-head">
          <h4 className="lp-lead-title">
            {enquiry?.title || enquiry?.category || "Enquiry"}
          </h4>
          <time className="lp-lead-time">{enquiry?.time || ""}</time>
        </div>

        <p className="lp-lead-desc">
          {enquiry?.description || enquiry?.notes || "No details provided."}
        </p>
      </div>
    </article>
  );
}

export default function LeadsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchLogs } = useSelector((state) => state.businessListReducer);
  const otpState = useSelector((state) => state.otp || {});
  const allUsers = Array.isArray(otpState.viewAllResponse)
    ? otpState.viewAllResponse
    : [];

  const mobileNumber = localStorage.getItem("mobileNumber");

  const authUser =
    allUsers.find((u) => u.mobileNumber1 === mobileNumber) || {};

  const {
    businessName,
    businessLocation,
    businessCategory,
    searchHistory = [],
    mobileNumber1,
    emailVerified,
    userName,
  } = authUser;

  useEffect(() => {
    dispatch(viewAllOtpUsers());
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  // === USER SEARCH HISTORY MATCH ===
  const matchingEnquiries = useMemo(() => {
    if (!Array.isArray(searchHistory)) return [];
    if (!businessCategory) return [];

    return searchHistory.filter(
      (item) =>
        item?.category?.toLowerCase().trim() ===
        businessCategory?.toLowerCase().trim()
    );
  }, [searchHistory, businessCategory]);

  const matchedTrendingLogs = useMemo(() => {
    if (!searchLogs || !businessCategory) return [];

    return searchLogs.filter(
      (log) =>
        log.categoryName?.toLowerCase().trim() ===
        businessCategory?.toLowerCase().trim()
    );
  }, [searchLogs, businessCategory]);

  const enquiryCount = matchingEnquiries.length;
  const trendingCount = matchedTrendingLogs.length;
  const [showLeadsList, setShowLeadsList] = useState(true);

  const handleSearchHistoryClick = () => {
    if (matchingEnquiries.length === 0) {
      alert("No matching enquiries found.");
      return;
    }

    navigate("/user/search-history", {
      state: {
        searchHistory: matchingEnquiries,
        userDetails: { userName, mobileNumber1, emailVerified },
      },
    });
  };

  return (
    <div className="lp-root">
      {/* Header */}
      <div className="lp-topbar">
        <div className="lp-topbar-left">
          <img src={logoUrl} alt="Massclick" className="lp-logo" />
          <div className="lp-brand">
            <div className="lp-brand-title">Massclick</div>
            <div className="lp-brand-sub">India's Leading Local Search Engine</div>
          </div>
        </div>

        <div className="lp-topbar-actions">
          <div className="lp-search-container">
            <input className="lp-input lp-input-location" placeholder="Enter location manually..." />
            <input className="lp-input lp-input-search" placeholder="Search for..." />
            <button className="lp-btn lp-btn-primary">Search</button>
            <button className="lp-btn lp-btn-accent">+ Business</button>
          </div>
        </div>
      </div>

      <main className="lp-container">
        <CardsSearch />

        <section className="lp-card">
          <header className="lp-header">
            <div className="lp-business">
              <h2 className="lp-business-name">
                {businessName || "Your Business"}
              </h2>
              <div className="lp-business-meta">
                <span>{businessLocation || "Location not set"}</span>
                <span className="lp-pill">
                  {businessCategory || "Category"}
                </span>
              </div>
            </div>

            <div className="lp-actions">
              <button
                className="lp-toggle"
                onClick={() => setShowLeadsList((s) => !s)}
              >
                {showLeadsList ? "Hide Leads" : "Show Leads"}
              </button>
            </div>
          </header>

          {/* STATS */}
          <div className="lp-stats-grid">
            <StatCard
              label="User Enquiries"
              value={enquiryCount}
              accent
              onClick={handleSearchHistoryClick}
            >
              ⭐
            </StatCard>

            <StatCard label="Trending Searches" value={trendingCount}>
              🔥
            </StatCard>
          </div>

          {/* LEADS LIST */}
          <div className="lp-main-grid">
            <div className="lp-list-col">
              {showLeadsList ? (
                <>
                  {matchingEnquiries.length > 0 && (
                    <>
                      <h3>User Search Leads</h3>
                      <div className="lp-leads-list">
                        {matchingEnquiries.map((item) => (
                          <LeadRow
                            key={item._id}
                            enquiry={{
                              title: item.query,
                              description: "User searched this category",
                              time: new Date(item.searchedAt).toLocaleString(),
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {matchedTrendingLogs.length > 0 && (
                    <>
                      <h3>Trending Leads</h3>
                      <div className="lp-leads-list">
                        {matchedTrendingLogs.map((log) => (
                          <LeadRow
                            key={log._id}
                            enquiry={{
                              title: log.categoryName,
                              description:
                                "Someone searched this category recently.",
                              time: new Date(log.createdAt).toLocaleString(),
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {matchingEnquiries.length === 0 &&
                    matchedTrendingLogs.length === 0 && (
                      <div className="lp-empty">
                        <p>
                          No leads found for{" "}
                          <strong>{businessCategory}</strong>
                        </p>
                      </div>
                    )}
                </>
              ) : (
                <div className="lp-empty lp-empty-muted">
                  Leads hidden. Toggle to view.
                </div>
              )}
            </div>

            <aside className="lp-side-col">
              <div className="lp-card-block">
                <div className="lp-small-label">Business Contact</div>
                <div className="lp-contact-name">{userName || "Owner"}</div>
                <div className="lp-contact-meta">
                  <div>
                    <strong>📞</strong> {mobileNumber1 || "—"}
                  </div>
                  <div>
                    <strong>✉️</strong>{" "}
                    {emailVerified ? "Verified" : "Not Verified"}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
