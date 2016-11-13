import * as actionTypes from './actionTypes';

export function loadRequest() {
  return {
    type: actionTypes.USERS_LOAD_REQUEST
  };
}

export function loadSuccess(users) {
  return {
    type: actionTypes.USERS_LOAD_SUCCESS,
    users
  };
}

export function loadFailure() {
  return {
    type: actionTypes.USERS_LOAD_FAILURE
  };
}
