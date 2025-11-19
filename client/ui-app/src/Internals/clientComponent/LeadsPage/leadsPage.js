// LeadsPage.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewAllOtpUsers } from "../../../redux/actions/otpAction";
import { getAllSearchLogs } from "../../../redux/actions/businessListAction";
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

function LeadRow({ user }) {
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
          <h4 className="lp-lead-title">{user.userName || "Unknown User"}</h4>
          {user.time && (
            <time className="lp-lead-time">
              {new Date(user.time).toLocaleString()}
            </time>
          )}
        </div>

        <p className="lp-lead-desc">
          📞 {user.mobileNumber1}
          {user.mobileNumber2 ? `, ${user.mobileNumber2}` : ""}
          <br />
          ✉️ {user.email}
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
    mobileNumber1,
    emailVerified,
    userName,
  } = authUser;

  useEffect(() => {
    dispatch(viewAllOtpUsers());
    dispatch(getAllSearchLogs());
  }, [dispatch]);

  // 🔍 All users who searched THIS business category (from searchLogs)
  const matchedUsers = useMemo(() => {
    if (!searchLogs || !businessCategory) return [];

    const filteredLogs = searchLogs.filter(
      (log) =>
        log.categoryName?.toLowerCase().trim() ===
        businessCategory?.toLowerCase().trim()
    );

    const users = [];

    filteredLogs.forEach((log) => {
      if (Array.isArray(log.userDetails)) {
        log.userDetails.forEach((u) => {
          users.push({
            ...u,
            time: log.createdAt,
          });
        });
      }
    });

    return users;
  }, [searchLogs, businessCategory]);

  const leadsCount = matchedUsers.length;

  const handleTotalLeadsClick = () => {
    if (!matchedUsers.length) {
      alert("No leads found.");
      return;
    }

    // Navigate to leads details page with all users
    navigate("/user/search-history", {
      state: {
        leadsUsers: matchedUsers,
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
            <div className="lp-brand-sub">
              India&apos;s Leading Local Search Engine
            </div>
          </div>
        </div>

        <div className="lp-topbar-actions">
          <div className="lp-search-container">
            <input
              className="lp-input lp-input-location"
              placeholder="Enter location manually..."
            />
            <input
              className="lp-input lp-input-search"
              placeholder="Search for..."
            />
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
          </header>

          {/* STATS */}
          <div className="lp-stats-grid">
            <StatCard
              label="Total Leads"
              value={leadsCount}
              accent
              onClick={handleTotalLeadsClick}
            >
              🔥
            </StatCard>
          </div>

          {/* LEADS LIST PREVIEW */}
          <div className="lp-main-grid">
            <div className="lp-list-col">
              {matchedUsers.length > 0 ? (
                <>
                  <h3>Leads (Users who searched your category)</h3>
                  <div className="lp-leads-list">
                    {matchedUsers.map((u, index) => (
                      <LeadRow key={index} user={u} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="lp-empty">
                  <p>
                    No users searched for{" "}
                    <strong>{businessCategory || "your category"}</strong> yet.
                  </p>
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
