import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Iterable } from 'immutable';

import { Loader } from '../../utils';
import UserRow from './UserRow';

const Users = (props) => {
  const { users, isLoading } = props;

  return <section id="users" className="page">
    {isLoading && <div className="loader-container"><Loader /></div>}
    {!isLoading && <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Raider</th>
            <th width="100%" />
          </tr>
        </thead>
        <tbody>
          {users.map(u => <UserRow {...u} />)}
        </tbody>
      </table>
    </div>}
  </section>;
};

Users.propTypes = {
  isLoading: PropTypes.bool,
  users: PropTypes.instanceOf(Iterable).isRequired
};

const mapStateToProps = state => ({
  users: state.users.users
});

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
