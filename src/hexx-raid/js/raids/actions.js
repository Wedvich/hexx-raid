import * as actionTypes from './actionTypes';
import * as constants from './constants';

export function loadRequest() {
  return {
    type: actionTypes.RAIDS_LOAD_REQUEST
  };
}

export function loadSuccess(raids) {
  return {
    type: actionTypes.RAIDS_LOAD_SUCCESS,
    raids
  };
}

export function loadFailure() {
  return {
    type: actionTypes.RAIDS_LOAD_FAILURE
  };
}

export function updateSignupRequest(raidId, status, note) {
  return {
    type: actionTypes.RAID_UPDATE_SIGNUP_REQUEST,
    raidId,
    status,
    note: note || null
  };
}

export function updateSignupSuccess(raid) {
  return {
    type: actionTypes.RAID_UPDATE_SIGNUP_SUCCESS,
    raid
  };
}

export function updateSignupFailure(raidId) {
  return {
    type: actionTypes.RAID_UPDATE_SIGNUP_FAILURE
  };
}
