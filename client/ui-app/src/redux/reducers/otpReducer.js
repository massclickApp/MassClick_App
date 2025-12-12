import {
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE,
  USER_LOGOUT,
  UPDATE_OTP_USER_REQUEST, UPDATE_OTP_USER_SUCCESS, UPDATE_OTP_USER_FAILURE,
  VIEW_OTP_USER_REQUEST, VIEW_OTP_USER_SUCCESS, VIEW_OTP_USER_FAILURE,
  VIEWALL_OTP_USER_REQUEST, VIEWALL_OTP_USER_SUCCESS, VIEWALL_OTP_USER_FAILURE,
  LOG_USER_SEARCH_REQUEST, LOG_USER_SEARCH_SUCCESS, LOG_USER_SEARCH_FAILURE, SET_FILTERED_LEADS,SET_ALL_LEADS,
  // SEND_WHATSAPP_REQUEST,
  // SEND_WHATSAPP_SUCCESS,
  // SEND_WHATSAPP_FAILURE,
  // SEND_WHATSAPP_ALL_REQUEST,
  // SEND_WHATSAPP_ALL_SUCCESS,
  // SEND_WHATSAPP_ALL_FAILURE,
} from "../actions/userActionTypes";

const initialState = {
  loading: false,
  error: null,

  otpResponse: null,
  verifyResponse: null,
  updateResponse: null,
  viewResponse: null,
  viewAllResponse: null,
  searchLogResponse: null,

  // whatsappResponse: null,
  // whatsappAllResponse: null,

};

export default function otpReducer(state = initialState, action) {
  switch (action.type) {
    // ====== REQUEST STATES ======
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
    case UPDATE_OTP_USER_REQUEST:
    case VIEW_OTP_USER_REQUEST:
    case VIEWALL_OTP_USER_REQUEST:
    case LOG_USER_SEARCH_REQUEST:
    // case SEND_WHATSAPP_REQUEST:
    // case SEND_WHATSAPP_ALL_REQUEST:
      return { ...state, loading: true, error: null };

    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, otpResponse: action.payload, error: null };

    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, verifyResponse: action.payload, error: null };

    case UPDATE_OTP_USER_SUCCESS:
      return { ...state, loading: false, updateResponse: action.payload, error: null };

    case VIEW_OTP_USER_SUCCESS:
      return { ...state, loading: false, viewResponse: action.payload, error: null };

    case VIEWALL_OTP_USER_SUCCESS:
      return { ...state, loading: false, viewAllResponse: action.payload, error: null };

    case LOG_USER_SEARCH_SUCCESS:
      return { ...state, loading: false, searchLogResponse: action.payload, error: null };

    // case SEND_WHATSAPP_SUCCESS:
    //   return { ...state, loading: false, whatsappResponse: action.payload, error: null };

    // case SEND_WHATSAPP_ALL_SUCCESS:
    //   return { ...state, loading: false, whatsappAllResponse: action.payload, error: null };

    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
    case UPDATE_OTP_USER_FAILURE:
    case VIEW_OTP_USER_FAILURE:
    case VIEWALL_OTP_USER_FAILURE:
    case LOG_USER_SEARCH_FAILURE:
    // case SEND_WHATSAPP_FAILURE:
    // case SEND_WHATSAPP_ALL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case USER_LOGOUT:
      return initialState;

    default:
      return state;
  }
}
