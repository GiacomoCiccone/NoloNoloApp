//qui vanno messi i reducers
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userPreferencesReducer from './userPreferencesReducer'

export default combineReducers({
    user: userReducer,
    userPreferences: userPreferencesReducer
});