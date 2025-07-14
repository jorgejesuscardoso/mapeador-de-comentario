type TierInfo = {
  name: string;
  fullLabel: string; // ex: "Prata II"
  colorClass: string;
  tierKey: string;
  elo: string;
};

export const rankingTiers = {
  nevoa: {
    name: 'Névoa',
    colorClass: 'bg-gray-400 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  bronze: {
    name: 'Bronze',
    colorClass: 'bg-orange-400 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  prata: {
    name: 'Prata',
    colorClass: 'bg-gray-300 text-gray-900',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  ouro: {
    name: 'Ouro',
    colorClass: 'bg-yellow-500 text-gray-900',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  diamante: {
    name: 'Diamante',
    colorClass: 'bg-blue-500 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  arcano: {
    name: 'Arcano',
    colorClass: 'bg-fuchsia-600 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  lunar: {
    name: 'Lunar',
    colorClass: 'bg-purple-800 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  }
}


export function getTierInfo(tier: string, elo: string): TierInfo | null {
  const tierKey = tier?.toLowerCase();
  const tierData = rankingTiers[tierKey as keyof typeof rankingTiers];

  if (!tierData || !tierData.tiers.includes(elo)) return null;

  return {
    name: tierData.name,
    fullLabel: `${tierData.name} ${elo}`,
    colorClass: tierData.colorClass,
    tierKey,
    elo
  };
}