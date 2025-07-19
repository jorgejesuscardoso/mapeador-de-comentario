type TierInfo = {
  name: string;
  fullLabel: string; 
  colorClass: string;
  tierKey: string;
  elo: string;
};

const eloPointsThresholds = [
  0, 50, 150, 300, 500,               // Névoa V → I
  800, 1200, 1700, 2300, 3000,        // Bronze V → I
  3800, 4700, 5700, 6800, 8000,       // Prata
  9300, 10700, 12200, 13800, 15500,   // Ouro
  17300, 19200, 21200, 23300, 25500,  // Diamante
  27800, 30200, 32700, 35300, 38000,  // Arcano
  40800, 43700, 46700, 49800,         // Lunar
  50000                               // Oráculo
]

export const rankingTiers = {
  nevoa: {
    name: 'Névoa',
    colorClass: 'bg-white text-gray-800', // Quase branco, com texto escuro
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  bronze: {
    name: 'Bronze',
    colorClass: 'bg-orange-400 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  prata: {
    name: 'Prata',
    colorClass: 'bg-neutral-400 text-white', // Mais metálico
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  ouro: {
    name: 'Ouro',
    colorClass: 'bg-yellow-500 text-white',
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
  },
  oraculo: {
    name: 'Oráculo',
    colorClass: 'bg-indigo-700 text-white',
    tiers: ['']
  }
}



export function calculateUserTierByPoints(totalPoints: number) {
  const tiersOrder = ['nevoa', 'bronze', 'prata', 'ouro', 'diamante', 'arcano', 'lunar', 'oraculo'];
  const elosOrder = ['V', 'IV', 'III', 'II', 'I'];

  const totalEloCount = eloPointsThresholds.length;

  if (!totalPoints) return null;

  // Índice do elo atual
  let index = eloPointsThresholds.findIndex((threshold, i) =>
    totalPoints < eloPointsThresholds[i + 1]
  );

  // Se não encontrou, tá no Oráculo (máximo)
  if (index === -1) {
    return {
      tier: 'oraculo',
      elo: '',
      fullLabel: 'Oráculo',
      isMax: true,
      colorClass: rankingTiers.oraculo.colorClass,
      current: totalEloCount,
      total: totalEloCount,
      tierPoints: eloPointsThresholds[eloPointsThresholds.length - 1], // Tudo que passou até aqui
      totalTierPoints: totalPoints,
      maxPoints: 0,
      eloPoints: totalPoints - eloPointsThresholds[eloPointsThresholds.length - 2],
      pointsToNext: 0,
      progressText: 'Max',
      progressPercent: 100,
      nextTier: null,
      nextElo: null,
      nextTierLabel: null
    };
  }

  const tierIndex = Math.floor(index / 5);
  const tierKey = tiersOrder[tierIndex];
  const tier = rankingTiers[tierKey];
  const eloPosition = index % 5;
  const elo = tier?.tiers?.[eloPosition] || '';

  const nextIndex = index + 1;
  const nextThreshold = eloPointsThresholds[nextIndex];
  const currentThreshold = eloPointsThresholds[index];

  const tierStartThreshold = eloPointsThresholds[tierIndex * 5];
  const tierPoints = totalPoints - tierStartThreshold;

  const eloPoints = totalPoints - currentThreshold;
  const pointsToNext = nextThreshold - totalPoints;
  const maxPoints = nextThreshold - currentThreshold;

  const percent = Math.round((eloPoints / maxPoints) * 100);

  const nextTierIndex = Math.floor(nextIndex / 5);
  const nextTierKey = tiersOrder[nextTierIndex];
  const nextTier = rankingTiers[nextTierKey];
  const nextEloPosition = nextIndex % 5;
  const nextElo = nextTier?.tiers?.[nextEloPosition] || '';
  const nextTierLabel = nextTierKey === 'oraculo' ? 'Oráculo' : `${nextTier?.name} ${nextElo}`;

  return {
    tier: tierKey,
    elo,
    fullLabel: `${tier.name} ${elo}`,
    isMax: false,
    colorClass: tier.colorClass,
    current: index + 1,
    total: totalEloCount,
    tierPoints,            // <= pontos acumulados no tier
    eloPoints,             // <= pontos dentro do elo atual
    pointsToNext,          // <= quanto falta pro próximo elo
    totalTierPoints: totalPoints,
    maxPoints,
    progressText: `${index + 1} / ${totalEloCount}`,
    progressPercent: percent,
    nextTier: nextTierKey,
    nextElo,
    nextTierLabel
  };
}


