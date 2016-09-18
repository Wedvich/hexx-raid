import { call, take, select, put } from 'redux-saga/effects';
import moment from 'moment';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

function ssoAuthenticate(ssoToken) {
  return fetch('/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' },
    body: `sso_token=${encodeURIComponent(ssoToken)}`
  })
    .then(response => response.json())
    .then(
      token => ({ token }),
      error => ({ error: error.message || 'Something went wrong' })
    );
}

export default function* () {
  while (true) { // eslint-disable-line
    yield take(actionTypes.AUTH_SIGN_IN_REQUEST);
    const storedToken = window.sessionStorage.getItem('token');
    const parsedToken = JSON.parse(storedToken);
    if (parsedToken && moment(parsedToken.expiration) > moment()) {
      yield put(actions.signIn(parsedToken.accessToken, moment(parsedToken.expiration)));
    } else {
      window.sessionStorage.removeItem('token');
      try {
        const ssoToken = location.href.match(/sso_token=([^&]*)/)[1];
        const { token, error }  = yield call(ssoAuthenticate, ssoToken);
        if (token) {
          const expiration = moment().add(token.expires_in, 'seconds');
          window.sessionStorage.setItem('token', JSON.stringify({
            accessToken: token.access_token,
            expiration: expiration.toISOString()
          }));
          yield put(actions.signIn(token.access_token, expiration));
        } else {
          yield put(actions.signInFailure(error));
        }
      } catch (error) {
        console.log(error);
        yield put(actions.signInFailure(error));
      }
    }
    yield take(actionTypes.AUTH_SIGN_OUT);
  }
}
