import axios from 'axios';
import qs from 'qs';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const RELOGIN_REQUEST = "RELOGIN_REQUEST";
export const RELOGIN_SUCCESS = "RELOGIN_SUCCESS";
export const RELOGIN_FAILURE = "RELOGIN_FAILURE";

export const CLIENT_LOGIN_REQUEST = 'CLIENT_LOGIN_REQUEST';
export const CLIENT_LOGIN_SUCCESS = 'CLIENT_LOGIN_SUCCESS';
export const CLIENT_LOGIN_FAILURE = 'CLIENT_LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';

const API_URL = process.env.REACT_APP_API_URL;
const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_OAUTH_CLIENT_SECRET;




export const clientLogin = () => async (dispatch) => {
  dispatch({ type: CLIENT_LOGIN_REQUEST });

  try {
    const response = await axios.post(`${API_URL}/oauth/client`, {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    dispatch({
      type: CLIENT_LOGIN_SUCCESS,
      payload: { accessToken, refreshToken, user },
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CLIENT_LOGIN_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

export const login = (userName, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const data = qs.stringify({
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: userName, 
      password, 
    });

    const response = await axios.post(`${API_URL}/oauth/login`, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const relogin = () => async (dispatch) => {
  dispatch({ type: RELOGIN_REQUEST });
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    const data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    });

    const response = await axios.post(`${API_URL}/oauth/relogin`, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { accessToken, accessTokenExpiresAt, refreshToken: newRefreshToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);

    dispatch({
      type: RELOGIN_SUCCESS,
      payload: { accessToken, refreshToken: newRefreshToken, user },
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: RELOGIN_FAILURE,
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};


// Logout
// authActions.js
// authActions.js
export const logout = () => async (dispatch) => {
  const token = localStorage.getItem("accessToken");

  try {
    if (token) {
      const url = `${API_URL}/oauth/logout`; 
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.clear();
    dispatch({ type: LOGOUT });
  }
};




