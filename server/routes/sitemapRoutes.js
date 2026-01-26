import express from "express";
import businessListModel from "../model/businessList/businessListModel.js";

const router = express.Router();
const BASE_URL = "https://massclick.in";
const LIMIT = 1000;


export const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");


router.get("/sitemap-category-city-:page.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");

    const page = Number(req.params.page) || 1;
    const skip = (page - 1) * LIMIT;

    const businesses = await businessListModel.find(
      { isActive: true, businessesLive: true },
      { location: 1, category: 1 }
    ).lean();

    const uniquePaths = new Set();

    businesses.forEach(b => {
      if (b.location && b.category) {
        uniquePaths.add(
          `${slugify(b.location)}/${slugify(b.category)}`
        );
      }
    });

    const urls = Array.from(uniquePaths)
      .slice(skip, skip + LIMIT)
      .map(path => `
        <url>
          <loc>${BASE_URL}/${path}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `)
      .join("");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`);

  } catch (err) {
    console.error("Category-City Sitemap Error:", err);
    res.status(500).end();
  }
});


router.get("/sitemap-business-:page.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");

    const page = Number(req.params.page) || 1;
    const skip = (page - 1) * LIMIT;

    const businesses = await businessListModel.find(
      { isActive: true, businessesLive: true },
      { businessName: 1, location: 1, updatedAt: 1 }
    )
      .skip(skip)
      .limit(LIMIT)
      .lean();

    const urls = businesses.map(b => `
      <url>
        <loc>${BASE_URL}/${slugify(b.location)}/${slugify(b.businessName)}</loc>
        <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>
        <priority>0.8</priority>
      </url>
    `).join("");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`);

  } catch (err) {
    console.error("Business Sitemap Error:", err);
    res.status(500).end();
  }
});


router.get("/sitemap.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");

    const totalBusinesses = await businessListModel.countDocuments({
      isActive: true,
      businessesLive: true
    });

    const totalPages = Math.ceil(totalBusinesses / LIMIT);

    let links = "";

    for (let i = 1; i <= totalPages; i++) {
      links += `
        <sitemap>
          <loc>${BASE_URL}/sitemap-category-city-${i}.xml</loc>
        </sitemap>
        <sitemap>
          <loc>${BASE_URL}/sitemap-business-${i}.xml</loc>
        </sitemap>
      `;
    }

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${links}
    </sitemapindex>`);

  } catch (err) {
    console.error("Sitemap Index Error:", err);
    res.status(500).end();
  }
});

export default router;
