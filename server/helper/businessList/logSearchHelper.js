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
export const getAllSearchLogs = async () => {
    try {
        const logs = await searchLogModel.find().sort({ createdAt: -1 }); 
        return logs;
    } catch (error) {
        console.error("Error fetching Search Logs:", error);
        return [];
    }
};