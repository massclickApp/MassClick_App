import {
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE
} from "../actions/userActionTypes";

const initialState = {
  loading: false,
  error: null,
  otpResponse: null,
  verifyResponse: null,
};

export default function otpReducer(state = initialState, action) {
  switch (action.type) {
    // Request states
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null };

    // Success states
    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, otpResponse: action.payload, error: null };

    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, verifyResponse: action.payload, error: null };

    // Failure states
    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
