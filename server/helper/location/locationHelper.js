import { ObjectId } from "mongodb";
import locationModel from "../../model/locationModel/locationModel.js"

export const createLocation = async function (reqBody = {}) {
    try {

        const data = {
            ...reqBody,
        };
        const locationDocument = new locationModel(data);
        const result = await locationDocument.save();
        return result;
    } catch (error) {
        if (error.message && error.message.duplicateKey) {
            throw error;
        }
        console.error('Error saving location:', error);
        throw error;
    }
};

export const viewLocation = async (id) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid user ID");
        }

        const location = await locationModel.findById(id).lean();
        if (!location) {
            throw new Error("location not found");
        }

        return location;
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
    }
};
export const viewAllLocation = async (pageNo, pageSize) => {
  try {
    const query = {};

    const total = await locationModel.countDocuments(query);

    const locations = await locationModel
      .find(query)
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return { list: locations, total };
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};
export const updateLocation = async (id, data) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");

    const location = await locationModel.findByIdAndUpdate(id, data, { new: true });
    if (!location) throw new Error("location not found");
    return location;
};

export const deleteLocation = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid deletelocation ID");

 const deletedLocation = await locationModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }   
  );    if (!deletedLocation) throw new Error("Location not found");
    return deletedLocation;
};