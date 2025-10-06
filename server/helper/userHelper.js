import { ObjectId } from "mongodb";
import userModel from "../model/userModel.js"

export const createUsers = async function (reqBody = {}) {
    try {
       
        const data = {
            ...reqBody,
        };
        const usersDocument = new userModel(data);
        const result = await usersDocument.save();
        return result;
    } catch (error) {
        if (error.message && error.message.duplicateKey) {
            throw error;
        }
        console.error('Error saving userDocument:', error);
        throw error;
    }
};

export const viewUser = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await userModel.findById(id).lean();
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
};
export const viewAllUser = async () => {
  try {
    const users = await userModel.find().lean();
    if (!users) {
      throw new Error("No users found");
    }
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const updateUser = async (id, data) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");
  
  const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
};

export const deleteUser = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");

  const user = await userModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true } 
  );

  if (!user) throw new Error("User not found");
  return user;
};