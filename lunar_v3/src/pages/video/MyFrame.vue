<script setup lang="ts">
import { ref, watch, nextTick } from "vue"

const currentIndex = ref(1)

const seriesArray = [
  {
    name: 'Casamento Obrigátorio',
    src: "https://techmaisbr.com/shortseries/CASAMENTOOBRIGATORIO/CASAMENTOOBRIGATORIO"
  },
  {
    name: '30 anos congelada 3 irmãos se arrependem',
    src: 'https://techmaisbr.com/shortseries/30ANOSCONGELADA/30ANOSCONGELADA'
  }
]
const videoRef = ref<HTMLVideoElement | null>(null)
const serieToWatch = ref(seriesArray[0].src)

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

// sempre que o índice mudar, recarrega o vídeo
watch(currentIndex, async () => {
  await nextTick()
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.play()
  }
})

watch(serieToWatch, async () => {
  await nextTick()
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.play()
  }
})
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
    <h1 class="text-2xl font-bold mb-6">🎥 Playlist Dark</h1>
    <!-- player -->
    <div class="relative w-full lg:w-[70vw] h-[60vh] rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <video
        ref="videoRef"
        class="w-full h-full"
        controls
        autoplay
        @ended="nextVideo"
      >
        <source :src="serieToWatch + currentIndex + '.mp4'" type="video/mp4" />
        
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
          Episódio {{ n }}
        </option>
      </select>
    </div>

    
    <!-- seletor Serie-->
    <div class="mt-6">
      <label for="videoSelect" class="mr-2 text-gray-300">Serie:</label>
      <select
        id="videoSelect"
        v-model="serieToWatch"
        class="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600"
      >
        <option v-for="n in seriesArray" :key="n.name" :value="n.src">
          {{ n.name }}
        </option>
      </select>
    </div>

    <!-- indicador -->
    <p class="mt-3 text-gray-400 text-sm">
      Epsódio atual: {{ currentIndex }}
    </p>
  </div>
</template>
