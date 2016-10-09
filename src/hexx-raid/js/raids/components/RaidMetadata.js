import React from 'react';
import { constants as utilConstants } from '../../utils';

export default function RaidMetadata(props) {
  const plan = !props.plan ? null :
    <tr>
      <th>Plan</th>
      <td colSpan="2">{props.plan}</td>
    </tr>;


  return <table className="raid-metadata">
    <tbody>
      <tr>
        <th>Start</th>
        <td width="100%"><time className="raid-time" dateTime={props.startTime.toISOString()}>{props.startTime.format(utilConstants.TIME_FORMAT)}</time> (server time)</td>
      </tr>
      <tr>
        <th>End</th>
        <td width="100%"><time className="raid-time" dateTime={props.endTime.toISOString()}>{props.endTime.format(utilConstants.TIME_FORMAT)}</time> (server time)</td>
      </tr>
      {plan}
    </tbody>
  </table>;
}
