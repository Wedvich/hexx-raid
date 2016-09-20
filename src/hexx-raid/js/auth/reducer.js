import moment from 'moment';
import * as actionTypes from './actionTypes';

const initialState = {
  accessToken: null,
  expiration: null,
  permissions: null,
  userId: null,
  isSigningIn: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.AUTH_SIGN_IN_REQUEST:
      return {
        ...state,
        isSigningIn: true
      };

    case actionTypes.AUTH_SIGN_IN_SUCCESS: {
      const payload = JSON.parse(atob(action.accessToken.split('.')[1]));
      return {
        ...state,
        accessToken: action.accessToken,
        expiration: action.expiration,
        permissions: payload.permissions || [],
        userId: parseInt(payload.sub),
        isSigningIn: false
      };
    }

    case actionTypes.AUTH_SIGN_IN_FAILURE:
      return {
        ...state,
        accessToken: null,
        expiration: null,
        permissions: null,
        userId: null,
        isSigningIn: false
      };

    default:
      return state;
  }
}
