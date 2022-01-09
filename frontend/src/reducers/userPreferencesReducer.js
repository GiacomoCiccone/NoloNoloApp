import {
    CHANGE_THEME
} from "../actions/types";

const initalState = {
    theme: "light"
};

export default function userPreferencesReducer(state = initalState, action) {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                ...state,
                theme: state.theme === "light" ? "dark" : "light"
            }
        default:
            return state;
    }
}
