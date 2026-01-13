import React, { useEffect, useState } from "react";
import "./popularCategories.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import popular from "../../../../assets/features/agent.png"

import Salon from "../../../../assets/features/barbershop.png";
import Astrologers from "../../../../assets/features/astrologers.png";
import BodyMassage from "../../../../assets/features/Bodymassage.png";
import BeautyParlour from "../../../../assets/features/beauty-parlour.png";
import CarHire from "../../../../assets/features/Carhired.png";
import Spa from "../../../../assets/features/spa.png";
import CharteredAccountant from "../../../../assets/features/accountant.png";
import ComputerTraining from "../../../../assets/features/computer-course.png";
import CourierServices from "../../../../assets/features/delivery.png";
import LaptopRepair from "../../../../assets/features/laptop-repairs.png";
import CarRepair from "../../../../assets/features/car-Repair.png";
import Dermatologists from "../../../../assets/features/dermatologist.png";
import Dentists from "../../../../assets/features/dental-checkup.png";
import Electricians from "../../../../assets/features/electrician.png";
import EventOrganiser from "../../../../assets/features/eventorgan.png";
import RealEstate from "../../../../assets/features/real-estates.png";
import Fabricators from "../../../../assets/features/fabricator.png";
import FurnitureRepair from "../../../../assets/features/furniture-repair.png";
import Hospitals from "../../../../assets/features/hospital.png";
import HouseKeeping from "../../../../assets/features/housekeeper.png";
import Hobbies from "../../../../assets/features/hobby.png";
import InteriorDesigners from "../../../../assets/features/interiors-Designers.png";
import InternetWeb from "../../../../assets/features/internet-web.png";
import Jewellery from "../../../../assets/features/jewelry.png";
import Lawyers from "../../../../assets/features/lawyer.png";
import Photographers from "../../../../assets/features/photographer.png";
import NursingServices from "../../../../assets/features/nurse-service.png";
import Printing from "../../../../assets/features/printer.png";
import Placement from "../../../../assets/features/hiring.png";
import PestControl from "../../../../assets/features/pest-control.png";
import Painting from "../../../../assets/features/painters.png";
import PackersMovers from "../../../../assets/features/packers.png";
import ScrapDealers from "../../../../assets/features/scrap.png";
import Registration from "../../../../assets/features/Registration.png";
import SecuritySystem from "../../../../assets/features/securitySystem.png";
import Coaching from "../../../../assets/features/coaching.png";
import Transporters from "../../../../assets/features/transportation.png";
import ScrapBuyers from "../../../../assets/features/scrap-buyers.png";
import VocationalTraining from "../../../../assets/features/vocational-training.png";


export const STATIC_CATEGORIES = [
    { icon: Astrologers, label: "Astrologer", path: "/astrologers" },
    { icon: CharteredAccountant, label: "Chartered Accountant", path: "/ca" },
    { icon: ComputerTraining, label: "Computer Training Institutes", path: "/computer-training" },
    { icon: CarHire, label: "Car Hire", path: "/car-hire" },

    { icon: BeautyParlour, label: "Beauty Parlour", path: "/beauty-spa" },
    { icon: BodyMassage, label: "Body Massage", path: "/beauty/spa-massages" },
    { icon: Salon, label: "Salon", path: "/salon" },
    { icon: Spa, label: "Spa", path: "/spa" },

    { icon: CourierServices, label: "Courier Services", path: "/courier-service" },
    { icon: Electricians, label: "Electrician", path: "/electricians" },
    { icon: EventOrganiser, label: "Event Organizer", path: "/event-organisers" },
    { icon: RealEstate, label: "Real Estate", path: "/real-estate" },

    { icon: Fabricators, label: "Fabricators", path: "/fabricators" },
    { icon: Hobbies, label: "Hobbies", path: "/hobbies" },
    { icon: InternetWeb, label: "Internet Website Designer", path: "/web-designers" },
    { icon: Jewellery, label: "Jewellery Showroom", path: "/jewellery" },

    { icon: Printing, label: "Printing & Publishing Service", path: "/printing" },
    { icon: Placement, label: "Placement Service", path: "/placement" },
    { icon: Painting, label: "Painting Contractor", path: "/painting-contractors" },
    { icon: Registration, label: "Registration Consultant", path: "/registration-consultants" },

    { icon: ScrapDealers, label: "Scrap Dealer", path: "/scrap-dealers" },
    { icon: ScrapBuyers, label: "Scrap Buyer", path: "/scrap-buyers" },
    { icon: Coaching, label: "Coaching", path: "/coaching" },
    { icon: VocationalTraining, label: "Vocational training", path: "/vocational-training" },

    { icon: Lawyers, label: "Lawyer", path: "/lawyers" },
    { icon: NursingServices, label: "Nursing Service", path: "/nursing-services" },
];

const PopularCategoriesDrawer = ({ openFromHome = false, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(openFromHome);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (openFromHome) setDrawerOpen(true);
    }, [openFromHome]);

    const slugify = (text) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const filtered = STATIC_CATEGORIES.filter((cat) =>
        cat.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => {
                setDrawerOpen(false);
                onClose && onClose();
            }}
            PaperProps={{
                sx: { width: "70%", maxWidth: "900px", padding: "20px" }
            }}
        >
            <div className="pc-header">
                <h2>Popular Categories</h2>
                <CloseIcon
                    className="pc-close"
                    onClick={() => {
                        setDrawerOpen(false);
                        onClose && onClose();
                    }}
                />
            </div>

            <div className="pc-search">
                <SearchIcon />
                <input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="pc-grid">
                {filtered.map((cat) => (
                    <div
                        key={cat.label}
                        className="pc-item"
                        onClick={() => {
                            navigate(`/category/${slugify(cat.label)}`, {
                                state: { categoryName: cat.label }
                            });
                            setDrawerOpen(false);
                        }}
                    >
                        <img src={cat.icon} alt={cat.label} className="pc-icon" />
                        <span>{cat.label}</span>
                    </div>
                ))}
            </div>
        </Drawer>
    );
};

export default PopularCategoriesDrawer;
