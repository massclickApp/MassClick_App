import { createRoles, viewRoles, viewAllRoles, updateRoles, deleteRoles } from "../../helper/roles/rolesHelper.js";
import { BAD_REQUEST } from "../../errorCodes.js";

export const addRolesAction = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await createRoles(reqBody);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};
export const viewRolesAction = async (req, res) => {
    try {
        const rolesId = req.params.id;
        const roles = await viewRoles(rolesId);
        res.send(roles);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const viewAllRolesAction = async (req, res) => {
    try {
        const allRoles = await viewAllRoles();
        res.send(allRoles);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const updateRolesAction = async (req, res) => {
    try {
        const rolesId = req.params.id;
        const rolesData = req.body;
        const roles = await updateRoles(rolesId, rolesData);
        res.send(roles);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};

export const deleteRolesAction = async (req, res) => {
    try {
        const rolesId = req.params.id;
        const roles = await deleteRoles(rolesId);
        res.send({ message: "roles deleted successfully", roles });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};
