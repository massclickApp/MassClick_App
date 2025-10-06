import { ObjectId } from "mongodb";
import categoryModel from "../../model/category/categoryModel.js"

export const createCategory = async function (reqBody = {}) {
    try {

        const data = {
            ...reqBody,
        };
        const categoryDocument = new categoryModel(data);
        const result = await categoryDocument.save();
        return result;
    } catch (error) {
        if (error.message && error.message.duplicateKey) {
            throw error;
        }
        console.error('Error saving category:', error);
        throw error;
    }
};

export const viewCategory = async (id) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid category ID");
        }

        const category = await categoryModel.findById(id).lean();
        if (!category) {
            throw new Error("category not found");
        }

        return category;
    } catch (error) {
        console.error("Error in category:", error);
        throw error;
    }
};
export const viewAllCategory = async () => {
    try {
        const category = await categoryModel.find().lean();
        if (!category) {
            throw new Error("No category found");
        }
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

export const updateCategory = async (id, data) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid category ID");

    const category = await categoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new Error("category not found");
    return category;
};

export const deleteCategory = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid category ID");

  const deletedcategory = await categoryModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true } 
  );    if (!deletedcategory) throw new Error("category not found");
    return deletedcategory;
};