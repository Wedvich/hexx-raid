import moment from 'moment';
import * as actionTypes from './actionTypes';

export function sso() {
  return {
    type: actionTypes.AUTH_SIGN_IN_REQUEST,
    sso: true
  };
}

export function manual(username, password) {
  return {
    type: actionTypes.AUTH_SIGN_IN_REQUEST,
    username,
    password,
    sso: false
  };
}

export function signIn(accessToken, refreshToken, expiration) {
  return {
    type: actionTypes.AUTH_SIGN_IN_SUCCESS,
    accessToken,
    refreshToken,
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
