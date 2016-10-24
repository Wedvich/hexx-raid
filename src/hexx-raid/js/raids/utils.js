export function raidZoneIdToName(raidZoneId, friendly) {
  switch (raidZoneId) {
    case 8025:
      return friendly ? 'The Nighthold' : 'the-nighthold';

    case 8026:
      return friendly ? 'The Emerald Nightmare' : 'the-emerald-nightmare';

    case 8440:
      return friendly ? 'Trial of Valor' : 'trial-of-valor';

    default:
      return null;
  }
}
