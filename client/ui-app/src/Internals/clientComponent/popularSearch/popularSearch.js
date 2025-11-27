import React, { useRef } from "react";
import "./CardCarousel.css";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import Cctv from "../../../assets/Popular/CCTV.png";
import Education from "../../../assets/Popular/Education.png";
import HotelRoom from "../../../assets/Popular/HotelRoom.png";
import Photography from "../../../assets/Popular/Photography.png";

const cardsData = [
  {
    title: "CCTV",
    image: Cctv,
    buttonText: "Enquire Now",
    accent: "#e67e22",
    alt: "CCTV camera installation",
  },
  {
    title: "Hotels",
    image: HotelRoom,
    buttonText: "Enquire Now",
    accent: "#e67e22",
    alt: "Modern hotel room",
  },
  {
    title: "Photography",
    image: Photography,
    buttonText: "Enquire Now",
    accent: "#e67e22",
    alt: "Photographer with camera",
  },
  {
    title: "Education",
    image: Education,
    buttonText: "Enquire Now",
    accent: "#e67e22",
    alt: "Graduation scroll",
  },
  {
    title: "Logistics",
    image: Cctv,
    buttonText: "Enquire Now",
    accent: "#5dade2",
    alt: "Logistics and delivery",
  },
  {
    title: "Consulting",
    image: HotelRoom,
    buttonText: "Enquire Now",
    accent: "#2ecc71",
    alt: "Business consulting",
  },
];

const CardCarousel = () => {
  const containerRef = useRef(null);

  const scrollByCard = (direction) => {
    if (!containerRef.current) return;

    const cardElement = containerRef.current.querySelector(
      ".popular-search__card"
    );
    const cardWidth = cardElement ? cardElement.offsetWidth : 280;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    const offset = direction === "right" ? scrollAmount : -scrollAmount;

    containerRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="popular-search">
      <div className="popular-search__inner">
        {/* Header */}
        <div className="popular-search__header">
          <div>
            <h2 className="popular-search__title">Popular Searches</h2>
            <p className="popular-search__subtitle">
              Quick access to the most in-demand services around you.
            </p>
          </div>

          <div className="popular-search__controls">
            <button
              type="button"
              className="popular-search__control popular-search__control--left"
              onClick={() => scrollByCard("left")}
              aria-label="Scroll left"
            >
              <KeyboardDoubleArrowLeftIcon className="popular-search__control-icon" />
            </button>
            <button
              type="button"
              className="popular-search__control popular-search__control--right"
              onClick={() => scrollByCard("right")}
              aria-label="Scroll right"
            >
              <KeyboardDoubleArrowRightIcon className="popular-search__control-icon" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="popular-search__viewport">
          <div className="popular-search__fade popular-search__fade--left" />
          <div className="popular-search__fade popular-search__fade--right" />

          <div className="popular-search__track" ref={containerRef}>
            {cardsData.map((card, index) => (
              <article
                className="popular-search__card"
                key={index}
                style={{ "--accent-color": card.accent }}
              >
                <div className="popular-search__card-image-wrapper">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="popular-search__card-image"
                  />
                </div>

                <div className="popular-search__card-body">
                  <div className="popular-search__card-tag">
                    Popular
                  </div>

                  <h3 className="popular-search__card-title">
                    {card.title}
                  </h3>

                  <button className="popular-search__card-button">
                    {card.buttonText}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
