<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from "vue"
import { mock } from "./mock"
import Lucide from "@/base/lucide/Lucide.vue"
import { useRouter } from "vue-router"
import { getBookLunar } from "@/API/OriginalLunarApi"

const isBeta = ref(inject('isBeta'))
const router = useRouter()

export interface Book {
  id: string                // Identificador único (PK)
  name: string              // Título do livro
  cover: string             // URL da capa
  sinopse: string           // Resumo da história
  author: string            // Autor da obra
  genre: string             // Gênero literário principal
  tags: string[]            // Lista de tags para busca e categorização

  votes: number             // Quantidade de votos/curtidas
  commentsTotal: number          // Número de comentários
  views: number             // Contagem de visualizações

  createdAt: string         // Data de criação (ISO string)
  updatedAt: string         // Última atualização (ISO string)

  mature: boolean
  
  // Possíveis extensões futuras
  status?: string  // Estado da obra
  contestEntry?: boolean   // Se participa do Lunar Contest
}

const obras = ref<Book[]>(mock)
const apiData = ref(null)

// Agrupa as obras por gênero
const generos = computed(() => {
  const grupos: Record<string, Book[]> = {}

  obras.value.forEach((obra) => {
    if (!grupos[obra.genre]) grupos[obra.genre] = []
    grupos[obra.genre].push(obra)
  })

  // Ordena cada grupo pelo maior views primeiro
  Object.keys(grupos).forEach((genre) => {
    grupos[genre].sort((a, b) => b.views - a.views)
  })

  return grupos
})

watch(apiData, (val) => {
  if(val) {
    obras.value.push(...val) // junta mock + api
  }
}, {immediate:true})

onMounted(async () => {
  const response = await getBookLunar()
  if(response.status === 200) {
    apiData.value = response.data
  }

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
          class="h-10 w-full border px-10 border-gray-500/45 rounded-xl focus:ring-0 focus:outline-none text-gray-600 placeholder:text-gray-500"
          placeholder="Pesquisa ainda em fase de testes!!!"
        >

        <Lucide
          icon="Search"
          class="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"
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
                :src="obra.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'"
                :alt="obra.name"
                class="w-full aspect-[3/4] object-cover cursor-pointer rounded-md shadow-md group-hover:shadow-xl transition"
              />

              <!-- Autor -->
               <div
                v-if="obra.tags?.length"
                class="my-1 text-[10px] font-medium text-gray-500 truncate px-2"
              >
                por: <span class="text-blue-700">{{ obra.author || 'Anônimo'}}</span>
              </div>
              <!-- Tag principal -->
              <div
                v-if="obra.tags?.length"
                class="mb-1 text-[11px] font-medium text-indigo-800 truncate px-2 capitalize"
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
                v-if="obra.mature"
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
