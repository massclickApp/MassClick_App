import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./popularCategories.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientBusinessList } from "../../../../redux/actions/businessListAction";
import CardsSearch from "../../CardsSearch/CardsSearch";
import CardDesign from "../cards";

const normalize = (txt = "") =>
  String(txt || "").toLowerCase().trim();

const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Strict matching
const matchesCategory = (business, categoryLabel, categorySlug) => {
  const q = normalize(categoryLabel);
  const qSlug = slugify(categoryLabel);
  const urlSlug = normalize(categorySlug);

  if (normalize(business.category) === q) return true;

  if (normalize(business.slug) === qSlug) return true;
  if (normalize(business.slug) === urlSlug) return true;

  if (Array.isArray(business.keywords)) {
    if (business.keywords.some(k => normalize(k) === q)) return true;
  }

  const textFields = [
    business.seoTitle,
    business.seoDescription,
    business.title,
    business.description
  ];

  if (textFields.some(t => normalize(t) === q)) return true;

  return false;
};

export default function CategoryDynamicPage() {
  const { categorySlug } = useParams();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const realCategoryName =
    state?.categoryName || (categorySlug ? categorySlug.replace(/-/g, " ") : "");

  const { clientBusinessList = [] } = useSelector(
    (s) => s.businessListReducer || {}
  );

  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  useEffect(() => {
    dispatch(getAllClientBusinessList());
  }, [dispatch]);

  useEffect(() => {
    if (clientBusinessList.length === 0) return;

    const result = clientBusinessList.filter((b) =>
      matchesCategory(b, realCategoryName, categorySlug)
    );

    setFilteredBusinesses(result);
  }, [clientBusinessList, realCategoryName, categorySlug]);

  if (filteredBusinesses.length === 0) {
    return (
      <div className="no-results-container">
        <p className="no-results-title">
          No "{realCategoryName}" found 😔
        </p>
        <button className="go-home-button" onClick={() => navigate("/home")}>
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <>
      <CardsSearch /><br/><br/><br/>
      <div className="restaurants-list-wrapper">

        {filteredBusinesses.map((b) => {
          const nameSlug = slugify(b.businessName);
          const locSlug = slugify(b.locationDetails || "unknown");
          const addrSlug = slugify(b.street || "unknown");
          return (
            <CardDesign
              key={b._id}
              title={b.businessName}
              phone={b.contact}
              whatsapp={b.whatsappNumber}
              address={b.locationDetails}
              details={`Experience: ${b.experience} | Category: ${b.category}`}
              imageSrc={b.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
              rating={b.averageRating?.toFixed(1) || 0}
              reviews={b.reviews?.length || 0}
              to={`/${locSlug}/${nameSlug}/${addrSlug}/${b._id}`}
            />
          );
        })}
      </div>
    </>
  );
}
