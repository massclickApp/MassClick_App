import React, { useEffect, useState } from "react";
import "./popularCategories.css";
import CardDesign from "../cards.js";
import { useDispatch, useSelector } from "react-redux";
import CardsSearch from "../../CardsSearch/CardsSearch.js";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import Salon from "../../../../assets/features/barbershop.png";
import Astrologers from "../../../../assets/features/astrologers.png";
import BodyMassage from "../../../../assets/features/Bodymassage.png";
import BeautyParlour from "../../../../assets/features/beauty-parlour.png";
import CarHire from "../../../../assets/features/Carhired.png";
import Spa from "../../../../assets/features/spa.png";
import CharteredAccountant from "../../../../assets/features/accountant.png";
import ComputerTraining from "../../../../assets/features/computer-course.png";
import CourierServices from "../../../../assets/features/delivery.png";
import Electricians from "../../../../assets/features/electrician.png";
import EventOrganiser from "../../../../assets/features/eventorgan.png";
import RealEstate from "../../../../assets/features/real-estates.png";
import Fabricators from "../../../../assets/features/fabricator.png";
import Hobbies from "../../../../assets/features/hobby.png";
import InternetWeb from "../../../../assets/features/internet-web.png";
import Jewellery from "../../../../assets/features/jewelry.png";
import Lawyers from "../../../../assets/features/lawyer.png";
import NursingServices from "../../../../assets/features/nurse-service.png";
import Printing from "../../../../assets/features/printer.png";
import Placement from "../../../../assets/features/hiring.png";
import Painting from "../../../../assets/features/painters.png";
import ScrapDealers from "../../../../assets/features/scrap.png";
import Registration from "../../../../assets/features/Registration.png";
import Coaching from "../../../../assets/features/coaching.png";
import ScrapBuyers from "../../../../assets/features/scrap-buyers.png";
import VocationalTraining from "../../../../assets/features/vocational-training.png";
import VastuConsultant from "../../../../assets/features/vastu-consultant.png";
import Numerology from "../../../../assets/features/numerology.png";
import Geologist from "../../../../assets/features/geologist.png";
import Textile from "../../../../assets/features/textile.png";
import PaintingService from "../../../../assets/features/paint-services.png";
import Opticals from "../../../../assets/features/opticals.png";
import Tailoring from "../../../../assets/features/tailoring.png";
import OrganicShop from "../../../../assets/features/organics.png";
import KidsSchool from "../../../../assets/features/kids-school.png";

import Physiotherapy from "../../../../assets/features/physiotherapy.png";
import ClinicalLab from "../../../../assets/features/clinicalLab.png";
import Architect from "../../../../assets/features/architech.png";
import Sports from "../../../../assets/features/sports.png";
import Tiles from "../../../../assets/features/tiles.png";
import ExportAndImport from "../../../../assets/features/import-export.png";
import Boutique from "../../../../assets/features/boutique.png";
import BookShop from "../../../../assets/features/book-shop.png";
import FancyShop from "../../../../assets/features/fancy-store.png";
import Tatoos from "../../../../assets/features/tatoo.png";
import NursaryGarden from "../../../../assets/features/nursery.png";
import SpecialSchool from "../../../../assets/features/special-school.png";
import MosquitoNet from "../../../../assets/features/mosquito-net.png";
import FootwearShop from "../../../../assets/features/footwear-shop.png";
import HomeoClinic from "../../../../assets/features/homieo.png";
import HearingAid from "../../../../assets/features/hearing-aid.png";
import Automobiles from "../../../../assets/features/auto-mobiles.png";
import Cosmetics from "../../../../assets/features/cosmetics.png";




