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

  const createSlug = slugify;

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
      <CardsSearch /><br/><br/><br/>

      <div className="restaurants-list-wrapper">
        {categoryBusinessList.map((b) => {
          const nameSlug = createSlug(b.businessName);
          const locSlug = createSlug(b.location || "unknown");
          const addrSlug = createSlug(b.street || "unknown");

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
              to={`/${locSlug}/${nameSlug}/${addrSlug}/${b._id}`}
            />
          );
        })}
      </div>
    </>
  );
}
