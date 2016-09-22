import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { IS_IN_IFRAME } from '../utils';
import { permissions } from '../auth';

class App extends Component {
  hasPermission(permission) {
    return permissions.hasPermission(this.props.permissions, permission);
  }

  getChildContext() {
    return {
      hasPermission: this.hasPermission.bind(this)
    };
  }

  render() {
    return <div id="app">
      <nav>
        <span><Link to="/raids" activeClassName="active">Raids</Link></span>
        {this.hasPermission(permissions.AUTH_PERMISSION_AUDIT_VIEW) && <span><Link to="/audit" activeClassName="active">Audit</Link></span>}
      </nav>
      {IS_IN_IFRAME && <div className="announcement mobile-only">
        <span className="button-group">
          <button className="coming" onClick={() => window.open('/', 'hexx-raid-planner')}>
            Open mobile-friendly view
          </button>
        </span>
      </div>}
      {this.props.children}
    </div>;
  }
}

App.childContextTypes = {
  hasPermission: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  permissions: state.auth.permissions
});

export default connect(mapStateToProps, {})(App);
