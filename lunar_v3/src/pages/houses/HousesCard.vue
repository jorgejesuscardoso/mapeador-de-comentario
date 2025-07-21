<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Loading from '@/base/loading/Loading.vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { getHouses } from '@/API/HouseApi'
import { capitalize } from '@/base/helpers/capitalize'

interface House {
  name: string
  description: string
  theme: string
  banner: string
  thumb: string
  points: number
  rankingPosition: number
  level: number
  leader: string
  achievements: string[]
  tags: string[]
}

const houses = ref<House[]>([])
const isLoading = ref(true)
const fetchError = ref(false)

watch(houses, (val) => {
  console.log('🔍 Casas carregadas:')
})

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await getHouses()
    houses.value = response
  } catch (e) {
    fetchError.value = true
    console.error('❌ Erro ao buscar casas:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="w-full px-4 lg:px-8 py-6 lg:mt-14">
    <Loading :is-loading="isLoading">
      <template #title>Carregando as casas lunares</template>
      <template #description>Buscando dados do clã... 🛸</template>
    </Loading>

    <div v-if="fetchError" class="text-red-400 font-medium mt-4">
      Não foi possível carregar as casas. Tente novamente mais tarde.
    </div>

    <div v-if="!isLoading && !fetchError" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="house in houses"
        :key="house.name"
        class="bg-[rgba(0,0,0,0.8)] rounded-xl p-3 shadow-md hover:shadow-xl text-white flex flex-col relative"
      >
        <!-- Ranking -->
        <div 
          class="absolute top-4 right-4 w-7 h-7 text-sm font-semibold p-1 rounded-full flex items-center justify-center"
          :class="{
            'bg-yellow-500 text-white': house.rankingPosition === 1,
            'bg-gray-500 text-gray-100': house.rankingPosition === 2,
            'bg-orange-950 text-white': house.rankingPosition === 3,
            'bg-white text-gray-800': house.rankingPosition
          }"
        >
          #{{ house.rankingPosition || '?' }}
        </div>

        <!-- Banner -->
        <img
          :src="`/houses_banners/${house.banner}`"
          alt="Banner da casa"
          class="w-full h-44 object-cover rounded-md mb-3 border border-purple-700"
        />

        <!-- Top Info -->
        <div class="flex items-center gap-3">
          <img
            :src="`/houses_flags/${house.thumb}`"
            alt="Emblema"
            class="w-12 h-12 object-contain rounded-full border-2 bg-white/50 border-purple-400 shadow"
          />
          <div>
            <h2 class="text-purple-200 font-semibold text-lg leading-tight capitalize">
              {{ capitalize(house.name) }}
            </h2>
            <p class="text-violet-300 text-xs">
              Nível {{ house.level }} • {{ house.points.toLocaleString('pt-br') }} pts
            </p>
          </div>
        </div>

        <!-- Líder -->
        <p class="mt-3 text-sm text-purple-300 flex items-center gap-1">
          <Lucide icon="User" class="w-4 h-4" />
          Líder: <span class="ml-1 text-violet-300 font-medium">@{{ house.leader }}</span>
        </p>

        <!-- Tema -->
        <p class="mt-2 text-sm italic text-gray-300">"{{ house.theme }}"</p>

        <!-- Descrição -->
        <p
          class="mt-2 text-sm text-gray-200"
          v-html="house.description.replace(/\n/g, '<br>')"
        />
          
        

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="tag in house.tags"
            :key="tag"
            class="bg-purple-700 text-xs text-white px-2 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Conquistas -->
        <div v-if="house.achievements?.length" class="mt-4">
          <h4 class="text-purple-300 text-xs font-semibold mb-1">Conquistas:</h4>
          <ul class="list-disc list-inside text-sm text-violet-200">
            <li v-for="(achievement, i) in house.achievements" :key="i">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
