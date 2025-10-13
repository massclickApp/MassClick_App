import {
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE, USER_LOGOUT
} from "../actions/userActionTypes";

const initialState = {
  loading: false,
  error: null,
  otpResponse: null,
  verifyResponse: null,
};

export default function otpReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null };
    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, otpResponse: action.payload, error: null };
    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, verifyResponse: action.payload, error: null };
    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
