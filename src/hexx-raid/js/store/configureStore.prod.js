import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
  const history = syncHistoryWithStore(browserHistory, store);
  sagaMiddleware.run(rootSaga);
  return {
    store,
    history
  };
}
