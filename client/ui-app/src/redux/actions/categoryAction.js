import axios from "axios";
import {
  FETCH_CATEGORY_REQUEST, FETCH_CATEGORY_SUCCESS, FETCH_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE,
  EDIT_CATEGORY_REQUEST, EDIT_CATEGORY_SUCCESS,EDIT_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAILURE
} from "../actions/userActionTypes.js";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllCategory = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_URL}/category/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    let category = [];
    if (Array.isArray(response.data)) {
      category = response.data;
    } else if (response.data?.data) {
      category = response.data.data;
    } else if (response.data?.clients) {
      category = response.data.clients;
    }

    dispatch({ type: FETCH_CATEGORY_SUCCESS, payload: category });
  } catch (error) {
    dispatch({
      type: FETCH_CATEGORY_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};


export const createCategory = (categoryData) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${API_URL}/category/create`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const category = response.data.data || response.data;

    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: category });

    return category;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: CREATE_CATEGORY_FAILURE, payload: errPayload });
    throw error;
  }
};

export const editCategory = (id, categoryData) => async (dispatch) => {
  dispatch({ type: EDIT_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(`${API_URL}/category/update/${id}`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedCategory = response.data;
    dispatch({ type: EDIT_CATEGORY_SUCCESS, payload: updatedCategory });
    return updatedCategory;
  } catch (error) {
    dispatch({ type: EDIT_CATEGORY_FAILURE, payload: error.response?.data || error.message });
    throw error;
  }
};


export const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    const token = localStorage.getItem("accessToken");
    const { data } =  await axios.delete(`${API_URL}/category/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: data.category });
  } catch (error) {
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error.response?.data || error.message });
    throw error;
  }
};