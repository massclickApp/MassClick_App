// LeadsPage.jsx  (Pure CSS, no Tailwind, no lucide-react)
// Place this file in the same folder as leadsPage.css
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewAllOtpUsers } from "../../../redux/actions/otpAction";
import { useNavigate } from "react-router-dom";
import CardsSearch from "../CardsSearch/CardsSearch";
import "./leadsPage.css";

const logoUrl = "/mnt/data/30429df4-c55e-4274-a7ab-b2327308fb94.png";

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
        {/* stylized user icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.2" stroke="#2F3A8F" strokeWidth="1.2" />
          <path d="M4 20c1.8-4 6.2-6 8-6s6.2 2 8 6" stroke="#2F3A8F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="lp-lead-body">
        <div className="lp-lead-head">
          <h4 className="lp-lead-title">{enquiry?.title || enquiry?.category || "Enquiry"}</h4>
          <time className="lp-lead-time">{enquiry?.time || ""}</time>
        </div>

        <p className="lp-lead-desc">{enquiry?.description || enquiry?.notes || "No details provided."}</p>

        <div className="lp-lead-meta">
          {enquiry?.contact && (
            <span className="lp-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19 19 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.2.5 2.33 1.1 3.33a2 2 0 0 1-.45 2.3L9.7 12.7a14.66 14.66 0 0 0 4.6 4.6l1.36-1.36a2 2 0 0 1 2.3-.45c1 .6 2.13.98 3.33 1.1A2 2 0 0 1 22 16.92z" fill="#555" /></svg>
              <span>{enquiry.contact}</span>
            </span>
          )}

          {enquiry?.email && (
            <span className="lp-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M3 8.2v7.6A2.2 2.2 0 0 0 5.2 18h13.6A2.2 2.2 0 0 0 21 15.8V8.2L12 13 3 8.2zM21 6.8A2.2 2.2 0 0 0 18.8 5H5.2A2.2 2.2 0 0 0 3 7.2L12 12l9-4.2z" fill="#555" /></svg>
              <span>{enquiry.email}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LeadsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const otpState = useSelector((state) => state.otp || {});
  const viewAllResponse = Array.isArray(otpState.viewAllResponse) ? otpState.viewAllResponse : [];

  const allUsers = Array.isArray(viewAllResponse) ? viewAllResponse : [];

  const mobileNumber = localStorage.getItem("mobileNumber");
  const authUser = allUsers.find(user => user.mobileNumber1 === mobileNumber) || {};

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
  }, [dispatch]);

  const matchingEnquiries = useMemo(() => {
    if (!Array.isArray(searchHistory)) return [];
    return searchHistory.filter(
      (item) =>
        item?.category &&
        item.category.toLowerCase().trim() === businessCategory?.toLowerCase().trim()
    );
  }, [searchHistory, businessCategory]);

  const enquiryCount = matchingEnquiries.length;
  const [showLeadsList, setShowLeadsList] = useState(true);

  const handleSearchHistoryClick = () => {
    if (enquiryCount === 0) {
      alert("No search enquiries match your business category.");
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
      {/* Top search / nav region */}
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
              <h2 className="lp-business-name">{businessName || "Your Business"}</h2>
              <div className="lp-business-meta">
                <span>{businessLocation || "Location not set"}</span>
                <span className="lp-pill">{businessCategory || "Category"}</span>
              </div>
            </div>

            <div className="lp-actions">
              <button className="lp-toggle" onClick={() => setShowLeadsList((s) => !s)}>
                {showLeadsList ? "Hide Leads" : "Show Leads"}
              </button>
              <button className="lp-btn lp-btn-support">Customer Support</button>
            </div>
          </header>

          <div className="lp-stats-grid">
            <StatCard label="Enquiries Received" value={enquiryCount} accent onClick={handleSearchHistoryClick}>
              {/* star svg */}
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M12 17.3l-6.18 3.24 1.18-6.88L2 9.76l6.91-1L12 2l3.09 6.76L22 9.76l-5 3.9 1.18 6.88z" fill="#ff7a1a" /></svg>
            </StatCard>

            <StatCard label="Enquiries Responded" value={Math.min(enquiryCount, viewAllResponse.length || 0)}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M5 12l4 4L19 6" stroke="#10b981" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </StatCard>

            <StatCard label="Avg. Response Time" value={viewAllResponse.length ? "1h 22m" : "—"}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M12 6v6l4 2" stroke="#6366f1" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </StatCard>

            <div className="lp-stat-card lp-reviews">
              <div>
                <div className="lp-small-label">Respond to Reviews</div>
                <div className="lp-reviews-title">Boost ratings</div>
              </div>
              <div>
                <button className="lp-btn lp-btn-secondary">Get Ratings</button>
              </div>
            </div>
          </div>

          <div className="lp-hot-cta">
            <div className="lp-hot">
              <div className="lp-hot-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" stroke="#fb923c" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div className="lp-small-label">Hot Enquiries</div>
                <div className="lp-hot-count">{enquiryCount} new</div>
              </div>
            </div>

            <div className="lp-hot-actions">
              <a className="lp-link" href="#">View More</a>
              <button className="lp-btn lp-btn-ghost">Export</button>
            </div>
          </div>

          <div className="lp-main-grid">
            <div className="lp-list-col">
              {showLeadsList ? (
                matchingEnquiries.length ? (
                  <div className="lp-leads-list">
                    {matchingEnquiries.map((enq, idx) => <LeadRow key={idx} enquiry={enq} />)}
                  </div>
                ) : (
                  <div className="lp-empty">
                    <p>No matching enquiries found for <strong>{businessCategory || "your category"}</strong></p>
                    <div className="lp-empty-actions">
                      <button className="lp-btn lp-btn-primary" onClick={handleSearchHistoryClick}>Explore search history</button>
                    </div>
                  </div>
                )
              ) : (
                <div className="lp-empty lp-empty-muted">Leads hidden. Toggle to view.</div>
              )}
            </div>

            <aside className="lp-side-col">
              <div className="lp-card-block">
                <div className="lp-small-label">Business Contact</div>
                <div className="lp-contact-name">{userName || "Owner"}</div>
                <div className="lp-contact-meta">
                  <div><strong>📞</strong> {mobileNumber1 || "—"}</div>
                  <div><strong>✉️</strong> {emailVerified ? "Verified" : "Not Verified"}</div>
                </div>
              </div>

              <div className="lp-card-block">
                <div className="lp-small-label">Quick Actions</div>
                <div className="lp-quick-actions">
                  <button className="lp-btn lp-btn-primary full">Send Broadcast</button>
                  <button className="lp-btn lp-btn-ghost full">Manage Listings</button>
                </div>
              </div>

              <div className="lp-card-block lp-insights">
                <div className="lp-small-label">Insights</div>
                <div className="lp-insight-text">Engagement up 12% vs last week</div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
