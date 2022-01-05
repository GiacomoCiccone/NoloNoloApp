import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    REGISTER_REQUEST,
    RESET_ERROR_USER
  } from "../actions/types";
  
  const initalState = {
    authToken: null,
    isLoading: null,
    userInfo: null,
    error: null,
  };
  
  export default function userReducer(state = initalState, action) {
    switch (action.type) {
      case RESET_ERROR_USER:
        return {
          ...state,
          error: null,
          loading: null,
        };
      case LOGIN_REQUEST:
      case REGISTER_REQUEST:
        return {
          ...state,
          authToken: null,
          userInfo: null,
          isLoading: true,
          error: null,
        };
      case LOGIN_SUCCESS:
      case REGISTER_SUCCESS:
        return {
          ...state,
          authToken: action.payload.authToken,
          userInfo: action.payload.userInfo,
          isLoading: false,
          error: null,
        };
      case LOGOUT_SUCCESS:
        return {
          ...state,
          authToken: null,
          userInfo: null,
          isLoading: false,
        };
      case LOGIN_FAIL:
      case REGISTER_FAIL:
        return {
          ...state,
          authToken: null,
          userInfo: null,
          isLoading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  }