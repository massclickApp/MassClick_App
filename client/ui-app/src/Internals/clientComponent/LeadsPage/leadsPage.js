// LeadsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewOtpUser } from "../../../redux/actions/otpAction";
import { getAllSearchLogs  } from "../../../redux/actions/businessListAction";
import { useNavigate } from "react-router-dom";
import CardsSearch from "../CardsSearch/CardsSearch";
import "./leadsPage.css";

function StatCard({ label, value, onClick, accent, children }) {
  return (
    <button
      className={`lp-stat-card ${accent ? "lp-stat-accent" : ""}`}
      onClick={onClick}
      type="button"
      aria-pressed={accent ? "true" : "false"}
    >
      <div className="lp-stat-left">
        <div className="lp-stat-value">{value}</div>
        <div className="lp-stat-label">{label}</div>
      </div>
      <div className="lp-stat-icon">
        <span className="lp-stat-icon-inner">{children}</span>
      </div>
    </button>
  );
}

function LeadRow({ user }) {
  const formattedTime = (() => {
    if (!user?.time) return null;
    const d = new Date(user.time);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString();
  })();

  return (
    <article className="lp-lead-row" aria-label={`Lead ${user.userName || "Unknown"}`}>
      <div className="lp-avatar" aria-hidden>
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
          {formattedTime && (
            <time className="lp-lead-time" dateTime={new Date(user.time).toISOString()}>
              {formattedTime}
            </time>
          )}
        </div>

        <p className="lp-lead-desc">
          <span className="lp-lead-label">Contact</span>
          <br />
          📞 {user.mobileNumber1 || "No phone"}
          {user.mobileNumber2 ? `, ${user.mobileNumber2}` : ""}
          <br />
          ✉️ {user.email || "No email"}
        </p>
      </div>
    </article>
  );
}

export default function LeadsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mobileNumber = localStorage.getItem("mobileNumber");

  const { searchLogs = [] } = useSelector((state) => state.businessListReducer || {});
  
  const authUser = useSelector((state) => state.otp.viewResponse) || {};

  const {
    businessName,
    businessLocation,
    businessCategory,
    mobileNumber1,
    emailVerified,
    userName,
  } = authUser;

  const hasBusinessCategory =
    businessCategory &&
    typeof businessCategory === "object" &&
    typeof businessCategory.category === "string" &&
    businessCategory.category.trim() !== "";

  const [range, setRange] = useState("all");
  const [repeatOnly, setRepeatOnly] = useState(false);

useEffect(() => {
  if (mobileNumber) {
    dispatch(viewOtpUser(mobileNumber));
  }
  dispatch(getAllSearchLogs());
}, [dispatch, mobileNumber]);

