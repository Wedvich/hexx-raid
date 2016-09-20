import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import DevTools from './DevTools';
import routes from './routes';

export default class Root extends Component {
  render() {
    return <Provider store={this.props.store}>
      <div id="devtools-wrapper">
        <Router history={this.props.history} routes={routes} />
        <DevTools />
      </div>
    </Provider>;
  }
}
