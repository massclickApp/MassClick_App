import React from "react";
import { Helmet } from "react-helmet-async";
import { CATEGORY_META } from "./seoDocument.js";

const normalize = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "");

const slugify = (text = "") =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

const SeoMeta = ({ category, location }) => {
  const normalizedCategory = normalize(category);
  const normalizedLocation = normalize(location);

  const seoData =
    CATEGORY_META?.[normalizedCategory]?.[normalizedLocation];

  const title =
    seoData?.title ||
    `${category} in ${location} - Massclick`;

  const description =
    seoData?.description ||
    `Find the best ${category} in ${location}. Get phone numbers, address, ratings and reviews on Massclick.`;

  const keywords =
    seoData?.keywords ||
    `${category} in ${location}, ${category} near me, ${location} ${category}`;

  const canonicalUrl = `https://www.massclick.com/${slugify(
    location
  )}/${slugify(category)}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Massclick" />
      <meta name="publisher" content="Massclick" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SeoMeta;
