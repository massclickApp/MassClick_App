import axios from "axios";
import {
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE,
  USER_LOGOUT,
  UPDATE_OTP_USER_REQUEST, UPDATE_OTP_USER_SUCCESS, UPDATE_OTP_USER_FAILURE,
  VIEW_OTP_USER_REQUEST, VIEW_OTP_USER_SUCCESS, VIEW_OTP_USER_FAILURE,
  VIEWALL_OTP_USER_REQUEST, VIEWALL_OTP_USER_SUCCESS, VIEWALL_OTP_USER_FAILURE
} from "../actions/userActionTypes";

const API_URL = process.env.REACT_APP_API_URL;

export const sendOtp = (mobile) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const response = await axios.post(`${API_URL}/otp/send`, { mobile });
    dispatch({ type: SEND_OTP_SUCCESS, payload: response.data });

    return response.data; 
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: SEND_OTP_FAILURE, payload: errPayload });
    throw error;
  }
};


export const verifyOtp = (mobile, otp, userName = "") => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const response = await axios.post(
      `${API_URL}/otp/verify`,
      { mobile, otp, userName },            
      { headers: { "Content-Type": "application/json" } }  
    );

    const token = response.data.token;
    if (token) {
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    dispatch({ type: VERIFY_OTP_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: VERIFY_OTP_FAILURE, payload: errPayload });
    throw error;
  }
};
export const updateOtpUser = (mobile, data) => async (dispatch) => {
  dispatch({ type: UPDATE_OTP_USER_REQUEST });
  try {
    const response = await axios.put(`${API_URL}/otp_user_update/${mobile}`, data);
    dispatch({ type: UPDATE_OTP_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: UPDATE_OTP_USER_FAILURE, payload: errPayload });
    throw error;
  }
};

// --- View Single OTP User ---
export const viewOtpUser = (mobile) => async (dispatch) => {
  dispatch({ type: VIEW_OTP_USER_REQUEST });
  try {
    const response = await axios.get(`${API_URL}/otp_user/${mobile}`);
    dispatch({ type: VIEW_OTP_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: VIEW_OTP_USER_FAILURE, payload: errPayload });
    throw error;
  }
};


// --- View All OTP Users ---
export const viewAllOtpUsers = () => async (dispatch) => {
  dispatch({ type: VIEWALL_OTP_USER_REQUEST });
  try {
    const response = await axios.get(`${API_URL}/otp_users`);
    dispatch({ type: VIEWALL_OTP_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: VIEWALL_OTP_USER_FAILURE, payload: errPayload });
    throw error;
  }
};

// --- Delete User ---
// export const deleteUser = (mobile) => async (dispatch) => {
//   dispatch({ type: DELETE_USER_REQUEST });
//   try {
//     const response = await axios.delete(`${API_URL}/otp_user/${mobile}`);
//     dispatch({ type: DELETE_USER_SUCCESS, payload: response.data });
//     return response.data;
//   } catch (error) {
//     const errPayload = error.response?.data || error.message;
//     dispatch({ type: DELETE_USER_FAILURE, payload: errPayload });
//     throw error;
//   }
// };



export const userLogout = () => (dispatch) => {
  localStorage.removeItem("authToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: USER_LOGOUT });
};
