import React, { useRef } from 'react';
import Bangalore from "../../../assets/TopTourist/Bangalore.png";
import Chennai from "../../../assets/TopTourist/Chennai.png";
import Hyderabad from "../../../assets/TopTourist/Hyderabad.png";
import Ooty from "../../../assets/TopTourist/Ooty.png";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TrendingCards from '../trendingSearch/trendingCard';
import './topTourist.css';
import { Link } from 'react-router-dom';

const trendingServices = [
  { id: 1, name: "Ooty", image: Ooty, alt: "Electrician", path: "/trending/ooty", component: TrendingCards },
  { id: 2, name: "Bangalore", image: Bangalore, alt: "Parlour", path: "/trending/bangalore", component: TrendingCards },
  { id: 3, name: "Chennai", image: Chennai, alt: "Spa", path: "/trending/chennai", component: TrendingCards },
  { id: 4, name: "Hyderabad", image: Hyderabad, alt: "Saloon", path: "/trending/hyderabad", component: TrendingCards },
];

const TopTourist = () => {
  const carouselRef = useRef(null);
  const scrollAmount = 280;

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="trendingSection">
      <div className="headerContent">
        <h2 className="sectionTitle">Top Tourist Places</h2>
      </div>
      <div className="carouselControls">
        <div
          className="scrollIndicator left"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <KeyboardDoubleArrowLeftIcon className="arrow" />
        </div>
        <div
          className="scrollIndicator right"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <KeyboardDoubleArrowRightIcon className="arrow" />
        </div>
      </div>
      <div className="carouselWrapper">
        <div className="carouselContainer" ref={carouselRef}>
          {trendingServices.map((service) => (
            <Link
              key={service.id}
              to={service.path}
              className="cardLink"
            >
              <div className="cardImageWrapper">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="cardImage"
                />
              </div>
              <div className="cardInfo">
                <p className="cardName">{service.name}</p>
                <div className="exploreLink">
                  Explore <ChevronRightIcon className="exploreArrow" />
                </div>
              </div>
            </Link>

          ))}
        </div>
      </div>
    </div>
  );
};

export default TopTourist;