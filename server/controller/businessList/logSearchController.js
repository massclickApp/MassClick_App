import { createSearchLog, getAllSearchLogs, getMatchedSearchLogs, updateSearchData } from "../../helper/businessList/logSearchHelper.js";

export const logSearchAction = async (req, res) => {
    try {
        const { categoryName, location,searchedUserText, userDetails } = req.body;

        const filteredUser = [{
            userName: userDetails?.userName || "",
            mobileNumber1: userDetails?.mobileNumber1 || "",
            mobileNumber2: userDetails?.mobileNumber2 || "",
            email: userDetails?.email || ""
        }];

        await createSearchLog({
            categoryName,
            location,
            searchedUserText,
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

export const viewSearchAction = async (req, res) => {
  try {
    const { category, keywords = [] } = req.body;

    if (!category && keywords.length === 0) {
      return res.status(400).json({ message: "Category or keywords required" });
    }

    const logs = await getMatchedSearchLogs(category, keywords);
    res.status(200).json(logs);

  } catch (error) {
    console.error("Error fetching matched search logs:", error);
    res.status(500).json({ message: "Failed to fetch search logs" });
  }
};
export const updateSearchAction = async (req, res) => {
  try {
    const searchID = req.params.id;

    if (!searchID) {
      return res.status(400).json({ message: "Search log ID required" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.authUser?.userId || null,
    };

    const updatedLog = await updateSearchData(searchID, updateData);

    return res.status(200).json({
      success: true,
      data: updatedLog,
    });

  } catch (error) {
    console.error("updateSearchAction error:", error);
    return res.status(500).json({ message: error.message });
  }
};
