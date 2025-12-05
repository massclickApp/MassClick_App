import axios from "axios";
import {
  MATCH_LEADS_REQUEST,
  MATCH_LEADS_SUCCESS,
  MATCH_LEADS_FAILURE,
} from "./userActionTypes";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchMatchedLeads = (businessCategory) => async (dispatch) => {
  dispatch({ type: MATCH_LEADS_REQUEST });

  try {
    const response = await axios.post(`${API_URL}/match/leadspage`, {
      businessCategory,
    });

    dispatch({
      type: MATCH_LEADS_SUCCESS,
      payload: response.data.leads || [],
    });

  } catch (error) {
    dispatch({
      type: MATCH_LEADS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};
