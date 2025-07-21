type TierInfo = {
  name: string;
  fullLabel: string; 
  colorClass: string;
  tierKey: string;
  elo: string;
};

const eloPointsThresholds = [
  // Ferro
  0, 100, 250, 450, 700,
  // Bronze
  1000, 1400, 1850, 2350, 2900,
  // Prata
  3500, 4150, 4850, 5600, 6400,
  // Ouro
  7300, 8250, 9250, 10300, 11400,
  // Diamante
  12600, 13900, 15300, 16800, 18400,
  // Lunar
  20100, 21900, 23800, 25800, 27900,
  // Eclipse
  30100, 32400, 34800, 37300, 39900,
  // Arcano (dois elos)
  42600, 45400, 48300, 51300, 54400,   
  // Mistico
  57600, 60900,64300, 67800, 71400,  
  // Celestial
  75100, 78900,82800, 86800, 90900,
  // Eterno
  100000
]

export const rankingTiers = {
  ferro: {
    name: 'Ferro',
    colorClass: 'bg-black/70 text-white', // Quase branco, com texto escuro
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
  lunar: {
    name: 'Lunar',
    colorClass: 'bg-purple-800 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  eclipse: {
    name: 'Eclipse',
    colorClass: 'bg-fuchsia-600 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  arcano: {
    name: 'Arcano',
    colorClass: 'bg-indigo-700 text-white',
    tiers: ['']
  },
  mística: {
    name: 'Mística',
    colorClass: 'bg-fuchsia-600 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  celestial: {
    name: 'Celestial',
    colorClass: 'bg-cyan-400 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
  eterno: {
    name: 'Eterno',
    colorClass: 'bg-cyan-400 text-white',
    tiers: ['V', 'IV', 'III', 'II', 'I']
  },
}



export function calculateUserTierByPoints(totalPoints: number) {
  const tiersOrder = ['ferro', 'bronze', 'prata', 'ouro', 'diamante', 'lunar', 'eclipse', 'arcano', 'mística', 'celestial', 'eterno'];
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
      tier: 'eterno',
      elo: '',
      fullLabel: 'Eterno',
      isMax: true,
      colorClass: rankingTiers.celestial.colorClass,
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
  const nextTierLabel = nextTierKey === 'eterno' ? 'Eterno' : `${nextTier?.name} ${nextElo}`;

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


