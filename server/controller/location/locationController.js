import { createLocation, viewLocation, viewAllLocation, updateLocation, deleteLocation } from "../../helper/location/locationHelper.js";
import { BAD_REQUEST } from "../../errorCodes.js";

export const addLocationAction = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await createLocation(reqBody);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send(error.message);
    }
};
export const viewLocationAction = async (req, res) => {
    try {
        const locationId = req.params.id;
        const location = await viewLocation(locationId);
        res.send(location);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const viewAllLocationAction = async (req, res) => {
    try {
        const allLocation = await viewAllLocation();
        res.send(allLocation);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST.code).send({ message: error.message });
    }
};
export const updateLocationAction = async (req, res) => {
    try {
        const locationId = req.params.id;
        const locationData = req.body;
        const location = await updateLocation(locationId, locationData);
        res.send(location);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};

export const deleteLocationAction = async (req, res) => {
    try {
        const locationId = req.params.id;
        const location = await deleteLocation(locationId);
        res.send({ message: "User deleted successfully", location });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};
