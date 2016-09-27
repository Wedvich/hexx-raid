import React, { Component } from 'react';
import { connect } from 'react-redux';
import Raid from './Raid';
import { Loader } from '../../utils';
import * as actions from '../actions';

class RaidList extends Component {

  loadNextWeek() {
    this.props.load(true);
  }

  render() {
    const { isLoading, hasLoadedNextWeek, updateSignup, userId } = this.props;

    let i = 0;
    return <section id="raids" className="page">
      {this.props.raids.map(r => <Raid key={i++} updateSignup={updateSignup} userId={userId} {...r} />)}
      {isLoading && <div className="loader-container"><Loader /></div>}
      {!hasLoadedNextWeek && !isLoading && <div className="button-group footer">
        <button className="maybe" onClick={this.loadNextWeek.bind(this)}>{`Load next week's raids`}</button>
      </div>}
    </section>;
  }
}

const mapStateToProps = state => ({
  raids: state.raids.raids,
  isLoading: state.raids.isLoading,
  hasLoadedNextWeek: state.raids.hasLoadedNextWeek,
  userId: state.auth.userId
});

const mapDispatchToProps = {
  updateSignup: actions.updateSignupRequest,
  load: actions.loadRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaidList);
