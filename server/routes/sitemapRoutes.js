import express from "express";
import businessListModel from "../model/businessList/businessListModel.js";

const router = express.Router();

/**
 * 🔹 DOMAIN CONFIG
 * - Sitemap files are served from API domain
 * - Actual pages are on main domain
 */
const SITEMAP_BASE = "https://api.massclick.in";   // sitemap location
const SITE_BASE = "https://massclick.in";          // real website pages

/**
 * 🔹 LIMIT PER SITEMAP
 * Google allows 50,000
 * We keep 1,000 for safety & performance
 */
const LIMIT = 1000;

/**
 * 🔹 SLUG GENERATOR
 */
const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * =========================================================
 * 1️⃣ CATEGORY + CITY SITEMAP
 * URL: /sitemap-category-city-1.xml
 * Example page: https://massclick.in/trichy/restaurants
 * =========================================================
 */
router.get("/sitemap-category-city-:page.xml", async (req, res) => {
  try {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");

    const page = Number(req.params.page) || 1;
    const skip = (page - 1) * LIMIT;

    const businesses = await businessListModel
      .find(
        { isActive: true, businessesLive: true },
        { location: 1, category: 1 }
      )
      .lean();

    const uniquePaths = new Set();

    businesses.forEach((b) => {
      if (b.location && b.category) {
        uniquePaths.add(
          `${slugify(b.location)}/${slugify(b.category)}`
        );
      }
    });

    const urls = Array.from(uniquePaths)
      .slice(skip, skip + LIMIT)
      .map(
        (path) => `
        <url>
          <loc>${SITE_BASE}/${path}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

  } catch (error) {
    console.error("❌ Category-City Sitemap Error:", error);
    res.status(500).end();
  }
});

/**
 * =========================================================
 * 2️⃣ BUSINESS DETAIL SITEMAP
 * URL: /sitemap-business-1.xml
 * Example page: https://massclick.in/trichy/chellammal-manpaanai-samayal
 * =========================================================
 */
router.get("/sitemap-business-:page.xml", async (req, res) => {
  try {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");

    const page = Number(req.params.page) || 1;
    const skip = (page - 1) * LIMIT;

    const businesses = await businessListModel
      .find(
        { isActive: true, businessesLive: true },
        { businessName: 1, location: 1, updatedAt: 1 }
      )
      .skip(skip)
      .limit(LIMIT)
      .lean();

    const urls = businesses
      .map(
        (b) => `
        <url>
          <loc>${SITE_BASE}/${slugify(b.location)}/${slugify(
          b.businessName
        )}</loc>
          <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `
      )
      .join("");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

  } catch (error) {
    console.error("❌ Business Sitemap Error:", error);
    res.status(500).end();
  }
});

/**
 * =========================================================
 * 3️⃣ SITEMAP INDEX
 * URL: /sitemap.xml
 * =========================================================
 */
router.get("/sitemap.xml", async (req, res) => {
  try {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");

    const totalBusinesses = await businessListModel.countDocuments({
      isActive: true,
      businessesLive: true,
    });

    const totalPages = Math.ceil(totalBusinesses / LIMIT);

    let links = "";

    for (let i = 1; i <= totalPages; i++) {
      links += `
  <sitemap>
    <loc>${SITEMAP_BASE}/sitemap-category-city-${i}.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITEMAP_BASE}/sitemap-business-${i}.xml</loc>
  </sitemap>`;
    }

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${links}
</sitemapindex>`);

  } catch (error) {
    console.error("❌ Sitemap Index Error:", error);
    res.status(500).end();
  }
});

export default router;
