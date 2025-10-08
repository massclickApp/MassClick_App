// src/redux/actions/enquiryActions.js (or wherever this file lives)

import axios from "axios";
import {
    FETCH_ENQUIRY_REQUEST, FETCH_ENQUIRY_SUCCESS, FETCH_ENQUIRY_FAILURE,
    CREATE_ENQUIRY_REQUEST, CREATE_ENQUIRY_SUCCESS, CREATE_ENQUIRY_FAILURE,
    EDIT_ENQUIRY_REQUEST, EDIT_ENQUIRY_SUCCESS, EDIT_ENQUIRY_FAILURE,
    DELETE_ENQUIRY_REQUEST, DELETE_ENQUIRY_SUCCESS, DELETE_ENQUIRY_FAILURE
} from "../actions/userActionTypes.js"; // Note: Ensure userActionTypes contains the ENQUIRY types

const API_URL = process.env.REACT_APP_API_URL;

// =========================================================
// 1. GET ALL ENQUIRIES (Admin Dashboard Use)
// =========================================================
export const getAllEnquiry = () => async (dispatch) => {
    dispatch({ type: FETCH_ENQUIRY_REQUEST }); // Use ENQUIRY type
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/api/enquiry/viewall`, { // *** CORRECTED API ROUTE ***
            headers: { Authorization: `Bearer ${token}` },
        });

        // Simplified data handling for consistency with backend
        const enquiries = response.data || []; 
        
        dispatch({ type: FETCH_ENQUIRY_SUCCESS, payload: enquiries });
    } catch (error) {
        dispatch({
            type: FETCH_ENQUIRY_FAILURE,
            payload: error.response?.data || error.message,
        });
    }
};

// =========================================================
// 2. CREATE ENQUIRY (Frontend Form Use)
// =========================================================
// Note: Changed parameter name for clarity
export const createEnquiry = (enquiryData) => async (dispatch) => { 
    dispatch({ type: CREATE_ENQUIRY_REQUEST }); // Use ENQUIRY type
    try {
        // NOTE: The frontend form submission for a public user usually does NOT need the 'Authorization' header.
        // I will keep it for now based on your router setup, but consider removing `oauthAuthentication` from the public POST route.
        const token = localStorage.getItem("accessToken"); 
        
       const response = await axios.post(`${API_URL}/enquiry/create`, enquiryData, { 
            headers: { Authorization: `Bearer ${token}` },
        });

        // The backend `addEnquiryAction` sends data inside an object with a `data` key.
        const createdEnquiry = response.data.data || response.data; 

        dispatch({ type: CREATE_ENQUIRY_SUCCESS, payload: createdEnquiry });

        return createdEnquiry;
    } catch (error) {
        const errPayload = error.response?.data || error.message;
        dispatch({ type: CREATE_ENQUIRY_FAILURE, payload: errPayload }); // Use ENQUIRY type
        throw error;
    }
};

// =========================================================
// 3. EDIT ENQUIRY (Admin Dashboard Use)
// =========================================================
export const editEnquiry = (id, enquiryData) => async (dispatch) => { // Updated parameter name
    dispatch({ type: EDIT_ENQUIRY_REQUEST }); // Use ENQUIRY type
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(`${API_URL}/api/enquiry/update/${id}`, enquiryData, { // *** CORRECTED API ROUTE ***
            headers: { Authorization: `Bearer ${token}` },
        });
        
        // The backend `updateEnquiryAction` sends the data inside an object with an `enquiry` key.
        const updatedEnquiry = response.data.enquiry || response.data; 
        
        dispatch({ type: EDIT_ENQUIRY_SUCCESS, payload: updatedEnquiry }); // Use ENQUIRY type
        return updatedEnquiry;
    } catch (error) {
        dispatch({ type: EDIT_ENQUIRY_FAILURE, payload: error.response?.data || error.message }); // Use ENQUIRY type
        throw error;
    }
};

// =========================================================
// 4. DELETE ENQUIRY (Admin Dashboard Use)
// =========================================================
export const deleteEnquiry = (id) => async (dispatch) => {
    dispatch({ type: DELETE_ENQUIRY_REQUEST }); // Use ENQUIRY type
    try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.delete(`${API_URL}/api/enquiry/delete/${id}`, { 
            headers: { Authorization: `Bearer ${token}` },
        });
        
        dispatch({ type: DELETE_ENQUIRY_SUCCESS, payload: data.enquiry }); 
    } catch (error) {
        dispatch({ type: DELETE_ENQUIRY_FAILURE, payload: error.response?.data || error.message }); 
        throw error;
    }
};