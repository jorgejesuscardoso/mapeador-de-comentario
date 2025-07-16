<script setup lang="ts">
const eloPointsThresholds = [
  0, 50, 150, 300, 500,               // Névoa V → I
  800, 1200, 1700, 2300, 3000,        // Bronze
  3800, 4700, 5700, 6800, 8000,       // Prata
  9300, 10700, 12200, 13800, 15500,   // Ouro
  17300, 19200, 21200, 23300, 25500,  // Diamante
  27800, 30200, 32700, 35300, 38000,  // Arcano
  40800, 43700, 46700, 49800,         // Lunar
  50000                              // Oráculo
];

const tierData = {
  nevoa: { name: 'Névoa', bgColor: '#f3f4f6', textColor: '#374151', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  bronze: { name: 'Bronze', bgColor: '#fb923c', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  prata: { name: 'Prata', bgColor: '#9ca3af', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  ouro: { name: 'Ouro', bgColor: '#facc15', textColor: '#000000', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  diamante: { name: 'Diamante', bgColor: '#3b82f6', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  arcano: { name: 'Arcano', bgColor: '#a21caf', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  lunar: { name: 'Lunar', bgColor: '#4c1d95', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  oraculo: { name: 'Oráculo', bgColor: '#3730a3', textColor: '#ffffff', tiers: [''] }
};

type ReferenceRow = {
  tierName: string;
  elo: string;
  from: number;
  to: number;
  bgColor: string;
  textColor: string;
}

const referenceTable: ReferenceRow[] = [];
const tierKeys = Object.keys(tierData);

for (let i = 0; i < eloPointsThresholds.length - 1; i++) {
  const tierIndex = Math.floor(i / 5);
  const tierKey = tierKeys[tierIndex];
  const tier = tierData[tierKey];
  const elo = tier.tiers[i % 5] || '';

  referenceTable.push({
    tierName: tier.name,
    elo,
    from: eloPointsThresholds[i],
    to: eloPointsThresholds[i + 1] - 1,
    bgColor: tier.bgColor,
    textColor: tier.textColor
  });
}

const oraculo = {
  tierName: tierData.oraculo.name,
  bgColor: tierData.oraculo.bgColor,
  textColor: tierData.oraculo.textColor
};
</script>

<template>
  <div class="flex items-start justify-center w-full overflow-x-auto mt-4 lg:mt-12">
    <table class="lg:w-2/3 text-sm border border-gray-300 rounded-xl overflow-hidden">
      <thead class="bg-purple-300 text-violet-600 border border-gray-300">
        <tr>
          <th class="px-4 py-2 text-left">Tier</th>
          <th class="px-4 py-2 text-left">Elo</th>
          <th class="px-4 py-2 text-left">Pontos</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in referenceTable"
          :key="index"
          class="border"
          :style="{
            backgroundColor: row.bgColor,
            color: row.textColor
          }"
        >
          <td class="px-4 py-2 font-semibold">{{ row.tierName }}</td>
          <td class="px-4 py-2">{{ row.elo }}</td>
          <td class="px-4 py-2">{{ row.from.toLocaleString() }} - {{ row.to.toLocaleString() }}</td>
        </tr>

        <tr
          :style="{
            backgroundColor: oraculo.bgColor,
            color: oraculo.textColor
          }"
        >
          <td class="px-4 py-2 font-semibold">{{ oraculo.tierName }}</td>
          <td class="px-4 py-2">—</td>
          <td class="px-4 py-2">50.000+</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
