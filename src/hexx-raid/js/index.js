import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Root from './root';
import configureStore from './store';

import { actions as authActions } from './auth';
import { IS_IN_IFRAME } from './utils';

const storeAndHistory = configureStore();

const { store } = storeAndHistory;
store.dispatch(authActions.sso());

const appContainerElement = document.getElementById('app-container');

if (IS_IN_IFRAME) {
  document.body.className = 'auto-expand';
  let lastHeight = 0;
  setInterval(() => {
    if (appContainerElement.clientHeight !== lastHeight) {
      lastHeight = appContainerElement.clientHeight;
      window.parent.postMessage({ message: 'SET_IFRAME_HEIGHT', height: lastHeight }, '*');
    }
  }, 300);
}



ReactDOM.render(
  <Root {...storeAndHistory} />,
  appContainerElement
);
