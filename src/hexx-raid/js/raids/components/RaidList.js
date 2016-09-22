import React, { Component } from 'react';
import { connect } from 'react-redux';
import Raid from './Raid';
import { Loader } from '../../utils';
import * as actions from '../actions';

class RaidList extends Component {
  render() {
    const { isLoading, updateSignup, userId } = this.props;

    let i = 0;
    return <section id="raids" className="page">
      {isLoading && <div className="loader-container"><Loader /></div>}
      {!isLoading && this.props.raids.map(r => <Raid key={i++} updateSignup={updateSignup} userId={userId} {...r} />)}
    </section>;
  }
}

const mapStateToProps = state => ({
  raids: state.raids.raids,
  isLoading: state.raids.isLoading,
  userId: state.auth.userId
});

const mapDispatchToProps = {
  updateSignup: actions.updateSignupRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaidList);
