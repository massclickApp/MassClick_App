import React, { useEffect, useState } from "react";
import "./popularCategories.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientBusinessList } from "../../../../redux/actions/businessListAction.js";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import popular from "../../../../assets/features/agent.png"

import ACService from "../../../../assets/features/ACservice.png";
import Astrologers from "../../../../assets/features/astrologers.png";
import BodyMassage from "../../../../assets/features/Bodymassage.png";
import BeautySpa from "../../../../assets/features/beauty.png";
import CarHire from "../../../../assets/features/Carhired.png";
import Caterers from "../../../../assets/features/caterors.png";
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


const STATIC_CATEGORIES = [
    { icon: ACService, label: "AC Service", path: "/ac-service" },
    { icon: Astrologers, label: "Astrologers", path: "/astrologers" },
    { icon: BodyMassage, label: "Body Massage Centers", path: "/beauty/spa-massages" },
    { icon: BeautySpa, label: "Beauty Spa", path: "/beauty-spa" },

    { icon: CarHire, label: "Car Hire", path: "/car-hire" },
    { icon: Caterers, label: "Caterers", path: "/caterers" },
    { icon: CharteredAccountant, label: "Chartered Accountant", path: "/ca" },
    { icon: ComputerTraining, label: "Computer Training Institutes", path: "/computer-training" },

    { icon: CourierServices, label: "Courier Services", path: "/courier-service" },
    { icon: LaptopRepair, label: "Computer & Laptop Repair", path: "/laptop-repair" },
    { icon: CarRepair, label: "Car Repair & Services", path: "/services/car-service" },
    { icon: Dermatologists, label: "Dermatologists", path: "/dermatologists" },

    { icon: Dentists, label: "Dentists", path: "/dentists" },
    { icon: Electricians, label: "Electricians", path: "/electricians" },
    { icon: EventOrganiser, label: "Event Organizer", path: "/event-organisers" },
    { icon: RealEstate, label: "Real Estate", path: "/real-estate" },

    { icon: Fabricators, label: "Fabricators", path: "/fabricators" },
    { icon: FurnitureRepair, label: "Furniture Repair Services", path: "/furniture-repair" },
    { icon: Hospitals, label: "Hospitals", path: "/hospitals" },
    { icon: HouseKeeping, label: "House keeping Services", path: "/house-keeping" },

    { icon: Hobbies, label: "Hobbies", path: "/hobbies" },
    { icon: InteriorDesigners, label: "Interior Designers", path: "/interior-designers" },
    { icon: InternetWeb, label: "Internet Website Designers", path: "/web-designers" },
    { icon: Jewellery, label: "Jewellery Showrooms", path: "/jewellery" },

    { icon: Lawyers, label: "Lawyers", path: "/lawyers" },
    { icon: Transporters, label: "Transporters", path: "/transporters" },
    { icon: Photographers, label: "Photographers", path: "/photographers" },
    { icon: NursingServices, label: "Nursing Services", path: "/nursing-services" },

    { icon: Printing, label: "Printing & Publishing Services", path: "/printing" },
    { icon: Placement, label: "Placement Services", path: "/placement" },
    { icon: PestControl, label: "Pest Control Services", path: "/services/pest-control-service" },
    { icon: Painting, label: "Painting Contractors", path: "/painting-contractors" },

    { icon: PackersMovers, label: "Packers & Movers", path: "/packers-movers" },
    { icon: ScrapDealers, label: "Scrap Dealers", path: "/scrap-dealers" },
    { icon: ScrapBuyers, label: "Scrap Buyers", path: "/scrap-buyers" },
    { icon: Registration, label: "Registration Consultants", path: "/registration-consultants" },

    { icon: SecuritySystem, label: "Security System", path: "/security-system" },
    { icon: Coaching, label: "Coaching", path: "/coaching" },
    { icon: VocationalTraining, label: "Vocational training", path: "/vocational-training" },
];

const PopularCategoriesDrawer = ({ openFromHome = false, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(openFromHome);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getAllClientBusinessList());
    }, []);

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