export const STATIC_CATEGORIES = [
    { icon: Astrologers, label: "Astrologer", path: "/astrologers" },
    { icon: VastuConsultant, label: "Vastu Consultant", path: "/vastu-consultants" },
    { icon: Numerology, label: "Numerology", path: "/numerology" },
    { icon: Geologist, label: "Geologist", path: "/geologist" },

    { icon: CharteredAccountant, label: "Chartered Accountant", path: "/ca" },
    { icon: ComputerTraining, label: "Computer Training Institutes", path: "/computer-training" },
    { icon: Coaching, label: "Coaching", path: "/coaching" },
    { icon: VocationalTraining, label: "Vocational training", path: "/vocational-training" },

    { icon: Lawyers, label: "Lawyer", path: "/lawyers" },
    { icon: Registration, label: "Registration Consultant", path: "/registration-consultants" },
    { icon: Placement, label: "Placement Service", path: "/placement" },
    { icon: KidsSchool, label: "Kids School", path: "/kids-school" },

    { icon: BeautyParlour, label: "Beauty Parlour", path: "/beauty-spa" },
    { icon: BodyMassage, label: "Body Massage", path: "/beauty/spa-massages" },
    { icon: Salon, label: "Salon", path: "/salon" },
    { icon: Spa, label: "Spa", path: "/spa" },

    { icon: CarHire, label: "Car Hire", path: "/car-hire" },
    { icon: Electricians, label: "Electrician", path: "/electricians" },
    { icon: EventOrganiser, label: "Event Organizer", path: "/event-organisers" },
    { icon: RealEstate, label: "Real Estate", path: "/real-estate" },

    { icon: Textile, label: "Textile", path: "/textile" },
    { icon: Fabricators, label: "Fabricators", path: "/fabricators" },
    { icon: Jewellery, label: "Jewellery Showroom", path: "/jewellery" },
    { icon: Tailoring, label: "Tailoring", path: "/tailoring" },

    { icon: PaintingService, label: "Painting Service", path: "/painting-service" },
    { icon: NursingServices, label: "Nursing Service", path: "/nursing-services" },
    { icon: CourierServices, label: "Courier Services", path: "/courier-service" },
    { icon: Printing, label: "Printing & Publishing Service", path: "/printing" },

    { icon: Hobbies, label: "Hobbies", path: "/hobbies" },
    { icon: InternetWeb, label: "Internet Website Designer", path: "/web-designers" },
    { icon: Opticals, label: "Opticals", path: "/opticals" },
    { icon: OrganicShop, label: "Organic Shop", path: "/organic-shop" },

    { icon: ScrapDealers, label: "Scrap Dealer", path: "/scrap-dealers" },
    { icon: ScrapBuyers, label: "Scrap Buyer", path: "/scrap-buyers" },
    { icon: Automobiles, label: "Automobiles", path: "/automobiles" },
    { icon: ExportAndImport, label: "Export & Import", path: "/export-import" },

    { icon: Physiotherapy, label: "Physiotherapy", path: "/physiotherapy" },
    { icon: ClinicalLab, label: "Clinical Lab", path: "/clinical-lab" },
    { icon: HomeoClinic, label: "Homeo Clinic", path: "/homeo-clinic" },
    { icon: Cosmetics, label: "Cosmetics", path: "/cosmetics" },


    { icon: Architect, label: "Architect", path: "/architect" },
    { icon: Sports, label: "Sports", path: "/sports" },
    { icon: Tiles, label: "Tiles", path: "/tiles" },
    { icon: BookShop, label: "Book Shop", path: "/book-shop" },

    { icon: FancyShop, label: "Fancy Shop", path: "/fancy-shop" },
    { icon: Tatoos, label: "Tattoo Artist", path: "/tattoo-artists" },
    { icon: Boutique, label: "Boutique", path: "/boutique" },
    { icon: FootwearShop, label: "Footwear Shop", path: "/footwear-shop" },

    { icon: NursaryGarden, label: "Nursary Garden", path: "/nursary-garden" },
    { icon: SpecialSchool, label: "Special School", path: "/special-school" },
    { icon: MosquitoNet, label: "Mosquito Net", path: "/mosquito-net" },
    { icon: HearingAid, label: "Hearing Aid", path: "/hearing-aid" },

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
