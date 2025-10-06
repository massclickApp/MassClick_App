import {
  FETCH_LOCATION_REQUEST, FETCH_LOCATION_SUCCESS, FETCH_LOCATION_FAILURE,
  CREATE_LOCATION_REQUEST, CREATE_LOCATION_SUCCESS, CREATE_LOCATION_FAILURE,
  EDIT_LOCATION_REQUEST, EDIT_LOCATION_SUCCESS, EDIT_LOCATION_FAILURE,
  DELETE_LOCATION_REQUEST, DELETE_LOCATION_SUCCESS, DELETE_LOCATION_FAILURE
} from '../actions/userActionTypes';

const initialState = {
  location: [],
  loading: false,
  error: null,
};

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    // Request states
    case FETCH_LOCATION_REQUEST:
    case CREATE_LOCATION_REQUEST:
    case EDIT_LOCATION_REQUEST:
    case DELETE_LOCATION_REQUEST:
      return { ...state, loading: true, error: null };

    // Success states
    case FETCH_LOCATION_SUCCESS:
      return { ...state, loading: false, location: action.payload, error: null };

    case CREATE_LOCATION_SUCCESS:
      return { ...state, loading: false, location: [...state.location, action.payload], error: null };

    case EDIT_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        location: state.location.map((loc) =>
          loc._id === action.payload._id ? action.payload : loc
        ),
        error: null,
      };

    case DELETE_LOCATION_SUCCESS:
  return {
    ...state,
    loading: false,
    location: state.location.map((loc) =>
      loc._id === action.payload._id ? action.payload : loc
    ),
    error: null,
  };


    // Failure states
    case FETCH_LOCATION_FAILURE:
    case CREATE_LOCATION_FAILURE:
    case EDIT_LOCATION_FAILURE:
    case DELETE_LOCATION_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
