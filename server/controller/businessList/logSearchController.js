import { createSearchLog, getAllSearchLogs } from "../../helper/businessList/logSearchHelper.js";

export const logSearchAction = async (req, res) => {
    try {
        const { categoryName, location, userDetails } = req.body;

        const filteredUser = [{
            userName: userDetails?.userName || "",
            mobileNumber1: userDetails?.mobileNumber1 || "",
            mobileNumber2: userDetails?.mobileNumber2 || "",
            email: userDetails?.email || ""
        }];

        await createSearchLog({
            categoryName,
            location,
            userDetails: filteredUser
        });

        res.status(202).send({ message: "Search logged successfully" });

    } catch (error) {
        console.error("Error logging search:", error);
        res.status(500).send({ message: "Error logging search" });
    }
};

export const viewLogSearchAction = async (req, res) => {
    try {
        const logs = await getAllSearchLogs();
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching search logs:", error);
        res.status(500).json({ message: "Failed to fetch search logs" });
    }
};