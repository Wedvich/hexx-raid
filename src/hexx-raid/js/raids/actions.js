import * as actionTypes from './actionTypes';
import * as constants from './constants';

export function loadRequest(forNextWeek) {
  return {
    type: actionTypes.RAIDS_LOAD_REQUEST,
    forNextWeek
  };
}

export function loadSuccess(raids, forNextWeek) {
  return {
    type: actionTypes.RAIDS_LOAD_SUCCESS,
    raids,
    forNextWeek
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

export function updateRequest(raid) {
  return {
    type: actionTypes.RAID_UPDATE_REQUEST,
    raid
  };
}

export function updateSuccess(raid) {
  return {
    type: actionTypes.RAID_UPDATE_SUCCESS,
    raid
  };
}

export function updateFailure(raidId) {
  return {
    type: actionTypes.RAID_UPDATE_FAILURE
  };
}
