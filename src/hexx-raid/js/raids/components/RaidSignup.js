import React from 'react';
import { classIdToName } from '../../utils';

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

  let note;
  if (props.userId === props.character.userId) {
    note = props.note ? <span className="note user" title={`${props.note.text} (Click to edit)`} onClick={props.beginSettingNote}></span> : null;
  } else {
    note = props.note ? <span className="note" title={props.note.text}></span> : null;
  }

  return <li className={`signup ${classIdToName(props.character.class)}`}>
    <span className={'spec ' + props.character.primarySpec}></span>
    <span>{props.character.name}</span>
    {note}
    <span className={`indicator ${statusClass}`} title={statusTitle}></span>
  </li>;
}