function normalizeText(str = "") {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")      
    .replace(/[_\-\.,\/#!$%\^&\*;:{}=\+~()@\[\]"'<>?|`\\]/g, " ") 
    .replace(/[^0-9a-zA-Z\u00C0-\u024F\s]/g, " ") 
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(str = "") {
  const s = normalizeText(str);
  return s ? s.split(" ").filter(Boolean) : [];
}

function levenshtein(a = "", b = "") {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const v0 = new Array(bl + 1).fill(0);
  const v1 = new Array(bl + 1).fill(0);
  for (let j = 0; j <= bl; j++) v0[j] = j;
  for (let i = 0; i < al; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < bl; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= bl; j++) v0[j] = v1[j];
  }
  return v1[bl];
}

const DEBUG_MATCH = false; 
const FUZZY_THRESHOLD = 2; 

const matchedUsers = useMemo(() => {
  try {
    if (!Array.isArray(searchLogs)) return [];
    if (!hasBusinessCategory) return [];

    const categoryName = normalizeText(businessCategory?.category);
    const titleName = normalizeText(businessCategory?.title);
    const seoTitleName = normalizeText(businessCategory?.seoTitle);

    const keywords = (Array.isArray(businessCategory?.keywords) ? businessCategory.keywords : [])
      .map(k => normalizeText(k))
      .filter(Boolean);

    const searchTerms = [categoryName, titleName, seoTitleName, ...keywords].filter(Boolean);
    if (searchTerms.length === 0) {
      if (DEBUG_MATCH) console.warn("matcher: no search terms for businessCategory", businessCategory);
      return [];
    }

    const normalizeLogFields = (log) => {
      const rawCandidates = [
        log.categoryName,
        log.category,
        log.searchCategory,
        log.searchedUserText,
        log.title,
        log.description,
        log.meta,
        log.note,
        log.searchText,
      ].filter(Boolean);

      const joined = rawCandidates.join(" ");
      const normJoined = normalizeText(joined);
      const normFields = rawCandidates.map(normalizeText).filter(Boolean);
      return { rawCandidates, joined, normJoined, normFields };
    };

    const matchedLogs = [];
    const nonMatchedLogsDebug = [];

    for (const log of searchLogs) {
      const { rawCandidates, joined, normJoined, normFields } = normalizeLogFields(log);

      let matched = false;
      let matchReason = "";

      for (const term of searchTerms) {
        if (!term) continue;
        if (normJoined.includes(term)) {
          matched = true;
          matchReason = `joined-contains:${term}`;
          break;
        }
      }
      if (matched) {
        matchedLogs.push({ log, matchReason, normJoined, rawCandidates });
        continue;
      }

      for (const term of searchTerms) {
        const termTokens = tokenize(term);
        for (const tkn of termTokens) {
          for (const field of normFields) {
            const fieldTokens = field.split(" ").filter(Boolean);
            if (fieldTokens.includes(tkn) || field.includes(tkn)) {
              matched = true;
              matchReason = `token-overlap:${tkn}`;
              break;
            }
          }
          if (matched) break;
        }
        if (matched) break;
      }
      if (matched) {
        matchedLogs.push({ log, matchReason, normJoined, rawCandidates });
        continue;
      }

      for (const field of normFields) {
        for (const term of searchTerms) {
          if (field === term) {
            matched = true;
            matchReason = `field-eq:${term}`;
            break;
          }
        }
        if (matched) break;
      }
      if (matched) {
        matchedLogs.push({ log, matchReason, normJoined, rawCandidates });
        continue;
      }

      for (const term of searchTerms) {
        const candidatesToCheck = [normJoined, ...normFields];
        for (const candidate of candidatesToCheck) {
          if (!candidate) continue;
          const len = Math.max(candidate.length, term.length);
          const allowed = Math.max(1, Math.min(FUZZY_THRESHOLD, Math.floor(len * 0.25)));
          const dist = levenshtein(candidate, term);
          if (dist <= allowed) {
            matched = true;
            matchReason = `fuzzy:${term}:dist=${dist}`;
            break;
          }
        }
        if (matched) break;
      }

      if (matched) {
        matchedLogs.push({ log, matchReason, normJoined, rawCandidates });
      } else {
        nonMatchedLogsDebug.push({ log, normJoined, rawCandidates });
      }
    }

    if (DEBUG_MATCH) {
      console.groupCollapsed(`matcher debug: matched ${matchedLogs.length} / ${searchLogs.length}`);
      matchedLogs.slice(0, 50).forEach(m => {
        console.log("MATCHED:", m.matchReason, m.normJoined, m.rawCandidates);
      });
      console.groupEnd();

      console.groupCollapsed("matcher debug: non-matches sample");
      nonMatchedLogsDebug.slice(0, 50).forEach(nm => {
        console.log("NO MATCH:", nm.normJoined, nm.rawCandidates);
      });
      console.groupEnd();
    }

    const users = [];
    matchedLogs.forEach(({ log }) => {
      const createdAt = log.createdAt || log.created_at || log.date || null;
      const searchedText = typeof log.searchedUserText === "string"
        ? log.searchedUserText
        : (log.searchedUserText ? String(log.searchedUserText) : "");

      if (Array.isArray(log.userDetails)) {
        log.userDetails.forEach((u) => {
          users.push({ ...u, time: createdAt, searchedUserText: searchedText });
        });
      } else if (log.userDetails && typeof log.userDetails === "object") {
        users.push({ ...log.userDetails, time: createdAt, searchedUserText: searchedText });
      }
    });

    // -------------- DEDUPE USERS (IMPROVED) --------------
    const unique = {};
    const normalizeLeadKey = (u) => {
      if (u.mobileNumber1) {
        const phone = String(u.mobileNumber1).replace(/\D/g, "");
        if (phone) return `p:${phone}`;
      }
      if (u.email) return `e:${String(u.email).trim().toLowerCase()}`;
      if (u.userName) return `n:${String(u.userName).trim().toLowerCase()}`;
      return null;
    };

    const uniqueUsers = users.filter((u) => {
      const key = normalizeLeadKey(u);
      if (!key) return false;
      if (unique[key]) return false;
      unique[key] = true;
      return true;
    });

    return uniqueUsers;

  } catch (err) {
    console.error("matchedUsers error:", err);
    return [];
  }
}, [searchLogs, businessCategory, hasBusinessCategory]);


  const { filteredUsers, todayCount, last7Count, last30Count, repeatCount } = useMemo(() => {
    const msDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenAgo = new Date(startToday.getTime() - 6 * msDay); 
    const thirtyAgo = new Date(startToday.getTime() - 29 * msDay); 

    const repeatMap = {};
    let todayCount = 0;
    let last7Count = 0;
    let last30Count = 0;

    matchedUsers.forEach((u) => {
      const key = u.mobileNumber1 || u.email || u.userName;
      if (key) repeatMap[key] = (repeatMap[key] || 0) + 1;

      if (u.time) {
        const d = new Date(u.time);
        if (!Number.isNaN(d.getTime())) {
          if (d >= startToday) todayCount += 1;
          if (d >= sevenAgo) last7Count += 1;
          if (d >= thirtyAgo) last30Count += 1;
        }
      }
    });

    const repeatVisitorSet = new Set(Object.keys(repeatMap).filter((k) => repeatMap[k] > 1));
    const repeatCount = repeatVisitorSet.size;

    const filteredUsers = matchedUsers.filter((u) => {
      let ok = true;

      if (range !== "all" && u.time) {
        const d = new Date(u.time);
        if (!Number.isNaN(d.getTime())) {
          if (range === "today") ok = d >= startToday;
          else if (range === "7") ok = d >= sevenAgo;
          else if (range === "30") ok = d >= thirtyAgo;
        }
      }

      if (!ok) return false;

      if (repeatOnly) {
        const key = u.mobileNumber1 || u.email || u.userName;
        if (!key || !repeatVisitorSet.has(key)) return false;
      }

      return true;
    });

    return { filteredUsers, todayCount, last7Count, last30Count, repeatCount };
  }, [matchedUsers, range, repeatOnly]);

  const leadsCount = matchedUsers.length;

  if (!hasBusinessCategory) {
    return (
      <div className="lp-root">
        <main className="lp-container">
          <CardsSearch />
          <br />
          <br />
          <br />
          <br />
          <section className="lp-card" style={{ padding: 40, textAlign: "center" }}>
            <h2>You are not a Business Person</h2>
            <p>Please create your Business Profile to view leads.</p>
            <button
              className="lp-btn lp-btn-primary"
              onClick={() => navigate("/user/create-business")}
            >
              Create Business
            </button>
          </section>
        </main>
      </div>
    );
  }

  const handleTotalLeadsClick = () => {
    if (!matchedUsers.length) {
      alert("No leads found.");
      return;
    }
    navigate("/user/search-history", { state: { leadsUsers: matchedUsers } });
  };

  const qualityLabel =
    leadsCount === 0
      ? "No data yet"
      : leadsCount > 20 || repeatCount > 5
      ? "High quality"
      : leadsCount > 5
      ? "Moderate quality"
      : "Low quality";

  return (
    <div className="lp-root">
      <main className="lp-container">
        <CardsSearch />
        <br />
        <br />
        <br />
        <section className="lp-card">
          <header className="lp-header">
            <div className="lp-business">
              <h2 className="lp-business-name">{businessName || "Your Business"}</h2>
              <div className="lp-business-meta">
                <span>{businessLocation || "Location not set"}</span>
                <span className="lp-pill">{businessCategory?.category || "Category"}</span>
              </div>
              <p className="lp-business-subtitle">
                Real-time leads from users who searched your business category.
              </p>
            </div>
          </header>

          <div className="lp-stats-grid">
            <StatCard label="Total Leads" value={leadsCount} accent onClick={handleTotalLeadsClick}>
              🔥
            </StatCard>

            <StatCard label="Today" value={todayCount}>
              📅
            </StatCard>

            <StatCard label="Last 7 Days" value={last7Count}>
              📊
            </StatCard>

            <StatCard label="Repeat Visitors" value={repeatCount}>
              ♻️
            </StatCard>
          </div>

          <div className="lp-main-grid">
            <div className="lp-list-col">
              <div className="lp-filters">
                <div className="lp-filters-left">
                  <span className="lp-filters-label">Filters:</span>
                  <button type="button" className={`lp-filter-chip ${range === "all" ? "active" : ""}`} onClick={() => setRange("all")}>
                    All time
                  </button>
                  <button type="button" className={`lp-filter-chip ${range === "today" ? "active" : ""}`} onClick={() => setRange("today")}>
                    Today
                  </button>
                  <button type="button" className={`lp-filter-chip ${range === "7" ? "active" : ""}`} onClick={() => setRange("7")}>
                    Last 7 days
                  </button>
                  <button type="button" className={`lp-filter-chip ${range === "30" ? "active" : ""}`} onClick={() => setRange("30")}>
                    Last 30 days
                  </button>
                </div>

                <div className="lp-filters-right">
                  <button type="button" className={`lp-filter-chip lp-filter-toggle ${repeatOnly ? "active" : ""}`} onClick={() => setRepeatOnly((v) => !v)}>
                    Repeat visitors only
                  </button>
                </div>
              </div>

              {filteredUsers.length > 0 ? (
                <>
                  <div className="lp-section-head">
                    <h3 className="lp-section-title">Leads (Users who searched your category)</h3>
                    <span className="lp-section-count">
                      {filteredUsers.length} shown • {leadsCount} total
                    </span>
                  </div>
                  <div className="lp-leads-list">
                    {filteredUsers.map((u, index) => {
                      const key = u.mobileNumber1 || u.email || u.userName || index;
                      return <LeadRow key={key} user={u} />;
                    })}
                  </div>
                </>
              ) : (
                <div className="lp-empty">
                  <p>
                    No users found for the selected filters in <strong>{businessCategory?.category || "your category"}</strong>
                  </p>
                </div>
              )}
            </div>

            <aside className="lp-side-col">
              <div className="lp-side-card lp-insight-card">
                <div className="lp-small-label">Snapshot</div>
                <h4 className="lp-side-title">Leads Insights</h4>

                <div className="lp-insight-row">
                  <span>Total leads</span>
                  <strong>{leadsCount}</strong>
                </div>
                <div className="lp-insight-row">
                  <span>Today</span>
                  <strong>{todayCount}</strong>
                </div>
                <div className="lp-insight-row">
                  <span>Last 7 days</span>
                  <strong>{last7Count}</strong>
                </div>
                <div className="lp-insight-row">
                  <span>Last 30 days</span>
                  <strong>{last30Count}</strong>
                </div>
              </div>

              <div className="lp-side-card lp-quality-card">
                <div className="lp-small-label">Lead Quality</div>
                <h4 className="lp-side-title">{qualityLabel}</h4>

                <div className="lp-quality-rows">
                  <div className="lp-quality-row">
                    <span>High intent</span>
                    <div className="lp-quality-bar">
                      <span className="lp-quality-bar-fill high" />
                    </div>
                  </div>
                  <div className="lp-quality-row">
                    <span>Warm</span>
                    <div className="lp-quality-bar">
                      <span className="lp-quality-bar-fill medium" />
                    </div>
                  </div>
                  <div className="lp-quality-row">
                    <span>Cold</span>
                    <div className="lp-quality-bar">
                      <span className="lp-quality-bar-fill low" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lp-side-card lp-timeline-card">
                <div className="lp-small-label">Activity Timeline</div>
                <ul className="lp-timeline-list">
                  <li>
                    <span className="lp-timeline-dot primary" />
                    <div>
                      <strong>Today</strong>
                      <p>{todayCount} new leads</p>
                    </div>
                  </li>
                  <li>
                    <span className="lp-timeline-dot" />
                    <div>
                      <strong>Last 7 days</strong>
                      <p>{last7Count} total leads</p>
                    </div>
                  </li>
                  <li>
                    <span className="lp-timeline-dot" />
                    <div>
                      <strong>Last 30 days</strong>
                      <p>{last30Count} total leads</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Engagement mini chart */}
              <div className="lp-side-card lp-chart-card">
                <div className="lp-small-label">Engagement</div>
                <h4 className="lp-side-title">When users search you</h4>
                <div className="lp-chart-bars">
                  <div className="lp-chart-bar">
                    <div className="lp-chart-bar-fill morning" />
                    <span>Morning</span>
                  </div>
                  <div className="lp-chart-bar">
                    <div className="lp-chart-bar-fill afternoon" />
                    <span>Afternoon</span>
                  </div>
                  <div className="lp-chart-bar">
                    <div className="lp-chart-bar-fill evening" />
                    <span>Evening</span>
                  </div>
                  <div className="lp-chart-bar">
                    <div className="lp-chart-bar-fill night" />
                    <span>Night</span>
                  </div>
                </div>
              </div>

              <div className="lp-side-card lp-tips-card">
                <div className="lp-small-label">Conversion Tips</div>
                <ul className="lp-tips-list">
                  <li>Call new leads within 5 minutes.</li>
                  <li>Send a short WhatsApp intro message.</li>
                  <li>Add notes after each conversation.</li>
                  <li>Ask for ratings after service is completed.</li>
                </ul>

                <button className="lp-btn lp-btn-primary full">
                  View Detailed Analytics
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
