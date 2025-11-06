import React from "react";
import { Link } from "react-router-dom";
import TvService from "../../../assets/services/tvService.png";
import PestService from "../../../assets/services/pestService.png";
import CarMechanic from "../../../assets/services/carService.png";
import Parlours from "../../../assets/services/parlours.png";
import Spa from "../../../assets/services/spa.png";
import Salons from "../../../assets/services/salons.png";
import Fencing from "../../../assets/services/fencing.jpg";
import Interlock from "../../../assets/services/interlockBricks.png";
import SteelDealers from "../../../assets/services/steelDealers.png";
import JPromoters from "../../../assets/services/JPromoters.png";
import SkRealEstate from "../../../assets/services/SkRealEstate.png";
import SjPromters from "../../../assets/services/SjPromoters.png";
import CarServiceCards from "../ServiceCards/carService/carService";
import TvServiceCards from "../ServiceCards/tvService/tvService";
import PestControlCards from "../ServiceCards/pestControl/pestControlService";
import BeautyParloursCards from "../ServiceCards/beautyParlours/beautyParlours";
import SpaAndMassageCards from "../ServiceCards/spaAndMassage/spaAndMassage";
import SalonsCards from "../ServiceCards/salons/salons";
import FencingCards from "../ServiceCards/fencing/fencing";
import InterlockBricksCards from "../ServiceCards/interlockBricks/interlockBricks";
import SteelDealersCards from "../ServiceCards/steelDealers/steelDealers";
import RealEstateCards from "../ServiceCards/realEstate/realEstate";
import './serviceCard.css'

export const categoriesServices = [
  {
    title: "Repair and Services",
    items: [
      { name: "Car Service", icon: CarMechanic, path: "/services/car-service", component: CarServiceCards }, 
      { name: "TV Service", icon: TvService, path: "/services/tv-service", component: TvServiceCards},
      { name: "Pest Control Service", icon: PestService, path: "/services/pest-control-service", component: PestControlCards },
    ],
  },
  {
    title: "Beauty and Spa",
    items: [
      { name: "Beauty Parlours", icon: Parlours, path: "/beauty/parlours", component: BeautyParloursCards  },
      { name: "Spa and Massages", icon: Spa, path: "/beauty/spa-massages" , component: SpaAndMassageCards },
      { name: "Salons", icon: Salons, path: "/beauty/salons",component: SalonsCards  },
    ],
  },
  {
    title: "Building Materials",
    items: [
      { name: "Fencing", icon: Fencing, path: "/materials/fencing",component: FencingCards  },
      { name: "Interlock Bricks", icon: Interlock, path: "/materials/interlock-bricks",component: InterlockBricksCards },
      { name: "Steel Dealer", icon: SteelDealers, path: "/materials/steel-dealer",component: SteelDealersCards},
    ],
  },
  {
    title: "Real Estate",
    items: [
      { name: "J Promoters", icon: JPromoters, path: "/real-estate/j-promoters",component: RealEstateCards },
      { name: "SK Real Estate", icon: SkRealEstate, path: "/real-estate/sk-real-estate",component: RealEstateCards },
      { name: "SJ Promoters", icon: SjPromters, path: "/real-estate/sj-promoters" ,component: RealEstateCards},
    ],
  },
];



const ServiceCardsGrid = () => {
    return (
        <div className="service-cards-container">
            {categoriesServices.map((category, index) => (
                <div className="category-card" key={index}>
                    <h2 className="category-title">{category.title}</h2>
                    <div className="items-grid">
                        {category.items.map((item, idx) => (
                            <Link
                                to={item.path}
                                className="item-card"
                                key={idx}
                                aria-label={`Explore ${item.name}`}
                            >
                                <img 
                                    src={item.icon} 
                                    alt={item.name} 
                                    className="item-icon" 
                                    role="img" 
                                /> 
                                <p className="item-name">{item.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ServiceCardsGrid;
