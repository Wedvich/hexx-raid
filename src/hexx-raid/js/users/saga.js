import { call, take, select, put, fork } from 'redux-saga/effects';

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import { actionTypes as authActionTypes } from '../auth';

function loadUsers(accessToken) {
  return fetch('/api/users', { headers: { 'Authorization': `Bearer ${accessToken}` }})
    .then(response => response.json())
    .then(
      users => ({ users }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function* watchLoadUsers() {
  while (true) {
    yield take(actionTypes.USERS_LOAD_REQUEST);
    const accessToken = yield select(state => state.auth.accessToken);
    const { users, error } = yield call(loadUsers, accessToken);
    if (users) {
      yield put(actions.loadSuccess(users));
    } else {
      yield put(actions.loadFailure(error));
    }
  }
}

export default function* () {
  const { accessToken } = yield take(authActionTypes.AUTH_SIGN_IN_SUCCESS);
  yield put(actions.loadRequest());
  const { users, error } = yield call(loadUsers, accessToken);
  if (users) {
    yield put(actions.loadSuccess(users));
  } else {
    yield put(actions.loadFailure(error));
  }

  yield fork(watchLoadUsers);
}
