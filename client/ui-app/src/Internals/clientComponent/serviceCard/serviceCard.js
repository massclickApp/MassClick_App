import React from "react";
import { Link } from "react-router-dom";
import TvService from "../../../assets/services/tv-service.png";
import PestService from "../../../assets/services/pestService.png";
import CarMechanic from "../../../assets/services/car-service.png";
import BikeService from "../../../assets/features/bike-service.png";
import ComputerAndLaptopIcon from "../../../assets/services/computer-services.png";
import CateringIcon from "../../../assets/features/caterors.png";
import Fencing from "../../../assets/services/fencing.jpg";
import Interlock from "../../../assets/services/interlockBricks.png";
import SteelDealers from "../../../assets/services/steelDealers.png";
import Transports from "../../../assets/features/transportation.png";
import DrivingSchool from "../../../assets/features/driving.png";
import ACServiceIcon from "../../../assets/features/ACservice.png"
import CarServiceCards from "../ServiceCards/carService/carService";
import TvServiceCards from "../ServiceCards/tvService/tvService";
import PestControlCards from "../ServiceCards/pestControl/pestControlService";
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
      { name: "TV Service", icon: TvService, path: "/services/tv-service", component: TvServiceCards },
      { name: "Bike Service", icon: BikeService, path: "/services/bike-service", component: PestControlCards },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Pest Control Service", icon: PestService, path: "/services/pest-control-service", component: PestControlCards },
      { name: "Ac Services", icon: ACServiceIcon, path: "/services/ac-services", component: SpaAndMassageCards },
      { name: "Computer And Laptop Service", icon: ComputerAndLaptopIcon, path: "/services/computer-and-services", component: SalonsCards },
    ],
  },
  {
    title: "Hot Categories",
    items: [
      { name: "Catering Service", icon: CateringIcon, path: "/hot-categories/catering-services", component: RealEstateCards },
      { name: "Transports", icon: Transports, path: "/hot-categories/transportation", component: RealEstateCards },
      { name: "Driving Schools", icon: DrivingSchool, path: "/hot-categories/driving-school", component: RealEstateCards },
    ],
  },
  {
    title: "Building Materials",
    items: [
      { name: "Fencing", icon: Fencing, path: "/materials/fencing", component: FencingCards },
      { name: "Interlock Bricks", icon: Interlock, path: "/materials/interlock-bricks", component: InterlockBricksCards },
      { name: "Steel Dealer", icon: SteelDealers, path: "/materials/steel-dealer", component: SteelDealersCards },
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
