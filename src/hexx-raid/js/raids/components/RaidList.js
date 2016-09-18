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
      <div className="announcement">
        <span className="icon"></span>
        {`Hi everyone, and welcome to the new (and hopefully improved) raid calendar! It's fresh out of the oven and some features are still missing, but more will be added over time. Contact management if you run into any problems, or if you have questions, suggestions or bugs you'd like to report. Happy raiding!`}
      </div>
      {isLoading && <div className="loader-container"><Loader /></div>}
      {!isLoading && this.props.raids.map(r => <Raid key={i++} updateSignup={updateSignup} userId={userId} {...r} />)}
    </section>;
  }
}

const mapStateToProps = state => {
  return {
    raids: state.raids.raids,
    isLoading: state.raids.isLoading,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = {
  updateSignup: actions.updateSignupRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaidList);
