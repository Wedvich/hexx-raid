import { call, take, select, put, fork } from 'redux-saga/effects';

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import { actionTypes as authActionTypes } from '../auth';

function loadCharacters(accessToken) {
  return fetch('/api/characters', { headers: { 'Authorization': `Bearer ${accessToken}` }})
    .then(response => response.json())
    .then(
      characters => ({ characters }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function refreshAudit(accessToken) {
  return fetch('/api/characters/audit', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
    .then(
      response => ({ ok: response.ok }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function* watchRefreshAudit() {
  while (true) {
    yield take(actionTypes.AUDIT_REFRESH_REQUEST);
    const accessToken = yield select(state => state.auth.accessToken);
    const { ok, error } = yield call(refreshAudit, accessToken);
    if (ok) {
      yield put(actions.refreshAuditSuccess());
      yield put(actions.loadRequest());
    } else {
      yield put(actions.refreshAuditFailure(error));
    }
  }
}

function* watchLoadCharacters() {
  while (true) {
    yield take(actionTypes.CHARACTERS_LOAD_REQUEST);
    const accessToken = yield select(state => state.auth.accessToken);
    const { characters, error } = yield call(loadCharacters, accessToken);
    if (characters) {
      yield put(actions.loadSuccess(characters));
    } else {
      yield put(actions.loadFailure(error));
    }
  }
}

export default function* () {
  const { accessToken } = yield take(authActionTypes.AUTH_SIGN_IN_SUCCESS);
  yield put(actions.loadRequest());
  const { characters, error } = yield call(loadCharacters, accessToken);
  if (characters) {
    yield put(actions.loadSuccess(characters));
  } else {
    yield put(actions.loadFailure(error));
  }

  yield [
    fork(watchRefreshAudit),
    fork(watchLoadCharacters)
  ];
}
