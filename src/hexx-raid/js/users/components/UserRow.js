import React, { PropTypes } from 'react';

export default function UserRow(props) {
  return <tr className={!props.isRaider ? 'disabled' : null}>
    <td>{props.userId}</td>
    <td>{props.name}</td>
    <td>{props.isRaider ? 'Yes' : 'No'}</td>
    <td />
  </tr>;
}

UserRow.propTypes = {
  isRaider: PropTypes.bool,
  name: PropTypes.string,
  userId: PropTypes.number
};
