import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import DevTools from '../root/DevTools';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  DevTools.instrument(),
  persistState(window.location.href.match(/[?&]debug_session=([^&#]+)\b/))
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  if (module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(require('./rootReducer').default));
  }
  const history = syncHistoryWithStore(browserHistory, store);
  sagaMiddleware.run(rootSaga);
  return {
    store,
    history
  };
}
