import moment from 'moment';
import * as actionTypes from './actionTypes';

export function sso() {
  return {
    type: actionTypes.AUTH_SIGN_IN_REQUEST,
    sso: true
  };
}

export function signIn(accessToken, expiration) {
  return {
    type: actionTypes.AUTH_SIGN_IN_SUCCESS,
    accessToken,
    expiration
  };
}

export function signInFailure() {
  return {
    type: actionTypes.AUTH_SIGN_IN_FAILURE
  };
}

export function signOut() {
  return {
    type: actionTypes.AUTH_SIGN_OUT
  };
}
