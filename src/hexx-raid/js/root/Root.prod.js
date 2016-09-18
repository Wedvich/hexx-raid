import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import App from '../app';

export default class Root extends Component {
  render() {
    return <Provider store={this.props.store}>
      <Router history={this.props.history} routes={routes} />
    </Provider>;
  }
}
