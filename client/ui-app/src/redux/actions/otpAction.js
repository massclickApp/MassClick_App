import axios from "axios";
import {
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE
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

export const verifyOtp = (mobile, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const response = await axios.post(`${API_URL}/otp/verify`, { mobile, otp });
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errPayload = error.response?.data || error.message;
    dispatch({ type: VERIFY_OTP_FAILURE, payload: errPayload });
    throw error;
  }
};
