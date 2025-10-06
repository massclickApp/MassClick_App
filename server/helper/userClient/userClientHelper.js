import { ObjectId } from "mongodb";
import userClientModel from "../../model/userClientModel/userClientModel.js"

export const createUsersClients = async function (reqBody = {}) {
  try {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); 
    const month = String(now.getMonth() + 1).padStart(2, "0"); 
    const day = String(now.getDate()).padStart(2, "0");  
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const clientId = `MC${year}${month}${day}${hours}${minutes}${seconds}`;

    const data = {
      ...reqBody,
      clientId, 
    };

    const usersClientDocument = new userClientModel(data);
    const result = await usersClientDocument.save();
    return result;
  } catch (error) {
    if (error.message && error.message.duplicateKey) {
      throw error;
    }
    console.error("Error saving userClient:", error);
    throw error;
  }
};


export const viewUserClients = async (id) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid user ID");
        }

        const userClient = await userClientModel.findById(id).lean();
        if (!userClient) {
            throw new Error("userClient not found");
        }

        return userClient;
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
    }
};
export const viewAllUserClients = async () => {
    try {
        const usersClient = await userClientModel.find().lean();
        if (!usersClient) {
            throw new Error("No usersClient found");
        }
        return usersClient;
    } catch (error) {
        console.error("Error fetching usersClient:", error);
        throw error;
    }
};
export const updateUserClients = async (id, data) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");

    const updatedUserClient = await userClientModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUserClient) throw new Error("updatedUserClient not found");
    return updatedUserClient;
};

export const deleteUserClients = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID");

  const user = await userClientModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true } 
  );

  if (!user) throw new Error("UserClient not found");
  return user;
};