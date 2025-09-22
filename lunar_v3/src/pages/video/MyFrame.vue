<script setup lang="ts">
import { ref } from "vue"

const currentIndex = ref(1)
const casamentoObg = 'https://techmaisbr.com/shortseries/CASAMENTOOBRIGATORIO/CASAMENTOOBRIGATORIO'

function nextVideo() {
  if (currentIndex.value < 100) {
    currentIndex.value++
  }
}

function prevVideo() {
  if (currentIndex.value > 1) {
    currentIndex.value--
  }
}
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
    <h1 class="text-2xl font-bold mb-6">🎥 Playlist Dark</h1>

    <!-- player -->
    <div class="relative w-[70vw] max-w-6xl h-[60vh] rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <video
        class="w-full h-full"
        controls
        autoplay
        @ended="nextVideo"
      >
        <source :src="casamentoObg + currentIndex + '.mp4'" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    </div>

    <!-- botões -->
    <div class="flex gap-4 mt-6">
      <button
        @click="prevVideo"
        class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentIndex <= 1"
      >
        ⬅️ Anterior
      </button>

      <button
        @click="nextVideo"
        class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
        :disabled="currentIndex >= 100"
      >
        Próximo ➡️
      </button>
    </div>

    <!-- seletor -->
    <div class="mt-6">
      <label for="videoSelect" class="mr-2 text-gray-300">Ir para:</label>
      <select
        id="videoSelect"
        v-model="currentIndex"
        class="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600"
      >
        <option v-for="n in 100" :key="n" :value="n">
          Vídeo {{ n }}
        </option>
      </select>
    </div>

    <!-- indicador -->
    <p class="mt-3 text-gray-400 text-sm">
      Índice atual: {{ currentIndex }}
    </p>
  </div>
</template>
