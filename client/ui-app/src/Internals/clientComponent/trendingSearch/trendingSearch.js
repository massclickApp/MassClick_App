import React, { useRef } from "react";
import { Link } from "react-router-dom";

import CarMechanic from "../../../assets/services/carService.png";
import Parlours from "../../../assets/services/parlours.png";
import Msand from "../../../assets/services/Msand.png";
import Hotels from "../../../assets/services/Hotels.png";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "./trendingSearch.css";

export const trendingServices = [
  {
    id: 1,
    name: "Hostels",
    image: CarMechanic,
    alt: "Hostels",
    path: "/trending/hostels",
  },
  {
    id: 2,
    name: "Parlours",
    image: Parlours,
    alt: "Parlours",
    path: "/trending/parlours",
  },
  {
    id: 3,
    name: "M Sand",
    image: Msand,
    alt: "M Sand",
    path: "/trending/realestate",
  },
  {
    id: 4,
    name: "Hotels",
    image: Hotels,
    alt: "Hotels",
    path: "/trending/hotel",
  },
];

const TrendingSearchesCarousel = () => {
  const carouselRef = useRef(null);
  const scrollAmount = 280;

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="trending-search">
      <div className="trending-search__inner">
        {/* Header */}
        <div className="trending-search__header">
          <div>
            <h2 className="trending-search__title">Trending Searches Near You</h2>
            <p className="trending-search__subtitle">
              Discover what people around you are searching for right now.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="trending-search__controls">
          <button
            type="button"
            className="trending-search__control trending-search__control--left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <KeyboardDoubleArrowLeftIcon className="trending-search__control-icon" />
          </button>
          <button
            type="button"
            className="trending-search__control trending-search__control--right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <KeyboardDoubleArrowRightIcon className="trending-search__control-icon" />
          </button>
        </div>

        {/* Carousel */}
        <div className="trending-search__viewport">
          <div className="trending-search__fade trending-search__fade--left" />
          <div className="trending-search__fade trending-search__fade--right" />

          <div className="trending-search__track" ref={carouselRef}>
            {trendingServices.map((service) => (
              <Link
                key={service.id}
                to={service.path}
                className="trending-search__card"
              >
                <div className="trending-search__card-image-wrapper">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="trending-search__card-image"
                  />
                </div>

                <div className="trending-search__card-body">
                  <p className="trending-search__card-title">{service.name}</p>
                  <div className="trending-search__card-cta">
                    <span>Explore</span>
                    <ChevronRightIcon className="trending-search__card-cta-icon" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSearchesCarousel;
