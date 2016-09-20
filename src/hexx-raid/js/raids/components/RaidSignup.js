import React from 'react';
import { classIdToName } from '../../utils';
import Note from './Note';

export default function RaidSignup(props) {
  let statusClass;
  let statusTitle;
  switch (props.status) {
    case 0:
      statusClass = 'coming';
      statusTitle = 'Coming';
      break;

    case 1:
      statusClass = 'maybe';
      statusTitle = 'Maybe';
      break;

    case 2:
      statusClass = 'not-coming';
      statusTitle = 'Not coming';
      break;

    default:
      statusClass = 'unknown';
      statusTitle = 'Not signed yet';
      break;
  }

  return <li className={`signup ${classIdToName(props.character.class)}`}>
    <span className={'spec ' + props.character.primarySpec}></span>
    <span>{props.character.name}</span>
    {props.note && <Note {...props.note} />}
    <span className={`indicator ${statusClass}`} title={statusTitle}></span>
  </li>;
}
