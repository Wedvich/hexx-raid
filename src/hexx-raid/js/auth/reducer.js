import moment from 'moment';
import * as actionTypes from './actionTypes';

const initialState = {
  accessToken: null,
  expiration: null,
  userId: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        expiration: action.expiration,
        userId: parseInt(JSON.parse(atob(action.accessToken.split('.')[1])).sub)
      };

    case actionTypes.AUTH_SIGN_IN_FAILURE:
      return {
        ...state,
        accessToken: null,
        expiration: null,
        userId: null
      };

    default:
      return state;
  }
}
