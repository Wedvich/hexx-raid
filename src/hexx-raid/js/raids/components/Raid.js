import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { constants as utilConstants, specToRole } from '../../utils';
import * as constants from '../constants';
import { raidZoneIdToName } from '../utils';
import RaidSignup from './RaidSignup';
import RaidMetadata from './RaidMetadata';
import { permissions } from '../../auth';

function sortSignups(a, b) {
  if (a.status > b.status) {
    return 1;
  } else if (a.status < b.status) {
    return -1;
  }

  if (a.character.name > b.character.name) {
    return 1;
  } else if (a.character.name < b.character.name) {
    return -1;
  } else {
    return 0;
  }
}

export default class Raid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSettingNote: false,
      noteText: ''
    };
  }

  beginSettingNote() {
    const userSignup = this.props.signups.find(s => s.character.userId === this.props.userId);
    if (!userSignup) {
      return;
    }
    this.setState({
      ...this.state,
      noteText: userSignup.note ? userSignup.note.text : '',
      isSettingNote: true
    });
    setTimeout(() => this.refs.note.focus(), 0);
  }

  endSettingNote(commit) {
    if (commit) {
      const userSignup = this.props.signups.find(s => s.character.userId === this.props.userId);
      if (userSignup) {
        this.props.updateSignup(this.props.raidId, userSignup.status, this.refs.note.value ? this.refs.note.value : undefined);
      }
    }

    this.setState({
      ...this.state,
      isSettingNote: false,
      noteText: this.refs.note.value
    });
  }

  render() {
    const signUpAsComing = () => this.props.updateSignup(this.props.raidId, constants.RAID_SIGNUP_STATUS_COMING, this.state.noteText ? this.state.noteText : undefined);
    const signUpAsMaybe = () => this.props.updateSignup(this.props.raidId, constants.RAID_SIGNUP_STATUS_MAYBE, this.state.noteText ? this.state.noteText : undefined);
    const signUpAsNotComing = () => this.props.updateSignup(this.props.raidId, constants.RAID_SIGNUP_STATUS_NOT_COMING, this.state.noteText ? this.state.noteText : undefined);

    const userSignup = this.props.signups.find(s => s.character.userId === this.props.userId);

    const tanks = [];
    const healers = [];
    const melee = [];
    const ranged = [];

    this.props.signups.forEach(s => {
      const role = specToRole(s.character.primarySpec, s.character.class);
      switch (role) {
        case utilConstants.CHARACTER_ROLE_TANK:
          tanks.push(s);
          break;

        case utilConstants.CHARACTER_ROLE_HEALER:
          healers.push(s);
          break;

        case utilConstants.CHARACTER_ROLE_MELEE:
          melee.push(s);
          break;

        case utilConstants.CHARACTER_ROLE_RANGED:
          ranged.push(s);
          break;

        default:
          return;
      }
    });

    const tanksComing = tanks.filter(s => s.status === 0).length;
    const tanksMaybe = tanks.filter(s => s.status === 1).length;
    const healersComing = healers.filter(s => s.status === 0).length;
    const healersMaybe = healers.filter(s => s.status === 1).length;
    const meleeComing = melee.filter(s => s.status === 0).length;
    const meleeMaybe = melee.filter(s => s.status === 1).length;
    const rangedComing = ranged.filter(s => s.status === 0).length;
    const rangedMaybe = ranged.filter(s => s.status === 1).length;

    let userSignupChoices = null;
    let userNote = null;
    if (userSignup) {
      let userStatus, change1, change2;
      if (userSignup.status === 0) {
        userStatus = 'coming';
        change1 = <a href="javascript:void(0)" className="maybe" onClick={signUpAsMaybe}>maybe</a>;
        change2 = <a href="javascript:void(0)" className="not-coming" onClick={signUpAsNotComing}>not coming</a>;
      } else if (userSignup.status === 1) {
        userStatus = 'maybe';
        change1 = <a href="javascript:void(0)" className="coming" onClick={signUpAsComing}>coming</a>;
        change2 = <a href="javascript:void(0)" className="not-coming" onClick={signUpAsNotComing}>not coming</a>;
      } else {
        userStatus = 'not coming';
        change1 = <a href="javascript:void(0)" className="coming" onClick={signUpAsComing}>coming</a>;
        change2 = <a href="javascript:void(0)" className="maybe" onClick={signUpAsMaybe}>maybe</a>;
      }

      userSignupChoices = <span className="link-group">
        {`You've already signed up as ${userStatus}${this.props.isBusy ? '.' : ''}`}
        {!this.props.isBusy && ` (change to `}
        {!this.props.isBusy && change1}
        {!this.props.isBusy && ` or `}
        {!this.props.isBusy && change2}
        {!this.props.isBusy && `).`}
      </span>;

      userNote = !this.props.isBusy && !this.state.isSettingNote ? <span className="link-group">
        {`You can also `}
        <a href="javascript:void(0)" onClick={this.beginSettingNote.bind(this)}>set a note</a>
        {`.`}
      </span> : null;
    }

    const canSignup = this.context.hasPermission(permissions.AUTH_PERMISSION_RAIDS_SIGNUP);
    const canManage = this.context.hasPermission(permissions.AUTH_PERMISSION_RAIDS_MANAGE);

    let i1 = 0, i2 = 0, i3 = 0, i4 = 0;
    return <div className={`raid ${raidZoneIdToName(this.props.raidZone)}`}>
      <h1>
        <time className="raid-date" dateTime={this.props.startTime.toISOString()}>{this.props.startTime.format(utilConstants.DATE_FORMAT)}</time>
        <span className="raid-name">{raidZoneIdToName(this.props.raidZone, true)}</span>
      </h1>
      <RaidMetadata {...this.props} />
      <ul className="column tanks">
        <li className="tanks-header">Tanks: {tanksComing} {tanksMaybe > 0 && <span className="maybe-count">({tanksMaybe} maybe)</span>}</li>
        {tanks.sort(sortSignups).map(s => <RaidSignup key={i1++} userId={this.props.userId} beginSettingNote={this.beginSettingNote.bind(this)} {...s} />)}
      </ul>
      <ul className="column healers">
        <li className="healers-header">Healers: {healersComing} {healersMaybe > 0 && <span className="maybe-count">({healersMaybe} maybe)</span>}</li>
        {healers.sort(sortSignups).map(s => <RaidSignup key={i2++} userId={this.props.userId} beginSettingNote={this.beginSettingNote.bind(this)} {...s} />)}
      </ul>
      <ul className="column melee">
        <li className="melee-header">Melee: {meleeComing} {meleeMaybe > 0 && <span className="maybe-count">({meleeMaybe} maybe)</span>}</li>
        {melee.sort(sortSignups).map(s => <RaidSignup key={i3++} userId={this.props.userId} beginSettingNote={this.beginSettingNote.bind(this)} {...s} />)}
      </ul>
      <ul className="column ranged">
        <li className="ranged-header">Ranged: {rangedComing} {rangedMaybe > 0 && <span className="maybe-count">({rangedMaybe} maybe)</span>}</li>
        {ranged.sort(sortSignups).map(s => <RaidSignup key={i4++} userId={this.props.userId} beginSettingNote={this.beginSettingNote.bind(this)} {...s} />)}
      </ul>
      {canSignup &&<div className="button-group">
        {!userSignup && <div className="button-wrapper">
          <button className="coming" disabled={this.props.isBusy} onClick={signUpAsComing}>
            <span>Coming</span>
          </button>
        </div>}
        {!userSignup && <div className="button-wrapper">
          <button className="not-coming" disabled={this.props.isBusy} onClick={signUpAsNotComing}>
            <span>Not coming</span>
          </button>
        </div>}
        {!userSignup && <div className="button-wrapper">
          <button className="maybe" disabled={this.props.isBusy} onClick={signUpAsMaybe}>
            <span>Maybe</span>
          </button>
        </div>}
        {userSignupChoices}
        {userNote}
      </div>}
      {canSignup && this.state.isSettingNote && <div className="note-editor">
        <textarea defaultValue={this.state.noteText} ref="note"></textarea>
        <div className="button-group">
          <div className="button-wrapper">
            <button className="coming" disabled={this.props.isBusy} onClick={this.endSettingNote.bind(this, true)}>Save</button>
          </div>
          <div className="button-wrapper">
            <button className="maybe" disabled={this.props.isBusy} onClick={this.endSettingNote.bind(this, false)}>Cancel</button>
          </div>
        </div>
      </div>}
      {canManage && <div className="button-group">
        <div className="button-wrapper">
          <button className="maybe" onClick={() => this.props.navigate(`/raids/${this.props.raidId}`)}>Manage this raid</button>
        </div>
      </div>}
    </div>;
  }
}

Raid.contextTypes = {
  hasPermission: PropTypes.func.isRequired
};

Raid.propTypes = {
  startTime: PropTypes.object.isRequired,
  endTime: PropTypes.object.isRequired,
  signups: PropTypes.array.isRequired,
  updateSignup: PropTypes.func.isRequired,
  userId: PropTypes.number,
  navigate: PropTypes.func.isRequired
};
