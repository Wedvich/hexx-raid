import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import DevTools from './DevTools';
import routes from './routes';

export default class Root extends Component {
  getChildContext() {
    return {
      appInsights: this.props.appInsights
    };
  }

  render() {
    return <Provider store={this.props.store}>
      <div id="devtools-wrapper">
        <Router history={this.props.history} routes={routes} />
        <DevTools />
      </div>
    </Provider>;
  }
}

Root.childContextTypes = {
  appInsights: PropTypes.object
};

Root.propTypes = {
  appInsights: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
