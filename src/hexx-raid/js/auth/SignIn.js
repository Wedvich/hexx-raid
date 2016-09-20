import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Loader } from '../utils';

class SignIn extends Component {
  signIn(e) {
    e.preventDefault();
    const username = this.usernameField.value;
    const password = this.passwordField.value;

    this.props.manualSignIn(username, password);
  }

  render() {
    const { isSigningIn } = this.props;

    return <form id="sign-in" className="page" onSubmit={this.signIn.bind(this)}>
      {!isSigningIn && <span className="authentication-failed">Authentication failed.</span>}
      {isSigningIn && <Loader />}
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" disabled={isSigningIn}
             ref={ref => this.usernameField = ref} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" disabled={isSigningIn}
             ref={ref => this.passwordField = ref} />
      <div className="button-group">
        <button className="coming" disabled={isSigningIn}>Sign In</button>
      </div>
    </form>;
  }
}

const mapStateToProps = state => ({
  isSigningIn: state.auth.isSigningIn
});

const mapDispatchToProps = {
  manualSignIn: actions.manual
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
