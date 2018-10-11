import {
    SET_AUTH_TOKEN,
    CLEAR_AUTH,
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_ERROR,
    // FIXME: remove
    SET_TIMESTAMP,
    SHOW_LOGOUT_WARNING
} from '../actions/auth';

const initialState = {
  authToken: null, // authToken !== null does not mean it has been validated
  currentUser: null,
  loading: false,
  error: null,
  showedLogoutWarning: false
};

export default function reducer(state = initialState, action) {
    if (action.type === SET_AUTH_TOKEN) {
        return Object.assign({}, state, {
            authToken: action.authToken
        });
    } else if (action.type === CLEAR_AUTH) {
        return Object.assign({}, state, {
            authToken: null,
            currentUser: null
        });
    } else if (action.type === AUTH_REQUEST) {
        return Object.assign({}, state, {
            loading: true,
            error: null
        });
    } else if (action.type === AUTH_SUCCESS) {
        return Object.assign({}, state, {
            loading: false,
            currentUser: action.currentUser
        });
    } else if (action.type === AUTH_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            error: action.error
        });
    } else if (action.type === SET_TIMESTAMP) {
      return Object.assign({}, state, {
        time: action.time
      });
    } else if(action.type === SHOW_LOGOUT_WARNING) {
      return {
        ...state,
        showLogoutWarning: action.showLogoutWarning
      };
    }
    return state;
}

