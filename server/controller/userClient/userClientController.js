import { createUsersClients, viewUserClients, viewAllUserClients, updateUserClients, deleteUserClients } from "../../helper/userClient/userClientHelper.js";
import { BAD_REQUEST } from "../../errorCodes.js";

export const addUsersClientAction = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await createUsersClients(reqBody);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};
export const viewUsersClientAction = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await viewUserClients(userId);
        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const viewAllUsersClientAction = async (req, res) => {
    try {
        const allUser = await viewAllUserClients();
        res.send(allUser);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const updateUsersClientAction = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = await updateUserClients(userId, userData);
        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};

export const deleteUsersClientAction = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await deleteUserClients(userId);
        res.send({ message: "User deleted successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};
