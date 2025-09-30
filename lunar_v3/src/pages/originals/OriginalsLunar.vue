<script setup lang="ts">
import { ref, computed } from "vue"
import { mock } from "./mock"

interface Obra {
  id: number
  titulo: string
  capa: string
  views: number
  adulto: boolean
  genero: string
  tags: string[]
}

const obras = ref<Obra[]>(mock)

// Agrupa as obras por gênero
const generos = computed(() => {
  const grupos: Record<string, Obra[]> = {}
  obras.value.forEach((obra) => {
    if (!grupos[obra.genero]) {
      grupos[obra.genero] = []
    }
    grupos[obra.genero].push(obra)
  })
  return grupos
})
</script>

<template>
  <div
    class="w-full bg-gray-2000 absolute left-0 top-9 z-0 flex items-start justify-end px-6 min-h-[93vh]"
  >
    <div class="w-full lg:w-[83vw]">
      <h2
        class="text-2xl sm:text-3xl font-bold mb-1 text-center text-indigo-500"
      >
        Obras Originais Lunar
        <span class="text-sm text-indigo-400/80">(Em breve)</span>
      </h2>

      <div
        class="h-[87vh] overflow-y-auto seu-container"
      >
          <!-- Loop de GÊNEROS -->
        <div v-for="(lista, genero) in generos" :key="genero" class="mb-2">
          <!-- Título do gênero -->
          <h3 class="font-semibold mb-1 text-indigo-600">
            {{ genero }}
          </h3>

          <!-- Grid de obras -->
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 place-items-center"
          >
            <div
              v-for="obra in lista"
              :key="obra.id"
              class="relative group w-full max-w-[180px] bg-white rounded-md"
            >
              <!-- CAPA -->
              <img
                :src="obra.capa"
                :alt="obra.titulo"
                class="w-full aspect-[3/4] object-cover rounded-md shadow-md group-hover:shadow-xl transition"
              />
              <!-- Tag principal -->
              <div
                v-if="obra.tags?.length"
                class="my-2 text-[11px] font-medium text-gray-800 truncate px-2"
              >
                #{{ obra.tags[0] }}
              </div>

              <!-- Views -->
              <div
                class="text-gray-800 text-[11px] flex items-center gap-1 mb-1  px-2"
              >
                👁️ {{ obra.views.toLocaleString() }}
              </div>

              <!-- Badge +18 -->
              <span
                v-if="obra.adulto"
                class="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded"
              >
                +18
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
