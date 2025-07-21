<script setup lang="ts">
import Lucide from '../lucide/Lucide.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const tierData = {
  ferro: { name: 'Ferro', bgColor: '#141410', textColor: '#fefefe', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  bronze: { name: 'Bronze', bgColor: '#fb923c', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  prata: { name: 'Prata', bgColor: '#9ca3af', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  ouro: { name: 'Ouro', bgColor: '#facc15', textColor: '#000000', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  diamante: { name: 'Diamante', bgColor: '#3b82f6', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  lunar: { name: 'Lunar', bgColor: '#4c1d95', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  eclipse: { name: 'Eclipse', bgColor: '#a21caf', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  arcano: { name: 'Arcano', bgColor: '#7c3aed', textColor: '#ffffff', tiers: ['I', 'II'] },
  mística: { name: 'Mística', bgColor: '#db2777', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  celestial: { name: 'Celestial', bgColor: '#06b6d4', textColor: '#ffffff', tiers: ['V', 'IV', 'III', 'II', 'I'] },
  eterno: { name: 'Eterno', bgColor: '#ff00ed', textColor: '#ffffff', tiers: ['MAX'] }
}

type ReferenceRow = {
  tierName: string
  elo: string
  from: number
  to: number
  bgColor: string
  textColor: string
}

const referenceTable: ReferenceRow[] = []
const tierKeys = Object.keys(tierData)

for (let i = 0; i < eloPointsThresholds.length - 1; i++) {
  const tierIndex = Math.floor(i / 5)
  const tierKey = tierKeys[tierIndex]
  const tier = tierData[tierKey]
  const elo = tier?.tiers[i % tier.tiers?.length] || ''

  referenceTable.push({
    tierName: tier?.name,
    elo,
    from: eloPointsThresholds[i],
    to: eloPointsThresholds[i + 1] - 1,
    bgColor: tier?.bgColor,
    textColor: tier?.textColor
  })

}
  const eternoTier = tierData.eterno;
  referenceTable.push({
    tierName: eternoTier.name,
    elo: eternoTier.tiers[0], // 'MAX'
    from: eloPointsThresholds[eloPointsThresholds.length - 1],
    to: Infinity,
    bgColor: eternoTier.bgColor,
    textColor: eternoTier.textColor
  });
</script>

<template>
  <div class="flex flex-col items-start justify-center w-full overflow-x-auto mt-4 lg:mt-12 p-1">
    <div class="gap-1 my-4 text-white w-full">
      <span
       class="flex items-center justify-start"
       @click="router.back()"
      >
        <Lucide icon="ArrowLeft" class="w-4 h-4 mr-1" />
        voltar
      </span>
    </div>
    <table class="lg:w-2/3 text-sm border border-gray-300 rounded-xl overflow-hidden w-full mb-4">
      <thead class="bg-white/90 text-violet-600 border border-gray-300">
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
      </tbody>
    </table>
  </div>
</template>
