import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";

// Import all necessary icons
// import CarWashIcon from '../../assets/car.png';
// import CateringIcon from '../../assets/catering.png';
// import PestControlIcon from '../../assets/pest.png';
// import PlumbingIcon from '../../assets/plumbing.png';
// import TvIcon from '../../assets/tv.png';
// import WaterSupplyIcon from '../../../assets/water.png';
import RestuarantIcon from '../../../assets/features/restuarant.png';
import HotelIcon from '../../../assets/features/hotel.png';
import InteriorDesignerIcon from '../../../assets/features/interiors-Designers.png';
import FurnitureIcon from '../../../assets/features/furniture.png';
import RentIcon from '../../../assets/features/rent.png';
import HospitalIcon from '../../../assets/features/hospital.png';
import ContractIcon from '../../../assets/features/contractor.png';
import housekeeperIcon from '../../../assets/features/housekeeper.png';
import HostelsIcon from '../../../assets/features/hostels.png';
import SecuritySystemIcon from '../../../assets/features/security-system.png';
import DentistIcon from '../../../assets/features/dentist.png';
import FloristIcon from '../../../assets/features/florist.png';
import WeddingHallIcon from '../../../assets/features/wedding-hall.png';
import PhotographerIcon from '../../../assets/features/photographer.png';
import DermatologistIcon from '../../../assets/features/dermatologist.png';
import PackersIcon from '../../../assets/features/packers.png';
import MatrimonyIcon from '../../../assets/features/matrimony.png';
import PopularIcon from '../../../assets/features/popular.png';
import SexologyIcon from '../../../assets/features/sexology.png';
import GymIcon from '../../../assets/features/gym.png';

// import RestuarantCards from './cards/retuarants/restuarant';
import RestaurantCards from '../cards/resturant/restaurant.js';
import HotelCards from '../cards/hotels/hotel.js';
import HomeDecorCards from '../cards/homeDecor/homeDecor.js';
import RentAndHiringCards from '../cards/RentandHiring/rentAndHiring.js';
import HospitalsCards from '../cards/hospitals/hospitals.js';
import ContractorsCards from '../cards/contractors/contractors.js';
import PgAndHostelsCards from '../cards/pgAndHostels/pgAndHostels.js';
import DentistsCards from '../cards/dentists/dentists.js';
import GymCards from '../cards/gym/gym.js';
import PackersAndMoversCards from '../cards/packersAndMovers/packersAndMovers.js';
import PopularCategoriesCards from '../cards/popularCategories/popularCategories.js';
import DermatologistCards from '../cards/dermatologist/dermatologist.js';
import SexologistCards from '../cards/sexologist/sexologist.js'
import FurnituresCards from '../cards/furnitures/furnitures.js';
import FloristCards from '../cards/florist/florist.js';
import HouseKeeping from '../cards/houseKeeping/houseKeeping.js'
import SecuritySystemCards from '../cards/securitySystem/securitySystem.js';
import WeddingMallCards from '../cards/weddingMahal/weddingmall.js';
import PhotographyCards from '../cards/photography/photography.js';
import MatrimonyCards from '../cards/matrimony/matrimony.js';

import './featureService.css'

export const featuredServices = [
  { name: "Hotels", icon: HotelIcon, path: "/hotels", component: HotelCards },
  { name: "Rent And Hire", icon: RentIcon, path: "/rent-hire", component: RentAndHiringCards },
  { name: "Restaurants", icon: RestuarantIcon, path: "/restaurants", component: RestaurantCards },
  { name: "Hospitals", icon: HospitalIcon, path: "/hospitals", component: HospitalsCards },
  { name: "Dentists", icon: DentistIcon, path: "/dentists", component: DentistsCards },
  { name: "Dermatologists", icon: DermatologistIcon, path: "/dermatologist", component: DermatologistCards },
  { name: "Sexologist", icon: SexologyIcon, path: "/sexologist", component: SexologistCards },
  { name: "Contractors", icon: ContractIcon, path: "/contractors", component: ContractorsCards },
  { name: "Interior Designer", icon: InteriorDesignerIcon, path: "/interior-designer", component: HomeDecorCards },
  { name: "Gym", icon: GymIcon, path: "/gym", component: GymCards },
  { name: "Furnitures", icon: FurnitureIcon, path: "/furnitures", component: FurnituresCards },
  { name: "Florist", icon: FloristIcon, path: "/florist", component: FloristCards },
  { name: "Packers & Movers", icon: PackersIcon, path: "/packers-movers", component: PackersAndMoversCards },
  { name: "House Keeping Service", icon: housekeeperIcon, path: "/house-keeping-service", component: HouseKeeping },
  { name: "Security System", icon: SecuritySystemIcon, path: "/security-system", component: SecuritySystemCards },
  { name: "Wedding Mahal", icon: WeddingHallIcon, path: "/wedding-mahal", component: WeddingMallCards },
  { name: "Photography", icon: PhotographerIcon, path: "/photographer", component: PhotographyCards },
  { name: "Matrimony", icon: MatrimonyIcon, path: "/matrimony", component: MatrimonyCards },
  { name: "PG/Hostels", icon: HostelsIcon, path: "/pg-hostels", component: PgAndHostelsCards },
  { name: "Popular Categories", icon: PopularIcon, component: PopularCategoriesCards },
];

const FeaturedServicesSection = () => {
  const navigate = useNavigate();
  const [openPopularDrawer, setOpenPopularDrawer] = useState(false);

  return (
    <>
      <div className="featured-services-container">
        {featuredServices.map((service, index) => (
          <div
            className="service-card"
            key={index}
            onClick={() => {

              if (service.name === "Popular Categories") {
                setOpenPopularDrawer(true);
              } else {
                navigate(service.path);
              }
            }}
          >
            <img src={service.icon} alt={service.name} className="service-icons" />
            <div className="service-name">{service.name}</div>
          </div>
        ))}
      </div>

      {openPopularDrawer && (
        <PopularCategoriesCards
          openFromHome={true}
          onClose={() => setOpenPopularDrawer(false)}
        />
      )}
    </>
  );
};
export default FeaturedServicesSection;