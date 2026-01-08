import seoModel from "../../model/seoModel/seoModel.js";

export const createSeo = async (reqBody = {}) => {
  try {
    const seoDoc = new seoModel(reqBody);
    return await seoDoc.save();
  } catch (error) {
    console.error("SEO create error:", error);
    throw error;
  }
};

export const getSeo = async ({ pageType, category, location }) => {
  try {
    const query = {
      pageType,
      isActive: true,
    };

    if (category) query.category = category;
    if (location) query.location = location;

    return await seoModel.findOne(query).lean();
  } catch (error) {
    console.error("SEO fetch error:", error);
    throw error;
  }
};

export const getSeoMeta = async ({ pageType, category, location }) => {
  try {
    const normalize = (v = "") => v.toString().trim();

    const safePageType = normalize(pageType);
    const safeCategory = normalize(category);
    const safeLocation = normalize(location);

    let seo = null;

    /* ===============================
       1️⃣ Category + Location (Highest Priority)
       =============================== */
    if (safeCategory && safeLocation) {
      seo = await seoModel.findOne({
        pageType: safePageType,
        category: { $regex: `^${safeCategory}$`, $options: "i" },
        location: { $regex: `^${safeLocation}$`, $options: "i" },
        isActive: true,
      }).lean();

      if (seo) return seo;
    }

    /* ===============================
       2️⃣ Category only
       =============================== */
    if (safeCategory) {
      seo = await seoModel.findOne({
        pageType: safePageType,
        category: { $regex: `^${safeCategory}$`, $options: "i" },
        isActive: true,
      }).lean();

      if (seo) return seo;
    }

    /* ===============================
       3️⃣ Page type only (example: home, about, services)
       =============================== */
    seo = await seoModel.findOne({
      pageType: safePageType,
      isActive: true,
    }).lean();

    if (seo) return seo;

    /* ===============================
       4️⃣ Global fallback (Massclick default)
       =============================== */
    return {
      title: "Massclick - Local Business Search Platform",
      description:
        "Find trusted local businesses, services, and professionals near you on Massclick.",
      keywords: "local search, businesses near me, Massclick",
      canonical: "https://massclick.in",
      robots: "index, follow",
    };
  } catch (error) {
    console.error("SEO META FETCH ERROR:", error);

    // Absolute safety fallback
    return {
      title: "Massclick",
      description: "Massclick - India's local business search platform",
      robots: "index, follow",
    };
  }
};



export const viewAllSeo = async ({
  pageNo,
  pageSize,
  search,
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const total = await seoModel.countDocuments(query);

  const list = await seoModel
    .find(query)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return { list, total };
};

export const updateSeo = async (id, data) => {
  const seo = await seoModel.findByIdAndUpdate(id, data, { new: true });
  if (!seo) throw new Error("SEO not found");
  return seo;
};

export const deleteSeo = async (id) => {
  const seo = await seoModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!seo) throw new Error("SEO not found");
  return seo;
};
