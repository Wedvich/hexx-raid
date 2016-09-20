import { classIdToName, specToRole } from '../../utils';

export default function AuditRow(props) {
  return <tr>
    <td className={classIdToName(props.class)}>
      <span className={props.primarySpec + ' spec'}></span>
      <span>{props.name}</span>
    </td>
    <td>{props.audit ? props.audit.itemLevel : null}</td>
    <td width="100%"></td>
  </tr>
}
