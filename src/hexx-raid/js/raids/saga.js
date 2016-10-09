import { call, take, select, put, fork } from 'redux-saga/effects';
import moment from 'moment';

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import { actionTypes as authActionTypes } from '../auth';

function loadRaids(accessToken, forNextWeek) {
  return fetch(`/api/raids${forNextWeek ? '/next' : ''}`, { headers: { 'Authorization': `Bearer ${accessToken}` }})
    .then(response => response.json())
    .then(
      raids => ({ raids: raids.map(r => ({ ...r, startTime: moment(r.startTime), endTime: moment(r.endTime) })) }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function updateRaidSignup(accessToken, raidId, status, note) {
  return fetch(`/api/raids/${raidId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status,
      note
    })
  })
    .then(response => response.json())
    .then(
      raid => ({ raid: { ...raid, startTime: moment(raid.startTime), endTime: moment(raid.endTime) }}),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function* watchLoadRaids() {
  while (true) { // eslint-disable-line
    const { forNextWeek } = yield take(actionTypes.RAIDS_LOAD_REQUEST);
    const accessToken = yield select(state => state.auth.accessToken);
    const { raids, error } = yield call(loadRaids, accessToken, forNextWeek);
    if (raids) {
      yield put(actions.loadSuccess(raids, forNextWeek));
    } else {
      yield put(actions.loadFailure(error));
    }
  }
}

function* watchupdateRaidSignup() {
  while (true) { // eslint-disable-line
    const { raidId, status, note } = yield take(actionTypes.RAID_UPDATE_SIGNUP_REQUEST);
    const accessToken = yield select(state => state.auth.accessToken);
    const { raid, error }  = yield call(updateRaidSignup, accessToken, raidId, status, note);
    if (raid) {
      yield put(actions.updateSignupSuccess(raid));
    } else {
      yield put(actions.updateSignupFailure(error));
    }
  }
}

export default function* () {
  yield take(authActionTypes.AUTH_SIGN_IN_SUCCESS);
  yield [
    fork(watchLoadRaids),
    fork(watchupdateRaidSignup)
  ];
  yield put(actions.loadRequest(false));
}
