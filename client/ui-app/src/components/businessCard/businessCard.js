import React, { useEffect } from "react";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinessList } from "../../redux/actions/businessListAction";

import "./businessCard.css";

export default function SelectActionCard() {
    const dispatch = useDispatch();

    const { businessList = [] } = useSelector(
        (state) => state.businessListReducer || {}
    );

    useEffect(() => {
        dispatch(getAllBusinessList());
    }, [dispatch]);

    const list = Array.isArray(businessList) ? businessList : [];

    /* ------------------------------------------------------------
       1. Today's Count
    ------------------------------------------------------------- */
    const todayCount = list.filter((b) => {
        const created = new Date(b.createdAt);
        const today = new Date();

        return (
            created.getDate() === today.getDate() &&
            created.getMonth() === today.getMonth() &&
            created.getFullYear() === today.getFullYear()
        );
    }).length;

    /* ------------------------------------------------------------
       2. Total Count
    ------------------------------------------------------------- */
    const totalCount = list.length;

    /* ------------------------------------------------------------
       3. Active Count
    ------------------------------------------------------------- */
    const activeCount = list.filter((b) => b.activeBusinesses === true).length;

    /* ------------------------------------------------------------
       4. Inactive Count (NEW CARD)
    ------------------------------------------------------------- */
    const inactiveCount = totalCount - activeCount;


    const calculateGrowth = (current, previous) => {
        if (previous === 0) return "+0%";
        const percentage = ((current - previous) / previous) * 100;
        return (percentage >= 0 ? "+" : "") + percentage.toFixed(1) + "%";
    };

    const today = new Date();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    const currentWeekCount = list.filter((b) => {
        const date = new Date(b.createdAt);
        return date >= oneWeekAgo && date <= today;
    }).length;

    const previousWeekCount = list.filter((b) => {
        const date = new Date(b.createdAt);
        return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    const businessGrowth = calculateGrowth(currentWeekCount, previousWeekCount);

    /* ------------------------------------------------------------
       6. HOT CATEGORY
    ------------------------------------------------------------- */
    const activeBusinessesOnly = list.filter((b) => b.activeBusinesses === true);

    const categoryCount = {};
    activeBusinessesOnly.forEach((b) => {
        if (b.category) {
            categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
        }
    });

    let hotCategory = "No Category";
    if (Object.keys(categoryCount).length > 0) {
        hotCategory = Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
        );
    }

    /* ------------------------------------------------------------
       7. All Cards (5 Cards Now)
    ------------------------------------------------------------- */
    const cards = [
        {
            id: 1,
            title: "Today's Business",
            value: todayCount,
            icon: <BusinessCenterIcon />,
            color: "#ff7043",
            growth: calculateGrowth(todayCount, previousWeekCount),
        },
        {
            id: 2,
            title: "Total Businesses",
            value: totalCount,
            icon: <StoreIcon />,
            color: "#42a5f5",
            growth: businessGrowth,
        },
        {
            id: 3,
            title: "Active Businesses",
            value: activeCount,
            icon: <ShoppingCartIcon />,
            color: "#66bb6a",
            growth: calculateGrowth(activeCount, previousWeekCount),
        },
        {
            id: 4,
            title: (
                <div className="hot-ribbon">
                    🔥 HOT CATEGORY
                </div>
            ),
            value: hotCategory,
            icon: <WhatshotIcon />,
            color: "#ff3d00",
            growth: "+0%",
        },

        /* ⭐ NEW CARD ⭐ */
        {
            id: 5,
            title: "Inactive Businesses",
            value: inactiveCount,
            icon: <ShoppingCartIcon />,
            color: "#d32f2f",
            growth: calculateGrowth(inactiveCount, previousWeekCount),
        },
    ];

    return (
        <div className="card-grid">
            {cards.map((card) => (
                <div className="stat-card" key={card.id}>
                    <h4 className="card-title">{card.title}</h4>

                    <h2 className={`card-value ${card.id === 4 ? "hot-category-text" : ""}`}>
                        {card.value}
                    </h2>

                    <p
                        className={`card-growth ${card.growth.startsWith("-") ? "down" : "up"}`}
                    >
                        {card.growth} from last week
                    </p>

                    <div className="card-icon" style={{ backgroundColor: card.color }}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}
