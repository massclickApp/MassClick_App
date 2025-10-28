import { createBusinessList, viewBusinessList, viewAllBusinessList, updateBusinessList,getTrendingSearches, deleteBusinessList,activeBusinessList } from "../../helper/businessList/businessListHelper.js";
import { BAD_REQUEST } from "../../errorCodes.js";

export const addBusinessListAction = async (req, res) => {
  try {
    const reqBody = req.body;

    if (req.authUser && req.authUser.userId) {
      reqBody.createdBy = req.authUser.userId;
    } else {
      return res.status(401).send({ message: "Unauthorized: Missing userId" });
    }
    const result = await createBusinessList(reqBody);
    res.send(result);
  } catch (error) {
    console.error("Error in addBusinessListAction:", error);
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST.code).send(error.message);
    }
    return res.status(BAD_REQUEST.code).send("Error saving Business.");
  }
};

export const viewBusinessListAction = async (req, res) => {
    try {
        const businessId = req.params.id;
        const business = await viewBusinessList(businessId);
        res.send(business);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const viewAllBusinessListAction = async (req, res) => {
  try {
    const { userRole, userId } = req.authUser; 
    
    const allBusinessList = await viewAllBusinessList(userRole, userId);
    res.send(allBusinessList);
  } catch (error) {
    console.error("Error in viewAllBusinessListAction:", error);
    return res.status(BAD_REQUEST.code).send({ message: error.message });
  }
};
export const updateBusinessListAction = async (req, res) => {
  try {
    const businessId = req.params.id;
    const businessData = {
      ...req.body,
      updatedBy: req.authUser?.userId,
    };
    const business = await updateBusinessList(businessId, businessData);
    res.send(business);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: error.message });
  }
};

export const deleteBusinessListAction = async (req, res) => {
    try {
        const businessId = req.params.id;
        const business = await deleteBusinessList(businessId);
        res.send({ message: "business deleted successfully", business });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};
export const activeBusinessListAction = async (req, res) => {
  try {
    const businessId = req.params.id;
    const { activeBusinesses } = req.body;

    const business = await activeBusinessList(businessId, activeBusinesses);

    res.send({
      message: `Business ${business.activeBusinesses ? "activated" : "deactivated"} successfully`,
      business,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};
export const getTrendingSearchesAction = async (req, res) => {
    try {
        const location = req.query.location; 

        const trendingList = await getTrendingSearches(4, location); 

        res.send(trendingList);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Failed to fetch trending data" });
    }
};

