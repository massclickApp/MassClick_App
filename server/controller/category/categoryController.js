import { createCategory, viewCategory, viewAllCategory, updateCategory, deleteCategory } from "../../helper/category/categoryHelper.js";
import { BAD_REQUEST } from "../../errorCodes.js";

export const addCategoryAction = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await createCategory(reqBody);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);    
    }
};
export const viewCategoryAction = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await viewCategory(categoryId);
        res.send(category);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const viewAllCategoryAction = async (req, res) => {
    try {
        const allCategory = await viewAllCategory();
        res.send(allCategory);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const updateCategoryAction = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;
        const category = await updateCategory(categoryId, categoryData);
        res.send(category);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};

export const deleteCategoryAction = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await deleteCategory(categoryId);
        res.send({ message: "Category deleted successfully", category });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};
