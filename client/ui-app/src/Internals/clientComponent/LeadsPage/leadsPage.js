// ============================================
// LeadsPage.jsx — FINAL & CORRECT VERSION
// ============================================

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./leadsPage.css";
import CardsSearch from "../CardsSearch/CardsSearch";
import { viewAllOtpUsers } from "../../../redux/actions/otpAction";
import { useNavigate } from "react-router-dom";

const LeadsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const otpState = useSelector((state) => state.otp || {});
  const viewAllResponse = Array.isArray(otpState.viewAllResponse)
    ? otpState.viewAllResponse
    : [];

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

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
        item.category &&
        item.category.toLowerCase().trim() ===
        businessCategory?.toLowerCase().trim()
    );
  }, [searchHistory, businessCategory]);

  const enquiryCount = matchingEnquiries.length;


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


  if (enquiryCount === 0) {
    return (
      <>
        <CardsSearch />
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>No Leads Available</h2>
          <p>No enquiries match your business category "{businessCategory}".</p>
        </div>
      </>
    );
  }

  return (
    <>
      <CardsSearch />
      <br />
      <br />
      <br />

      <div className="leads-page-container">
        <header className="leads-header">
          <div className="business-info">
            <h2>{businessName}</h2>
            <p>{businessLocation}</p>
            <span className="business-category">{businessCategory}</span>
          </div>

          <div className="support-section">
            <button className="support-btn">Customer Support</button>
          </div>
        </header>

        <section className="stats-grid">
          <div
            className="stat-card highlight-card"
            onClick={handleSearchHistoryClick}
            style={{ cursor: "pointer" }}
          >
            <h3>{enquiryCount}</h3>
            <p>Enquiries Received</p>
          </div>

          <div className="stat-card">
            <h3>{enquiryCount}</h3>
            <p>Enquiries Responded</p>
          </div>

          <div className="stat-card">
            <h3>0</h3>
            <p>Avg. Response Time</p>
          </div>

          <div className="stat-card action-card">
            <p>Respond to Reviews</p>
            <button className="rating-btn">Get Ratings</button>
          </div>
        </section>

        <div className="view-more">
          <a href="#">View More</a>
        </div>

        <section className="hot-enquiries">
          <div className="hot-envelope">
            <span className="icon">📩</span>
            <p>Hot Enquiries</p>
          </div>
          <div className="badge">{enquiryCount}</div>
        </section>
      </div>
    </>
  );
};

export default LeadsPage;
