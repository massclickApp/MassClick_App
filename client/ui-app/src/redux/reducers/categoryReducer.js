import {
  FETCH_CATEGORY_REQUEST, FETCH_CATEGORY_SUCCESS, FETCH_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE,
  EDIT_CATEGORY_REQUEST, EDIT_CATEGORY_SUCCESS, EDIT_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAILURE
} from '../actions/userActionTypes';

const initialState = {
  category: [],
  loading: false,
  error: null,
};

export default function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORY_REQUEST:
    case CREATE_CATEGORY_REQUEST:
    case EDIT_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CATEGORY_SUCCESS:
      return { ...state, loading: false, category: action.payload, error: null };

    case CREATE_CATEGORY_SUCCESS:
      return { ...state, loading: false, category: [...state.category, action.payload], error: null };

    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        category: state.category.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        ),
        error: null,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        category: state.category.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        ), error: null,
      };

    case FETCH_CATEGORY_FAILURE:
    case CREATE_CATEGORY_FAILURE:
    case EDIT_CATEGORY_FAILURE:
    case DELETE_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
