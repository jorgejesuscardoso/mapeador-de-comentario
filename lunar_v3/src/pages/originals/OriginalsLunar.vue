<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from "vue"
import { mock } from "./mock"
import Lucide from "@/base/lucide/Lucide.vue"
import { useRouter } from "vue-router"
import { getBookLunar } from "@/API/OriginalLunarApi"
import { genres } from "./work/genres"

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

const obras = ref<Book[]>([])
const apiData = ref(null)

// Map de lookup de value => label
const genreMap: Record<string,string> = Object.fromEntries(genres.map(g => [g.value, g.label]));
const normalize = (str: string) => str?.trim().toLowerCase();

// Agrupa as obras por gênero
const generos = computed(() => {
  const grupos: Record<string, { label: string; books: Book[] }> = {};

  obras.value.forEach((obra) => {
    const key = normalize(obra.genre); // força lowercase
    if (!grupos[key]) {
      grupos[key] = { 
        label: genreMap[key] || obra.genre, // pega label correta
        books: [] 
      };
    }
    grupos[key].books.push(obra);
  });

  // Ordena cada grupo pelo maior views primeiro
  Object.keys(grupos).forEach((genre) => {
    grupos[genre].books.sort((a, b) => b.views - a.views);
  });

  return grupos;
});

const hasObras = computed(() => obras.value.length > 0)


watch(apiData, (val) => {

  if(val) {
    obras.value = []
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
    class="w-full dark:bg-[#000] bg-white min-h-screen absolute left-0 top-9 z-0 flex font items-start justify-end px-6"
  >
    <div class="w-full lg:w-[83vw] lg:mt-10 mt-14">
      <header
        class="relative"
      >
        <input 
          type="text"
          class="h-10 w-full dark:bg-gray-950 dark:border-gray-900 dark:text-gray-400 border px-10 border-gray-500/45 rounded-xl focus:ring-0 focus:outline-none text-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-700"
          placeholder="Pesquisa ainda em fase de testes!!!"
        >

        <Lucide
          icon="Search"
          class="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400 dark:text-gray-700"
          :stroke-width="1"
        />
      </header>
      <div
        class="pb-28 seu-container mt-6"
      >

        <!-- EMPTY STATE -->
        <div v-if="!hasObras" class="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <Lucide icon="BookX" class="w-16 h-16 text-gray-400 mb-4"/>
          <p class="text-lg font-semibold text-gray-700">Nenhuma obra encontrada</p>
          <p class="text-sm text-gray-500">Que tal começar criando a sua primeira história?</p>
          <button 
            @click="router.push('/v1/origins/work/create')" 
            class="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md shadow-md"
          >
            Criar obra
          </button>
        </div>
              <!-- Loop de GÊNEROS -->
        <div v-for="(grupo, key) in generos" :key="key" class="mb-10">
          <h3 class="font-semibold mb-1 text-gray-800 dark:text-gray-300">
            {{ grupo.label }}:
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 place-items-center z-50">
            <div v-for="obra in grupo.books" :key="obra.id" class="relative group w-[160px] max-w-[180px] cursor-pointer  darpk:bg-[#ffffff05] ">
              <img :src="obra.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'" :alt="obra.name" class="w-full h-[210px] object-contai cursor-pointer shadow-md group-hover:shadow-xl transition"/>
              
              <div v-if="obra.tags?.length" class="my-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate px-2">
                por: <span class="text-blue-700 dark:text-blue-500">{{ obra.author || 'Anônimo'}}</span>
              </div>
              <div v-if="obra.tags?.length" class="mb-1 text-[11px] font-medium text-indigo-800 dark:text-indigo-500 truncate px-2 capitalize">
                #{{ obra.tags[0] }}
              </div>
              <div class="text-gray-800 dark:text-gray-400 text-[10px] flex items-center gap-1 mb-1  px-2">
                <Lucide icon="Eye" class="w-4 h-4 text-gray-600 dark:text-gray-400"/> {{ obra.views.toLocaleString() }}
              </div>
              <span v-if="obra.mature" class="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">+18</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
