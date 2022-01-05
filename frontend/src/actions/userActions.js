import axios from "axios";
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    REGISTER_REQUEST,
} from "./types";

export const registerAction =
    (username, email, password) => async (dispatch) => {
        //inizia la richiesta di registrazione
        dispatch({ type: REGISTER_REQUEST, payload: {} });

        try {
            const { data } = await axios.post("/api/auth/register", {
                username,
                email,
                password,
            });

            dispatch({
                type: REGISTER_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data.error,
            });
        }
    };

export const loginAction = (email, password) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST, payload: {} });

    try {
        const { data } = await axios.post("/api/auth/login", {
            email,
            password,
        });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.error,
        });
    }
};
