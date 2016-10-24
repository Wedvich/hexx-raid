import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { constants as utilConstants, Loader } from '../../utils';
import * as actions from '../actions';

class RaidEditor extends Component {

  update() {
    const updatedRaid = {
      ...this.props.raid,
      raidZone: this.refs.raidZone.value,
      plan: this.refs.plan.value
    };

    this.props.updateRequest(updatedRaid);
  }

  render() {
    const { raid, navigate } = this.props;

    return <div className="raid editor">
      <h1>Managing raid</h1>
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <td colSpan="2"><time className="raid-date" dateTime={raid.startTime.toISOString()}>{raid.startTime.format(utilConstants.DATE_FORMAT)}</time></td>
          </tr>
          <tr>
            <th>Zone</th>
            <td>
              <select ref="raidZone" defaultValue={raid.raidZone}>
                <option value="8026">The Emerald Dream</option>
                <option value="8440">Trial of Valor</option>
                <option value="8025">The Nighthold</option>
              </select>
            </td>
            <td width="100%"></td>
          </tr>
          <tr>
            <th>Plan</th>
            <td colSpan="2">
              <textarea ref="plan" defaultValue={raid.plan}></textarea>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="button-group">
        {!raid.isUpdating && <div className="button-wrapper">
          <button className="coming" onClick={() => this.update()}>Save changes</button>
        </div>}
        {!raid.isUpdating && <div className="button-wrapper">
          <button className="maybe" onClick={() => navigate('/raids')}>Cancel</button>
        </div>}
        {raid.isUpdating && <Loader />}
      </div>
    </div>;
  }
}

const mapStateToProps = (state, props) => ({
  raid: state.raids.raids.find(r => r.raidId === props.params.raidId)
});

const mapDispatchToProps = {
  navigate: push,
  updateRequest: actions.updateRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaidEditor);
