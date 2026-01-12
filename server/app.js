/* ================= CORE IMPORTS ================= */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import userClientRoutes from "./routes/userClientRoute.js";
import locationRoutes from "./routes/locationRoute.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import businessListRoutes from "./routes/businessListRoute.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import enquiryRoutes from "./routes/enquiryRoute.js";
import startYourProjectRoutes from "./routes/startYourProjectRoutes.js";
import otpRoutes from "./routes/msg91Routes.js";
import phonePayRoutes from "./routes/phonePayRoute.js";
import advertismentRoutes from "./routes/advertistmentRoute.js";
import leadsDataRoutes from "./routes/leadsDataRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";

import seoModel from "./model/seoModel/seoModel.js";
import businessListModel from "./model/businessList/businessListModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "https://massclick.in",
      "https://www.massclick.in",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const buildPath = path.join(__dirname, "../client/ui-app/build");
console.log("Serving React from:", buildPath);

const indexHtml = fs.readFileSync(
  path.join(buildPath, "index.html"),
  "utf8"
);

app.use(express.static(buildPath));

const normalize = (v = "") =>
  v.toLowerCase().trim().replace(/\s+/g, "");


app.get("/:location/:category", async (req, res, next) => {
  try {
    const { location, category } = req.params;

    const blockedRoutes = [
      "api",
      "auth",
      "user",
      "seo",
      "business",
      "location",
      "category",
      "admin",
    ];

    if (blockedRoutes.includes(location)) {
      return next();
    }

    const seo =
      (await seoModel.findOne({
        pageType: "category",
        category: normalize(category),
        location: normalize(location),
        isActive: true,
      }).lean()) || {
        title: `${category} in ${location} - Massclick`,
        description: `Find the best ${category} in ${location}. Get phone numbers, address, ratings and reviews on Massclick.`,
        keywords: `${category} in ${location}, ${category} near me`,
        canonical: `https://massclick.in/${location}/${category}`,
      };

    const businesses = await businessListModel
      .find({
        businessesLive: true,
        category: new RegExp(category, "i"),
        location: new RegExp(location, "i"),
      })
      .limit(10)
      .select("_id slug")
      .lean();

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${category} in ${location}`,
      "itemListElement": businesses.map((b, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://massclick.in/${location}/${b.slug}/${b._id}`,
      })),
    };

    let html = indexHtml
      .replace(
        /<title>.*<\/title>/i,
        `<title>${seo.title}</title>`
      )
      .replace(
        /<\/head>/i,
        `
        <meta name="description" content="${seo.description}" />
        ${seo.keywords ? `<meta name="keywords" content="${seo.keywords}" />` : ""}
        <link rel="canonical" href="${seo.canonical}" />
        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">
        ${JSON.stringify(itemListSchema)}
        </script>

        </head>
        `
      );

    return res.send(html);
  } catch (error) {
    console.error("SEO SSR ERROR:", error);
    return res.send(indexHtml);
  }
});

app.use("/", userRoutes);
app.use("/", oauthRoutes);
app.use("/", userClientRoutes);
app.use("/", locationRoutes);
app.use("/", categoryRoutes);
app.use("/", businessListRoutes);
app.use("/", rolesRoutes);
app.use("/", enquiryRoutes);
app.use("/", startYourProjectRoutes);
app.use("/", otpRoutes);
app.use("/", phonePayRoutes);
app.use("/", advertismentRoutes);
app.use("/", leadsDataRoutes);
app.use("/", seoRoutes);

app.use((req, res) => {
  res.send(indexHtml);
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected ✅"))
  .catch((err) =>
    console.log("Database connection error ❌", err)
  );

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} 🚀`);
});
