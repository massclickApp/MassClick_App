import React from 'react';
import { Card, CardContent, Typography, Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";

// Import all necessary icons
import CarWashIcon from '../../assets/car.png';
import CateringIcon from '../../assets/catering.png';
import PestControlIcon from '../../assets/pest.png';
import PlumbingIcon from '../../assets/plumbing.png';
import TvIcon from '../../assets/tv.png';
import WaterSupplyIcon from '../../assets/water.png';
import RestuarantIcon from '../../assets/features/restuarant.png';
import HotelIcon from '../../assets/features/hotel.png';
import MassageIcon from '../../assets/features/massage.png';
import HomeDecIcon from '../../assets/features/homeDec.png';
import WeddingIcon from '../../assets/features/weddingceremony.png';
import EducationIcon from '../../assets/features/education.png';
import RentIcon from '../../assets/features/rent.png';
import HospitalIcon from '../../assets/features/hospital.png';
import ContractIcon from '../../assets/features/contractor.png';
import PetShopIcon from '../../assets/features/petshop.png';
import HostelsIcon from '../../assets/features/hostels.png';
import AgentIcon from '../../assets/features/agent.png';
import DentistIcon from '../../assets/features/dentist.png';
import GymIcon from '../../assets/features/gym.png';
import LoanIcon from '../../assets/features/loan.png';
import EventIcon from '../../assets/features/eventorgan.png';
import DrivingIcon from '../../assets/features/driving.png';
import PackersIcon from '../../assets/features/packers.png';
import DeliveryIcon from '../../assets/features/delivery.png';
import PopularIcon from '../../assets/features/popular.png';
// import RestuarantCards from './cards/retuarants/restuarant';
import RestaurantCards from './cards/resturant/restaurant';
import HotelCards from './cards/hotels/hotel.js';
import BeautySpaCards from './cards/beautySpa/beautySpa.js';
import HomeDecorCards from './cards/homeDecor/homeDecor.js';
import WeddingPlanCards from './cards/weddingPlan/weddingPlan.js';
import EducationCards from './cards/education/education.js';
import RentAndHiringCards from './cards/RentandHiring/rentAndHiring.js';
import HospitalsCards from './cards/hospitals/hospitals.js';
import ContractorsCards from './cards/contractors/contractors.js';
import PetShopsCards from './cards/petShops/petShops.js';
import PgAndHostelsCards from './cards/pgAndHostels/pgAndHostels.js';
import EstateAgentCards from './cards/estateAgent/estateAgent.js';
import DentistsCards from './cards/dentists/dentists.js';
import GymCards from './cards/gym/gym.js';
import LoansCards from './cards/loans/loans.js';
import EventOrganisersCards from './cards/eventOrganisers/eventOrganisers.js';
import DrivingSchoolsCards from './cards/driving Schools/drivingSchools.js';
import PackersAndMoversCards from './cards/packersAndMovers/packersAndMovers.js';
import CourierServiceCards from './cards/courierService/courierService.js';
import PopularCategoriesCards from './cards/popularCategories/popularCategories.js';

const StyledServiceCard = styled(Card)(({ theme }) => ({
  width: 120,
  height: 150,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: "16px",
  border: "2px solid rgba(255, 123, 0, 0.2)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
    border: "2px solid #ff8c00",
  },
}));

export const featuredServices = [
  { name: "Restaurants", icon: RestuarantIcon, path: "/restaurants", component: RestaurantCards },
  { name: "Hotels", icon: HotelIcon, path: "/hotels", component: HotelCards },
  { name: "Beauty Spa", icon: MassageIcon, path: "/beauty-spa", component: BeautySpaCards },
  { name: "Home Decor", icon: HomeDecIcon, path: "/home-decor",component: HomeDecorCards },
  { name: "Wedding Planning", icon: WeddingIcon, path: "/wedding-planning",component: WeddingPlanCards },
  { name: "Education", icon: EducationIcon, path: "/education", component: EducationCards },
  { name: "Rent & Hire", icon: RentIcon, path: "/rent-hire", component: RentAndHiringCards },
  { name: "Hospitals", icon: HospitalIcon, path: "/hospitals", component: HospitalsCards },
  { name: "Contractors", icon: ContractIcon, path: "/contractors",component: ContractorsCards  },
  { name: "Pet Shops", icon: PetShopIcon, path: "/pet-shops",component: PetShopsCards },
  { name: "PG/Hostels", icon: HostelsIcon, path: "/pg-hostels",component: PgAndHostelsCards },
  { name: "Estate Agent", icon: AgentIcon, path: "/estate-agent",component: EstateAgentCards },
  { name: "Dentists", icon: DentistIcon, path: "/dentists",component: DentistsCards },
  { name: "Gym", icon: GymIcon, path: "/gym",component: GymCards  },
  { name: "Loans", icon: LoanIcon, path: "/loans" ,component: LoansCards},
  { name: "Event Organisers", icon: EventIcon, path: "/event-organisers",component: EventOrganisersCards },
  { name: "Driving Schools", icon: DrivingIcon, path: "/driving-schools" ,component: DrivingSchoolsCards},
  { name: "Packers & Movers", icon: PackersIcon, path: "/packers-movers",component: PackersAndMoversCards },
  { name: "Courier Service", icon: DeliveryIcon, path: "/courier-service",component: CourierServiceCards},
  { name: "Popular Categories", icon: PopularIcon, path: "/popular-categories",component: PopularCategoriesCards },
];


const FeaturedServicesSection = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ my: { xs: 6, md: 10 } }}>
      <Grid container spacing={4} justifyContent="center">
        {featuredServices.map((service, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <StyledServiceCard
              onClick={() => navigate(service.path)}
            >
              <CardContent
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={service.icon}
                  alt={service.name}
                  sx={{
                    width: { xs: 60, sm: 70 },
                    height: { xs: 60, sm: 70 },
                    objectFit: "contain",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    textAlign: "center",
                  }}
                >
                  {service.name}
                </Typography>
              </CardContent>
            </StyledServiceCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default FeaturedServicesSection;