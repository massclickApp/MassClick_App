import {
  FETCH_BUSINESS_REQUEST, FETCH_BUSINESS_SUCCESS, FETCH_BUSINESS_FAILURE,
  CREATE_BUSINESS_REQUEST, CREATE_BUSINESS_SUCCESS, CREATE_BUSINESS_FAILURE,
  EDIT_BUSINESS_REQUEST, EDIT_BUSINESS_SUCCESS, EDIT_BUSINESS_FAILURE,
  DELETE_BUSINESS_REQUEST, DELETE_BUSINESS_SUCCESS, DELETE_BUSINESS_FAILURE,
  ACTIVE_BUSINESS_REQUEST, ACTIVE_BUSINESS_SUCCESS, ACTIVE_BUSINESS_FAILURE,
  FETCH_TRENDING_REQUEST, FETCH_TRENDING_SUCCESS, FETCH_TRENDING_FAILURE,
  FETCH_SEARCH_LOGS_REQUEST, FETCH_SEARCH_LOGS_SUCCESS, FETCH_SEARCH_LOGS_FAILURE,
  FETCH_VIEWBUSINESS_REQUEST, FETCH_VIEWBUSINESS_SUCCESS, FETCH_VIEWBUSINESS_FAILURE,
  SUGGESTION_BUSINESS_REQUEST, SUGGESTION_BUSINESS_SUCCESS, SUGGESTION_BUSINESS_FAILURE,
  SEARCH_BUSINESS_REQUEST, SEARCH_BUSINESS_SUCCESS, SEARCH_BUSINESS_FAILURE,
} from '../actions/userActionTypes';

const initialState = {
  businessList: [],
  total: 0,
  pageNo: 1,
  pageSize: 10,
  clientBusinessList: [],
  loading: false,
  error: null,

  trendingList: [],
  trendingLoading: false,
  trendingError: null,
  backendSuggestions: [],
  backendSearchResults: [],

  searchLogs: [],
  searchLogsLoading: false,
  searchLogsError: null,
};

export default function businessListReducer(state = initialState, action) {
  switch (action.type) {
    /** ------------------- BUSINESS ------------------- **/
    case FETCH_BUSINESS_REQUEST:
    case CREATE_BUSINESS_REQUEST:
    case EDIT_BUSINESS_REQUEST:
    case DELETE_BUSINESS_REQUEST:
    case ACTIVE_BUSINESS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        businessList: action.payload.data,
        total: action.payload.total,
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        error: null,
      };


    case CREATE_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        businessList: [...state.businessList, action.payload],
        error: null,
      };

    case EDIT_BUSINESS_SUCCESS:
    case ACTIVE_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        businessList: state.businessList.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
        error: null,
      };

    case DELETE_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        businessList: state.businessList.filter((b) => b._id !== action.payload),
        error: null,
      };

    case FETCH_BUSINESS_FAILURE:
    case CREATE_BUSINESS_FAILURE:
    case EDIT_BUSINESS_FAILURE:
    case DELETE_BUSINESS_FAILURE:
    case ACTIVE_BUSINESS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /** ------------------- CLIENT BUSINESS ------------------- **/
    case FETCH_VIEWBUSINESS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_VIEWBUSINESS_SUCCESS:
      return { ...state, loading: false, clientBusinessList: action.payload, error: null };

    case FETCH_VIEWBUSINESS_FAILURE:
      return { ...state, loading: false, clientBusinessList: [], error: action.payload };

    /** ------------------- TRENDING ------------------- **/
    case FETCH_TRENDING_REQUEST:
      return { ...state, trendingLoading: true, trendingError: null };

    case FETCH_TRENDING_SUCCESS:
      return {
        ...state,
        trendingLoading: false,
        trendingList: action.payload,
        trendingError: null,
      };

    case FETCH_TRENDING_FAILURE:
      return {
        ...state,
        trendingLoading: false,
        trendingList: [],
        trendingError: action.payload,
      };

    /** ------------------- SEARCH LOGS ------------------- **/
    case FETCH_SEARCH_LOGS_REQUEST:
      return { ...state, searchLogsLoading: true, searchLogsError: null };

    case FETCH_SEARCH_LOGS_SUCCESS:
      return {
        ...state,
        searchLogsLoading: false,
        searchLogs: action.payload,
        searchLogsError: null,
      };

    case FETCH_SEARCH_LOGS_FAILURE:
      return {
        ...state,
        searchLogsLoading: false,
        searchLogs: [],
        searchLogsError: action.payload,
      };
    case SUGGESTION_BUSINESS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SUGGESTION_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        backendSuggestions: action.payload,
      };

    case SUGGESTION_BUSINESS_FAILURE:
      return {
        ...state,
        loading: false,
        backendSuggestions: [],
      };

    case SEARCH_BUSINESS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_BUSINESS_SUCCESS:
      return {
        ...state,
        loading: false,
        backendSearchResults: action.payload,
      };

    case SEARCH_BUSINESS_FAILURE:
      return {
        ...state,
        loading: false,
        backendSearchResults: [],
      };


    /** ------------------- DEFAULT ------------------- **/
    default:
      return state;
  }
}
