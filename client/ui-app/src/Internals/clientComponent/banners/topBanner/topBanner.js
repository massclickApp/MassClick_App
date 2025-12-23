import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdvertisementByCategory } from "../../../../redux/actions/advertisementAction";
import "./topBanner.css";

const SLIDE_INTERVAL = 5000;

const parseDate = (date) => {
  if (!date) return null;
  if (typeof date === "string") return new Date(date);
  if (typeof date === "object" && date.$date) return new Date(date.$date);
  return null;
};

const normalizeCategory = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/s$/, "");
};


const TopBannerAds = ({ category }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (category) {
      dispatch(getAdvertisementByCategory(category));
    }
  }, [dispatch, category]);

  const { categoryAdvertisements = [], loading } = useSelector(
    (state) => state.advertisement || {}
  );

  const bannerAds = useMemo(() => {
    if (!categoryAdvertisements.length || !category) return [];

    const now = new Date();

    return categoryAdvertisements.filter((ad) => {
      const start = parseDate(ad.startTime);
      const end = parseDate(ad.endTime);

      if (!start || !end) return false;

      const image =
        ad.bannerImage ||
        (ad.bannerImageKey
          ? `https://massclickdev.s3.ap-southeast-2.amazonaws.com/${ad.bannerImageKey}`
          : null);
      if (now < start.getTime() || now > end.getTime()) return false;

      return (
        ad.isActive &&
        !ad.isDeleted &&
        ad.position === "TOP_BANNER" &&
        normalizeCategory(ad.category) === normalizeCategory(category) &&
        image
      );
    });
  }, [categoryAdvertisements, category]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bannerAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === bannerAds.length - 1 ? 0 : prev + 1
      );
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [bannerAds]);

  if (loading || bannerAds.length === 0) return null;

  return (
    <div className="top-banner-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerAds.map((ad) => (
          <a
            key={ad._id}
            href={ad.redirectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="carousel-slide"
          >
            <div className="banner-image-wrapper">
              <img
                src={
                  ad.bannerImage ||
                  `https://massclickdev.s3.ap-southeast-2.amazonaws.com/${ad.bannerImageKey}`
                }
                alt={ad.title}
                loading="lazy"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopBannerAds;
