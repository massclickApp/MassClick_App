import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';
import userClientReducer from './reducers/userClientReducer'
import locationReducer from './reducers/locationReducer.js'
import categoryReducer from './reducers/categoryReducer.js'
import businessListReducer from './reducers/businessListReducer.js'
import rolesReducer from './reducers/rolesReducer.js';
import enquiryReducer from './reducers/enquiryReducer.js';
import startProjectReducer from './reducers/startProjectReducer.js'
import otpReducer from './reducers/otpReducer.js'
import clientReducer from './reducers/clientAuthReducer.js'
import phonepeReducer from './reducers/phonePayReducer.js';

const rootReducer = combineReducers({
  auth: authReducer,
  userReducer: userReducer,
  userClientReducer: userClientReducer,
  locationReducer: locationReducer,
  categoryReducer: categoryReducer,
  businessListReducer: businessListReducer,
  rolesReducer: rolesReducer,
  enquiryReducer: enquiryReducer,
  startProjectReducer: startProjectReducer,
  otp: otpReducer,
  clientReducer: clientReducer,
  phonepe : phonepeReducer  
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
