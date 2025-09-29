<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import { FilmesList, SeriesList } from "./series"

type Mode = "series" | "filmes"
interface SeriesItem { name: string; src: string; episodes?: number }
interface FilmeItem { name: string; url: string }

const mode = ref<Mode>("series")

// listas vindas do seu arquivo
const seriesArray = (SeriesList ?? []) as SeriesItem[]
const filmesArray = (FilmesList ?? []) as unknown as FilmeItem[]

// SERIES state
const serieIndex = ref(0)                 // índice da série selecionada
const currentIndex = ref(1)               // episódio atual
const videoRef = ref<HTMLVideoElement | null>(null)
const serieToWatch = ref(seriesArray[0]?.src ?? "")

// quantos episódios tem a série selecionada (fallback = 100)
const episodesCount = computed(() => seriesArray[serieIndex.value]?.episodes ?? 100)

// FILMES state
const filmeIndex = ref(0)
const filmeToWatch = ref(filmesArray[0]?.url ?? "")

/* -------------------------
   fixes / watches importantes
   ------------------------- */

// Quando trocar de série: atualiza src, reseta ep e força load+play
watch(serieIndex, async (newIdx) => {
  serieToWatch.value = seriesArray[newIdx]?.src ?? ""
  currentIndex.value = 1
  await nextTick()
  if (videoRef.value) {
    // força o reload do vídeo para refletir a nova série
    videoRef.value.load()
    videoRef.value.play().catch(() => { /* autoplay pode ser bloqueado */ })
  }
})

// Quando trocar de filme: atualiza o src do iframe
watch(filmeIndex, (newIdx) => {
  filmeToWatch.value = filmesArray[newIdx]?.url ?? ""
})

// Quando trocar episódio: recarrega o vídeo
watch(currentIndex, async () => {
  await nextTick()
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.play().catch(() => {})
  }
})

// garante que currentIndex não exceda episodesCount
watch(episodesCount, (n) => {
  if (currentIndex.value > n) currentIndex.value = n
})

// pausa o vídeo ao ir para filmes; ao voltar para séries tenta retomar
watch(mode, (m) => {
  if (m === "filmes") videoRef.value?.pause()
  else {
    nextTick(() => {
      videoRef.value?.load()
      videoRef.value?.play().catch(() => {})
    })
  }
})

function nextVideo() { if (currentIndex.value < episodesCount.value) currentIndex.value++ }
function prevVideo() { if (currentIndex.value > 1) currentIndex.value-- }
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
    <h1 class="text-2xl font-bold mb-6">🎥 Stream Lunar</h1>

    <!-- SWITCH Mode -->
    <div class="flex items-center gap-3 mb-6">
      <span :class="mode === 'series' ? 'text-green-400' : 'text-gray-400'">📺 Séries</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          v-model="mode"
          true-value="filmes"
          false-value="series"
        />
        <div
          class="w-14 h-8 bg-gray-600 rounded-full peer-checked:bg-green-600 transition-colors"
        ></div>
        <span
          class="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform
                peer-checked:translate-x-6"
        ></span>
      </label>

      <span :class="mode === 'filmes' ? 'text-green-400' : 'text-gray-400'">🎬 Filmes</span>
    </div>

    <!-- PLAYER -->
    <div class="relative w-full lg:w-[70vw] h-[60vh] rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <!-- VIDEO (séries) -->
      <video
        v-if="mode === 'series' && seriesArray.length"
        ref="videoRef"
        class="w-full h-full bg-black"
        controls
        autoplay
        @ended="nextVideo"
      >
        <!-- ajuste: assumo que serieToWatch já é o base + currentIndex (ex: '/videos/dark-s01-ep') -->
        <source :src="`${serieToWatch}${currentIndex}.mp4`" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>

      <!-- IFRAME (filmes) - key força reload total se a url mudar -->
      <iframe
        v-else-if="mode === 'filmes' && filmesArray.length"
        :key="filmeToWatch"
        class="w-full h-full"
        :src="filmeToWatch"
        referrerpolicy="no-referrer"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowfullscreen
      ></iframe>

      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        Nenhum item disponível.
      </div>
    </div>

    <!-- CONTROLES SÉRIE -->
    <div v-if="mode === 'series' && seriesArray.length" class="flex flex-col items-center mt-6 gap-4">
      <div class="flex gap-4">
        <button @click="prevVideo" class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40" :disabled="currentIndex <= 1">⬅️ Anterior</button>
        <button @click="nextVideo" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700" :disabled="currentIndex >= episodesCount">Próximo ➡️</button>
      </div>

      <div>
        <label class="mr-2 text-gray-300">Série:</label>
        <select v-model="serieIndex" class="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600">
          <option v-for="(s, i) in seriesArray" :key="s.name + i" :value="i">{{ s.name }}</option>
        </select>
      </div>

      <div>
        <label class="mr-2 text-gray-300">Episódio:</label>
        <select v-model="currentIndex" class="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600">
          <option v-for="n in episodesCount" :key="n" :value="n">Episódio {{ n }}</option>
        </select>
      </div>

      <p class="mt-3 text-gray-400 text-sm">Episódio atual: {{ currentIndex }} / {{ episodesCount }}</p>
    </div>

    <!-- CONTROLES FILME -->
    <div v-else-if="mode === 'filmes' && filmesArray.length" class="mt-6">
      <label class="mr-2 text-gray-300">Filme:</label>
      <select v-model="filmeIndex" class="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600">
        <option v-for="(f, i) in filmesArray" :key="f.name + i" :value="i">{{ f.name }}</option>
      </select>
    </div>
  </div>
</template>
