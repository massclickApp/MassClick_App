import { ObjectId } from "mongodb";
import searchLogModel from "../../model/businessList/searchLogModel.js"
import mongoose from "mongoose";


export const createSearchLog = async function (data = {}) {
    try {
        const searchLogDocument = new searchLogModel(data);
        const result = await searchLogDocument.save();
        return result;
    } catch (error) {
        console.error('Error saving Search Log:', error);
        return null; 
    }
};