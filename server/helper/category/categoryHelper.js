import { ObjectId } from "mongodb";
import categoryModel from "../../model/category/categoryModel.js";
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";


export const createCategory = async (reqBody = {}) => {
  try {
    if (reqBody.parentCategoryId === "" || reqBody.parentCategoryId === undefined) {
      reqBody.parentCategoryId = null;
    }

    if (typeof reqBody.keywords === "string") {
      reqBody.keywords = reqBody.keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);
    }

    if (reqBody.categoryImage) {
      const uploadResult = await uploadImageToS3(
        reqBody.categoryImage,
        `category/images/category-${Date.now()}`
      );
      delete reqBody.categoryImage;
      reqBody.categoryImageKey = uploadResult.key;
    }

    const categoryDocument = new categoryModel(reqBody);
    const result = await categoryDocument.save();

    if (result.categoryImageKey) {
      result.categoryImage = getSignedUrlByKey(result.categoryImageKey);
    }

    return result;
  } catch (error) {
    console.error("Error saving category:", error);
    throw error;
  }
};


export const viewCategory = async (id) => {
  try {
    if (!ObjectId.isValid(id)) throw new Error("Invalid category ID");

    const category = await categoryModel.findById(id).lean();
    if (!category) throw new Error("Category not found");

    if (category.categoryImageKey) {
      category.categoryImage = getSignedUrlByKey(category.categoryImageKey);
    }

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

/**
 * VIEW ALL CATEGORIES
 */
export const viewAllCategory = async () => {
  try {
    const categories = await categoryModel.find({ isActive: true }).lean();

    if (!categories || categories.length === 0) {
      throw new Error("No categories found");
    }

    return categories.map((category) => {
      if (category.categoryImageKey) {
        category.categoryImage = getSignedUrlByKey(category.categoryImageKey);
      }
      return category;
    });
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

/**
 * UPDATE CATEGORY
 */
export const updateCategory = async (id, data) => {
  try {
    if (!ObjectId.isValid(id)) throw new Error("Invalid category ID");

    if (data.parentCategoryId === "" || data.parentCategoryId === undefined) {
      data.parentCategoryId = null;
    }

    if (typeof data.keywords === "string") {
      data.keywords = data.keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);
    }

    if (
      data.categoryImage &&
      typeof data.categoryImage === "string" &&
      data.categoryImage.startsWith("data:image")
    ) {
      const uploadResult = await uploadImageToS3(
        data.categoryImage,
        `category/images/category-${Date.now()}`
      );
      data.categoryImageKey = uploadResult.key;
    } else if (data.categoryImage === null || data.categoryImage === "") {
      data.categoryImageKey = "";
    }
    delete data.categoryImage;

    const category = await categoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new Error("Category not found");

    if (category.categoryImageKey) {
      category.categoryImage = getSignedUrlByKey(category.categoryImageKey);
    }

    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};



export const deleteCategory = async (id) => {
  try {
    if (!ObjectId.isValid(id)) throw new Error("Invalid category ID");

    const deletedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!deletedCategory) throw new Error("Category not found");

    return deletedCategory;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
