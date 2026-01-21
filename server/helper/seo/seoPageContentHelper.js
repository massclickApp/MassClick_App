import seoPageContentModel from "../../model/seoModel/seoPageContentModel.js";

export const createPageContentSeo = async (reqBody = {}) => {
  try {
    const seoDoc = new seoPageContentModel(reqBody);
    return await seoDoc.save();
  } catch (error) {
    console.error("SEO create error:", error);
    throw error;
  }
};

export const getSeoPageContent = async ({ pageType, category, location }) => {
  try {
    const query = {
      pageType,
      isActive: true,
    };

    if (category) query.category = category;
    if (location) query.location = location;

    return await seoPageContentModel.findOne(query).lean();
  } catch (error) {
    console.error("SEOPageContent fetch error:", error);
    throw error;
  }
};

export const getSeoPageContentMetaService = async ({
  pageType,
  category,
  location,
}) => {
  try {
    let seo = null;

    const normalizedCategory = category?.toLowerCase();
    const singularCategory = normalizedCategory?.endsWith("s")
      ? normalizedCategory.slice(0, -1)
      : normalizedCategory;

    if (normalizedCategory && location) {
      seo = await seoPageContentModel.findOne({
        pageType,
        category: {
          $regex: `^(?:${normalizedCategory}|${singularCategory})$`,
          $options: "i",
        },
        location: { $regex: `^${location}$`, $options: "i" },
        isActive: true,
      }).lean();

      if (seo) return seo;
    }

    if (normalizedCategory) {
      seo = await seoPageContentModel.findOne({
        pageType,
        category: {
          $regex: `^(?:${normalizedCategory}|${singularCategory})$`,
          $options: "i",
        },
        isActive: true,
      }).lean();

      if (seo) return seo;
    }

    seo = await seoPageContentModel.findOne({
      pageType,
      categorySlug: category.toLowerCase().trim(),
      isActive: true,
    }).lean();


    if (seo) return seo;

    return {
      headerContent: `<h1>Discover Local Businesses on Massclick</h1>`,
      pageContent: `<p>Explore trusted businesses near you.</p>`,
    };
  } catch (error) {
    console.error("SEO PAGE CONTENT FETCH ERROR:", error);
    throw error;
  }
};


export const viewAllSeoPageContent = async ({
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

  const total = await seoPageContentModel.countDocuments(query);

  const list = await seoPageContentModel
    .find(query)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return { list, total };
};

export const updateSeoPageContent = async (id, data) => {
  const seo = await seoPageContentModel.findByIdAndUpdate(id, data, { new: true });
  if (!seo) throw new Error("SEOPageContent not found");
  return seo;
};

export const deleteSeoPageContent = async (id) => {
  const seo = await seoPageContentModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!seo) throw new Error("SEOPageContent not found");
  return seo;
};
