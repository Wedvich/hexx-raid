import moment from 'moment';
import { List } from 'immutable';

import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  users: List([])
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.USERS_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.USERS_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: List(action.users)
      };

    case actionTypes.USERS_LOAD_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
}
