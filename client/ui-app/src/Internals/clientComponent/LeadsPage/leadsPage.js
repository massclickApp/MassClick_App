import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import './leadsPage.css';
import CardsSearch from "../CardsSearch/CardsSearch.js";
import { viewAllOtpUsers } from "../../../redux/actions/otpAction.js";
import { useNavigate } from "react-router-dom";

const LeadsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const otpState = useSelector((state) => state.otp || {});
  const {
    viewAllResponse = [],
    loading = false,
    error = null,
  } = otpState;

  useEffect(() => {
    dispatch(viewAllOtpUsers());
  }, [dispatch]);

  useEffect(() => {
    if (viewAllResponse?.length > 0) {
    }
  }, [viewAllResponse]);

  const firstUser =
    Array.isArray(viewAllResponse) && viewAllResponse.length > 0
      ? viewAllResponse[0]
      : {};

 const {
    businessName = "Business Name Not Available",
    businessCategory = "Category Not Available",
    businessLocation = "Location Not Available",
    searchHistory = [],
    userName,
    mobileNumber1,
    emailVerified,
  } = firstUser;

  const searchCount = searchHistory.length || 0;


    const handleSearchHistoryClick = () => {
    if (searchHistory.length > 0) {
      navigate("/user/search-history", {
        state: {
          searchHistory,
          userDetails: { userName, mobileNumber1, emailVerified },
        },
      });
    } else {
      alert("No search history found for this user.");
    }
  };

  return (
    <>
      <CardsSearch /><br /><br /><br />
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
          >            <h3>{searchCount}</h3>
            <p>Enquiries Received</p>
          </div>
          <div className="stat-card">
            <h3>3</h3>
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
          <div className="badge">8</div>
        </section>
      </div>
    </>
  );
};

export default LeadsPage;