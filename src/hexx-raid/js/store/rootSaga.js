import { fork, select } from 'redux-saga/effects';
import { saga as authSaga } from '../auth';
import { saga as raidSaga } from '../raids';

export default function* () {
  yield [
    fork(authSaga),
    fork(raidSaga)
  ];
}