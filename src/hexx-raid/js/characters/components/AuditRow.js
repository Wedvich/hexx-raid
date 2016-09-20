import { classIdToName, specToRole } from '../../utils';

function enhancementQualityToName(quality) {
  switch (quality) {
    case 2:
      return 'good';
    case 1:
      return 'poor';
    default:
      return 'none';
  }
}

export default function AuditRow(props) {

  const gems = (props.audit.gems || '')
    .split(',')
    .filter(g => g.length)
    .map(g => parseInt(g))
    .sort((a, b) => b - a);

  let i = 0;
  return <tr>
    <td className={classIdToName(props.class)}>
      <span className={props.primarySpec + ' spec'}></span>
      <a className={classIdToName(props.class)} href={`https://eu.battle.net/wow/en/character/chamber-of-aspects/${props.name}/advanced`} target="_blank">
        {props.name}
      </a>
    </td>
    <td>{props.audit ? props.audit.itemLevel : null}</td>
    <td><span className={`quality ${enhancementQualityToName(props.audit.neckEnchant)}`}></span></td>
    <td><span className={`quality ${enhancementQualityToName(props.audit.cloakEnchant)}`}></span></td>
    <td><span className={`quality ${enhancementQualityToName(props.audit.ring1Enchant)}`}></span></td>
    <td><span className={`quality ${enhancementQualityToName(props.audit.ring2Enchant)}`}></span></td>
    <td>
      {gems.map(gem => <span key={i++} className={`quality gem ${enhancementQualityToName(gem)}`}></span>)}
    </td>
    <td width="100%"></td>
  </tr>;
}
