import axios from "axios";
import {
  FETCH_BUSINESS_REQUEST, FETCH_BUSINESS_SUCCESS, FETCH_BUSINESS_FAILURE,
  CREATE_BUSINESS_REQUEST, CREATE_BUSINESS_SUCCESS, CREATE_BUSINESS_FAILURE,
  EDIT_BUSINESS_REQUEST, EDIT_BUSINESS_SUCCESS, EDIT_BUSINESS_FAILURE,
  DELETE_BUSINESS_REQUEST, DELETE_BUSINESS_SUCCESS, DELETE_BUSINESS_FAILURE,
  ACTIVE_BUSINESS_REQUEST, ACTIVE_BUSINESS_SUCCESS, ACTIVE_BUSINESS_FAILURE,
  FETCH_TRENDING_REQUEST, FETCH_TRENDING_SUCCESS, FETCH_TRENDING_FAILURE,
  FETCH_SEARCH_LOGS_REQUEST, FETCH_SEARCH_LOGS_SUCCESS, FETCH_SEARCH_LOGS_FAILURE,
  FETCH_VIEWBUSINESS_REQUEST, FETCH_VIEWBUSINESS_SUCCESS, FETCH_VIEWBUSINESS_FAILURE

} from "../actions/userActionTypes.js";
import { getClientToken } from "./clientAuthAction.js";
const API_URL = process.env.REACT_APP_API_URL;

const getValidToken = async (dispatch) => {
  let token = localStorage.getItem("accessToken");
  if (!token) token = await dispatch(getClientToken());
  if (!token) throw new Error("No valid token found");
  return token;
};


export const getAllBusinessList = () => async (dispatch) => {
  dispatch({ type: FETCH_BUSINESS_REQUEST });

  try {
    const token = await getValidToken(dispatch);

    if (!token) {
      throw new Error("No valid access token found");
    }

    const response = await axios.get(`${API_URL}/businesslist/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const businessList =
      Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.clients || [];

    dispatch({ type: FETCH_BUSINESS_SUCCESS, payload: businessList });
  } catch (error) {
    console.error("getAllBusinessList error:", error);
    dispatch({
      type: FETCH_BUSINESS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const getAllClientBusinessList = () => async (dispatch) => {
  dispatch({ type: FETCH_VIEWBUSINESS_REQUEST });

  try {
    const token = await dispatch(getClientToken());
console.log("token",token);

    const response = await axios.get(`${API_URL}/businesslist/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const businessList =
      Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.clients || [];

    dispatch({ type: FETCH_VIEWBUSINESS_SUCCESS, payload: businessList });
  } catch (error) {
    console.error("getAllBusinessList error:", error);
    dispatch({
      type: FETCH_VIEWBUSINESS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const createBusinessList = (businessListData) => async (dispatch) => {
  dispatch({ type: CREATE_BUSINESS_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${API_URL}/businesslist/create`, businessListData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const businessList = response.data.data || response.data;

    dispatch({ type: CREATE_BUSINESS_SUCCESS, payload: businessList });

    return businessList;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: CREATE_BUSINESS_FAILURE, payload: errPayload });
    throw error;
  }
};
export const toggleBusinessStatus = ({ id, newStatus }) => async (dispatch) => {
  dispatch({ type: ACTIVE_BUSINESS_REQUEST });

  try {
       const token = localStorage.getItem("accessToken");


    if (!token) {
      throw new Error("No valid access token found");
    }
    const response = await axios.put(
      `${API_URL}/businesslist/activate/${id}`,
      { activeBusinesses: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedBusiness = response.data.business;

    dispatch({ type: ACTIVE_BUSINESS_SUCCESS, payload: updatedBusiness });

    return updatedBusiness;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: ACTIVE_BUSINESS_FAILURE, payload: errPayload });
    throw error;
  }
};

export const editBusinessList = (id, businessData) => async (dispatch) => {
  dispatch({ type: EDIT_BUSINESS_REQUEST });
  try {
    const token = await dispatch(getClientToken());

    const response = await axios.put(`${API_URL}/businesslist/update/${id}`, businessData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedBusinessList = response.data;
    dispatch({ type: EDIT_BUSINESS_SUCCESS, payload: updatedBusinessList });
    return updatedBusinessList;
  } catch (error) {
    dispatch({ type: EDIT_BUSINESS_FAILURE, payload: error.response?.data || error.message });
    throw error;
  }
};


export const deleteBusinessList = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BUSINESS_REQUEST });
  try {
       const token = localStorage.getItem("accessToken");


    if (!token) {
      throw new Error("No valid access token found");
    } await axios.delete(`${API_URL}/businesslist/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: DELETE_BUSINESS_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_BUSINESS_FAILURE, payload: error.response?.data || error.message });
    throw error;
  }
};

export const getTrendingSearches = (location) => async (dispatch) => {
  dispatch({ type: FETCH_TRENDING_REQUEST });
  try {
   const token = await dispatch(getClientToken());

    if (!token) {
      throw new Error("No valid access token found");
    }
    const url = location
      ? `${API_URL}/businesslist/trending-searches?location=${location}`
      : `${API_URL}/businesslist/trending-searches`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: FETCH_TRENDING_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching trending searches:", error);
    dispatch({
      type: FETCH_TRENDING_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};


export const logSearchActivity = (categoryName, location, userDetails, searchedUserText = "") =>
  async (dispatch) => {
    try {
      const token = await dispatch(getClientToken());

      await axios.post(
        `${API_URL}/businesslist/log-search`,
        { categoryName, location, searchedUserText, userDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (error) {
      console.warn("Failed to log search activity:", error.message);
    }
};


export const getAllSearchLogs = () => async (dispatch) => {
  dispatch({ type: FETCH_SEARCH_LOGS_REQUEST });

  try {
   const token = await dispatch(getClientToken());

    if (!token) {
      throw new Error("No valid access token found");
    }
    const response = await axios.get(`${API_URL}/businesslist/trending-searches/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const logs = Array.isArray(response.data) ? response.data : [];
    dispatch({ type: FETCH_SEARCH_LOGS_SUCCESS, payload: logs });
  } catch (error) {
    dispatch({
      type: FETCH_SEARCH_LOGS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};