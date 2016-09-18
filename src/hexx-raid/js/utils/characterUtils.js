import * as constants from './constants';

export function specToRole(spec, characterClass) {
  switch ((spec || '').toLowerCase()) {
    case 'blood':
    case 'brewmaster':
    case 'guardian':
    case 'protection':
    case 'vengeance':
      return constants.CHARACTER_ROLE_TANK;

    case 'discipline':
    case 'holy':
    case 'mistweaver':
    case 'restoration':
      return constants.CHARACTER_ROLE_HEALER;

    case 'arms':
    case 'assassination':
    case 'enhancement':
    case 'feral':
    case 'fury':
    case 'havoc':
    case 'outlaw':
    case 'retribution':
    case 'subtlety':
    case 'survival':
    case 'unholy':
    case 'windwalker':
      return constants.CHARACTER_ROLE_MELEE;

    case 'affliction':
    case 'arcane':
    case 'balance':
    case 'beast-mastery':
    case 'demonology':
    case 'destruction':
    case 'elemental':
    case 'fire':
    case 'marksmanship':
    case 'shadow':
      return constants.CHARACTER_ROLE_RANGED;

    case 'frost':
      return characterClass === constants.CHARACTER_CLASS_DEATH_KNIGHT
        ? constants.CHARACTER_ROLE_MELEE
        : constants.CHARACTER_ROLE_RANGED;

    default:
      return null;
  }
}

export function classIdToName(classId, friendly) {
  switch (classId) {
    case 1:
      return friendly ? 'Warrior' : 'warrior';

    case 2:
      return friendly ? 'Paladin' : 'paladin';
      
    case 3:
      return friendly ? 'Hunter' : 'hunter';

    case 4:
      return friendly ? 'Rogue' : 'rogue';

    case 5:
      return friendly ? 'Priest' : 'priest';

    case 6:
      return friendly ? 'Death Knight' : 'death-knight';

    case 7:
      return friendly ? 'Shaman' : 'shaman';

    case 8:
      return friendly ? 'Mage' : 'mage';

    case 9:
      return friendly ? 'Warlock' : 'warlock';

    case 10:
      return friendly ? 'Monk' : 'monk';

    case 11:
      return friendly ? 'Druid' : 'druid';

    case 12:
      return friendly ? 'Demon Hunter' : 'demon-hunter';

    default:
      return null;
  }
}
