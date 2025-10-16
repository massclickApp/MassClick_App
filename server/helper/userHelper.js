import { ObjectId } from "mongodb";
import userModel from "../model/userModel.js"
import { uploadImageToS3, getSignedUrlByKey } from "../s3Uploder.js";

export const createUsers = async function (reqBody = {}) {
  try {

    if (reqBody.userProfile) {
      const uploadResult = await uploadImageToS3(
        reqBody.userProfile,
        `admin/users/profile-${Date.now()}`
      );
      delete reqBody.userProfile;
      reqBody.userProfile = uploadResult.key;
    }
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
    if (user.userProfileKey) {
      user.userProfileKey = getSignedUrlByKey(user.userProfileKey);
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
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    const usersWithSignedUrls = users.map((user) => {
      if (user.userProfileKey) {
        user.userProfile = getSignedUrlByKey(user.userProfileKey);
      }
      return user;
    });

    return usersWithSignedUrls;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");
  if (data.userProfile && typeof data.userProfile === "string" && data.userProfile.startsWith("data:image")) {
    const uploadResult = await uploadImageToS3(
      data.userProfile,
      `admin/users/profile-${Date.now()}`
    );
    data.userProfileKey = uploadResult.key;
  } else if (data.userProfile === null || data.userProfile === "") {
    data.userProfileKey = "";
  }
  delete data.userProfile;

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