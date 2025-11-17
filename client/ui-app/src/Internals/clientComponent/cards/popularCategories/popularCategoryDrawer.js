import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./popularCategories.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientBusinessList } from "../../../../redux/actions/businessListAction";
import CardsSearch from "../../CardsSearch/CardsSearch";
import CardDesign from "../cards";

const normalize = (txt = "") =>
  String(txt || "").toLowerCase().trim();

export default function CategoryDynamicPage() {
    const { categorySlug } = useParams();
    const { state } = useLocation(); 

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // This is the REAL category name coming from Drawer
    const realCategoryName = state?.categoryName || "";

    const { clientBusinessList = [] } = useSelector(
        (s) => s.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getAllClientBusinessList());
    }, [dispatch]);

    const filteredBusinesses = clientBusinessList.filter((b) =>
        normalize(b.category) === normalize(realCategoryName)
    );

    const slugify = (text) =>
        text.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    if (filteredBusinesses.length === 0) {
        return (
            <div className="no-results-container">
                <p className="no-results-title">
                    No "{realCategoryName}" found 😔
                </p>
                <button
                    className="go-home-button"
                    onClick={() => navigate("/home")}
                >
                    Go to Homepage
                </button>
            </div>
        );
    }

    return (
        <>
            <CardsSearch />

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
