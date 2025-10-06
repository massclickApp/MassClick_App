import { createSearchLog } from "../../helper/businessList/logSearchHelper.js";

export const logSearchAction = async (req, res) => {
    try {
        const { categoryName, location } = req.body; 
        
        await createSearchLog({ categoryName, location }); 

        res.status(202).send({ message: "Search logged successfully" });

    } catch (error) {
        console.error("Error logging search:", error);
        res.status(202).send({ message: "Search logged with error" }); 
    }
};