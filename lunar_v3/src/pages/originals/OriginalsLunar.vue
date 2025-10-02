<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue"
import { mock } from "./mock"
import Lucide from "@/base/lucide/Lucide.vue"
import { useRouter } from "vue-router"

const isBeta = inject('isBeta')
const router = useRouter()
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

onMounted(() => {
  if(!isBeta) return router.push('/')
})

</script>

<template>
  <div
    class="w-full bg-white absolute left-0 top-9 z-0 flex font items-start justify-end px-6"
  >
    <div class="w-full lg:w-[83vw] lg:mt-10 mt-14">
      <header
        class="relative"
      >
        <input 
          type="text"
          class="h-10 w-full border px-10 border-indigo-400 rounded-xl focus:ring-0 focus:outline-none text-indigo-600 placeholder:text-gray-500"
          placeholder="Pesquisa ainda em fase de testes!!!"
        >

        <Lucide
          icon="Search"
          class="absolute top-1/2 -translate-y-1/2 left-2 text-indigo-500"
          :stroke-width="1"
        />
      </header>
      <div
        class="pb-28 seu-container mt-6"
      >
          <!-- Loop de GÊNEROS -->
        <div v-for="(lista, genero) in generos" :key="genero" class="mb-10">
          <!-- Título do gênero -->
          <h3 class="font-semibold mb-1 text-gray-800">
            {{ genero }}:
          </h3>
          <span>
            
          </span>

          <!-- Grid de obras -->
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 place-items-center z-50"
          >
            <div
              v-for="obra in lista"
              :key="obra.id"
              class="relative group w-full max-w-[180px] cursor-pointer rounded-md"
            >
              <!-- CAPA -->
              <img
                :src="obra.capa"
                :alt="obra.titulo"
                class="w-full aspect-[3/4] object-cover cursor-pointer rounded-md shadow-md group-hover:shadow-xl transition"
              />
              <!-- Tag principal -->
              <div
                v-if="obra.tags?.length"
                class="mt-2 mb-1 text-[11px] font-medium text-indigo-800 truncate px-2"
              >
                #{{ obra.tags[0] }}
              </div>

              <!-- Views -->
              <div
                class="text-gray-800 text-[10px] flex items-center gap-1 mb-1  px-2"
              >
                <Lucide
                  icon="Eye"
                  class="w-4 h-4 text-gray-600"
                /> {{ obra.views.toLocaleString() }}
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
