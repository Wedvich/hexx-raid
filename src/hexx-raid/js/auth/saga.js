import { call, take, select, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import moment from 'moment';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

function ssoAuthenticate(ssoToken) {
  return fetch('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `sso_token=${encodeURIComponent(ssoToken)}`
  })
    .then(response => response.json())
    .then(
      token => ({ token }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

function usernamePasswordAuthenticate(username, password) {
  return fetch('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
    .then(response => response.json())
    .then(
      token => ({ token }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

export default function* () {
  while (true) { // eslint-disable-line
    const { sso, username, password } = yield take(actionTypes.AUTH_SIGN_IN_REQUEST);
    const storedToken = window.sessionStorage.getItem('token');
    const parsedToken = JSON.parse(storedToken);
    if (parsedToken && moment(parsedToken.expiration) > moment()) {
      yield put(actions.signIn(parsedToken.accessToken, null, moment(parsedToken.expiration)));
    } else {
      window.sessionStorage.removeItem('token');
      try {
        let method;
        if (sso) {
          const ssoToken = location.href.match(/sso_token=([^&]*)/)[1];
          method = call(ssoAuthenticate, ssoToken);
        } else {
          method = call(usernamePasswordAuthenticate, username, password);
        }
        const { token, error } = yield method;
        if (token) {
          const expiration = moment().add(token.expires_in, 'seconds');
          window.sessionStorage.setItem('token', JSON.stringify({
            accessToken: token.access_token,
            expiration: expiration.toISOString()
          }));
          yield put(actions.signIn(token.access_token, null, expiration));
          if (!sso) {
            yield put(push('/raids'));
          }
          yield take(actionTypes.AUTH_SIGN_OUT);
        } else {
          console.error(error);
          yield put(actions.signInFailure(error));
          yield put(push('/signin'));
        }
      } catch (error) {
        console.error(error);
        yield put(actions.signInFailure(error));
        yield put(push('/signin'));
      }
    }
  }
}
