import * as actionTypes from './actionTypes';

export function loadRequest() {
  return {
    type: actionTypes.CHARACTERS_LOAD_REQUEST
  };
}

export function loadSuccess(characters) {
  return {
    type: actionTypes.CHARACTERS_LOAD_SUCCESS,
    characters
  };
}

export function loadFailure() {
  return {
    type: actionTypes.CHARACTERS_LOAD_FAILURE
  };
}

export function refreshAuditRequest() {
  return {
    type: actionTypes.AUDIT_REFRESH_REQUEST
  };
}

export function refreshAuditSuccess() {
  return {
    type: actionTypes.AUDIT_REFRESH_SUCCESS
  };
}

export function refreshAuditFailure() {
  return {
    type: actionTypes.AUDIT_REFRESH_FAILURE
  };
}
