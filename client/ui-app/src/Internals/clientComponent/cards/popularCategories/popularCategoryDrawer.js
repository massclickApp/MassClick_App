import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./popularCategories.css";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessByCategory } from "../../../../redux/actions/businessListAction";
import CardsSearch from "../../CardsSearch/CardsSearch";
import CardDesign from "../cards";

const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CategoryDynamicPage() {
  const { categorySlug } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const realCategoryName =
    state?.categoryName || categorySlug.replace(/-/g, " ");

  const { categoryBusinessList = [], loading } = useSelector(
    (s) => s.businessListReducer || {}
  );

  useEffect(() => {
    dispatch(getBusinessByCategory(realCategoryName));
  }, [dispatch, realCategoryName]);

  if (loading) {
    return <p className="loading-text">Loading categories...</p>;
  }

  if (!loading && categoryBusinessList.length === 0) {
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
      <CardsSearch /><br /><br /><br />

      <div className="restaurants-list-wrapper">
        {categoryBusinessList.map((b) => {
          const nameSlug = slugify(b.businessName);
          const addressSlug = slugify(b.street || "unknown");
          const locationSlug = slugify(b.location || "unknown");

          const slug = `${nameSlug}-${addressSlug}-${locationSlug}`;
          const businessUrl = `/business/${slug}`;

          return (
            <CardDesign
              key={b._id}
              title={b.businessName}
              phone={b.contact}
              whatsapp={b.whatsappNumber}
              address={b.location}
              details={`Experience: ${b.experience} | Category: ${b.category}`}
              imageSrc={b.bannerImage || "https://via.placeholder.com/120x100?text=Logo"}
              rating={b.averageRating?.toFixed(1) || 0}
              reviews={b.reviews?.length || 0}
              to={businessUrl}
              state={{ id: b._id }} 
            />
          );
        })}
      </div>
    </>
  );
}
