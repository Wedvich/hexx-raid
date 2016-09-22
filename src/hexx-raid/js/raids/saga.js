import { call, take, select, put, fork } from 'redux-saga/effects';
import moment from 'moment';

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import { actionTypes as authActionTypes } from '../auth';

function loadRaids(accessToken) {
  return fetch('/api/raids', { headers: { 'Authorization': `Bearer ${accessToken}` }})
    .then(response => response.json())
    .then(
      raids => ({ raids: raids.map(r => ({ ...r, startTime: moment(r.startTime), endTime: moment(r.endTime) })) }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function updateRaid(accessToken, raidId, status, note) {
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
      raid => ({ raid: { ...raid, startTime: moment(r.startTime), endTime: moment(r.endTime) }}),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function* updateRaidProcess(raidId, status, note) {
  const accessToken = yield select(state => state.auth.accessToken);
  const { raid, error }  = yield call(updateRaid, accessToken, raidId, status, note);
  if (raid) {
    yield put(actions.updateSignupSuccess(raid));
  } else {
    yield put(actions.updateSignupFailure(error));
  }
}

export default function* () {
  const { accessToken } = yield take(authActionTypes.AUTH_SIGN_IN_SUCCESS);
  yield put(actions.loadRequest());
  const { raids, error } = yield call(loadRaids, accessToken);
  if (raids) {
    yield put(actions.loadSuccess(raids));
  } else {
    yield put(actions.loadFailure(error));
  }
  while (true) { // eslint-disable-line
    const { raidId, status, note } = yield take(actionTypes.RAID_UPDATE_SIGNUP_REQUEST);
    yield fork(updateRaidProcess, raidId, status, note);
  }
}
