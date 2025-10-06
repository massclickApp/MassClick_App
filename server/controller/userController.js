import { createUsers, viewUser, viewAllUser, updateUser, deleteUser } from "../helper/userHelper.js";
import { BAD_REQUEST } from "../errorCodes.js";

export const addUsersAction = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await createUsers(reqBody);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};
export const viewUsersAction = async (req, res) => {
     try {
    const userId = req.params.id; 
    const user = await viewUser(userId);
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(BAD_REQUEST.code).send({ message: error.message });
  }
};
export const viewAllUsersAction = async (req, res) => {
  try {
    const allUser = await viewAllUser();
    res.send(allUser);
  } catch (error) {
    console.error(error);
    return res.status(BAD_REQUEST.code).send({ message: error.message });
  }
};
export const updateUsersAction = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body; 
    const user = await updateUser(userId, userData);
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: error.message });
  }
};

export const deleteUsersAction = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await deleteUser(userId);
    res.send({ message: "User deactivated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: error.message });
  }
};
