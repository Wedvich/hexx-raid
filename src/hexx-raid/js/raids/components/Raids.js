import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Raid from './Raid';
import { Loader } from '../../utils';
import * as actions from '../actions';

class Raids extends Component {

  loadNextWeek() {
    this.props.load(true);
  }

  render() {
    if (this.props.children) {
      return <section id="raids" className="page">
        {this.props.children}
      </section>;
    }

    const { isLoading, hasLoadedNextWeek, updateSignup, userId, navigate } = this.props;

    let i = 0;
    return <section id="raids" className="page">
      {this.props.raids.map(r => <Raid key={i++} updateSignup={updateSignup} userId={userId} navigate={navigate} {...r} />)}
      {isLoading && <div className="loader-container"><Loader /></div>}
      {!hasLoadedNextWeek && !isLoading && <div className="button-group footer">
        <div className="button-wrapper">
          <button className="maybe" onClick={this.loadNextWeek.bind(this)}>{`Load next week's raids`}</button>
        </div>
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
  load: actions.loadRequest,
  navigate: push
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Raids);
