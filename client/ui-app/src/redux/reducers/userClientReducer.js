import {
  FETCH_USERSCLIENT_REQUEST, FETCH_USERSCLIENT_SUCCESS, FETCH_USERSCLIENT_FAILURE,
  CREATE_USERCLIENT_REQUEST, CREATE_USERCLIENT_SUCCESS, CREATE_USERCLIENT_FAILURE,
  EDIT_USERCLIENT_REQUEST, EDIT_USERCLIENT_SUCCESS, EDIT_USERCLIENT_FAILURE,
  DELETE_USERCLIENT_REQUEST, DELETE_USERCLIENT_SUCCESS, DELETE_USERCLIENT_FAILURE
} from "../actions/userActionTypes.js";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export default function userClientReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERSCLIENT_REQUEST:
    case CREATE_USERCLIENT_REQUEST:
    case EDIT_USERCLIENT_REQUEST:
    case DELETE_USERCLIENT_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_USERSCLIENT_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };

    case FETCH_USERSCLIENT_FAILURE:
    case CREATE_USERCLIENT_FAILURE:
    case EDIT_USERCLIENT_FAILURE:
    case DELETE_USERCLIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_USERCLIENT_SUCCESS:
      return { ...state, loading: false, users: [...state.users, action.payload], error: null };

    case EDIT_USERCLIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        error: null,
      };

    case DELETE_USERCLIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        error: null,
      };

    default:
      return state;
  }
}
