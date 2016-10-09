import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { constants as utilConstants } from '../../utils';

class RaidEditor extends Component {
  render() {
    const { raid, push } = this.props;

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
              <select>
                <option value="8026">The Emerald Dream</option>
                <option value="8025">The Nighthold</option>
              </select>
            </td>
            <td width="100%"></td>
          </tr>
          <tr>
            <th>Plan</th>
            <td colSpan="2"><textarea></textarea></td>
          </tr>
        </tbody>
      </table>
      <div className="button-group">
        <div className="button-wrapper">
          <button className="coming">Save changes</button>
        </div>
        <div className="button-wrapper">
          <button className="maybe" onClick={() => push('/raids')}>Cancel</button>
        </div>
      </div>
    </div>;
  }
}

const mapStateToProps = (state, props) => ({
  raid: state.raids.raids.find(r => r.raidId === props.params.raidId)
});

const mapDispatchToProps = {
  push: push
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaidEditor);
