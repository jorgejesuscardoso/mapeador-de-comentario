<script setup lang="ts">
import { ref, computed, onMounted, inject, watch, onBeforeUnmount } from "vue"
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

// Pega as top 6 obras pelo total de votos
const topVotadas = computed(() => {
  return [...obras.value]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);
});

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

function wheelDelegateHandler(e: WheelEvent) {
  // evita interferir quando usuário usa ctrl+scroll (zoom do browser)
  if (e.ctrlKey) return

  // pega o elemento sob o cursor (cliente)
  const x = typeof e.clientX === 'number' ? e.clientX : 0
  const y = typeof e.clientY === 'number' ? e.clientY : 0
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return

  // procura o container horizontal mais próximo
  const container = el.closest<HTMLElement>('.scroll-x, .overflow-x-auto')
  if (!container) return

  // só prossegue se houver overflow horizontal real
  if (container.scrollWidth <= container.clientWidth) return

  // queríamos rolar horizontalmente quando a intenção é vertical (deltaY maior)
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault() // necessário { passive: false } ao registrar
    // ajusta a sensibilidade se quiser (multiplicador)
    const multiplier = 0.5 // aumenta se quiser rolar mais/menos por tick
    container.scrollLeft += e.deltaY * multiplier
  }
}

onMounted(() => {
  // registra no window para pegar eventos mesmo que containers apareçam depois
  window.addEventListener('wheel', wheelDelegateHandler as EventListener, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', wheelDelegateHandler as EventListener)
})


</script>

<template>
  <div
    class="w-full dark:bg-[#000] bg-white min-h-screen mt-10 lg:mt-14 flex font items-start justify-end px-6"
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
        class="pb-28 seu-container mt-16"
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
        
        <!-- SEÇÃO PROMOCIONAL -->
        <div v-if="topVotadas.length" class="mb-14">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            🔥 As Mais Votadas
          </h2>
          <p
            class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-6 "
          >
            As 10 obras mais votadas pela comunidade Lunar! Essas histórias cativantes conquistaram o coração dos leitores e estão prontas para serem exploradas. Não perca a chance de ler as favoritas do momento!
          </p>

          <div class="flex gap-2 overflow-x-auto pb-4 scroll-x">
            <div 
              v-for="(obra, i) in topVotadas" 
              :key="obra.id" 
              class="relative cursor-pointer flex flex-col min-w-[140px]"
            >
              <!-- Capa -->
              <img 
                :src="obra.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'" 
                :alt="obra.name" 
                class="h-[210px] aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition"
              />

              <!-- Posição -->
               
                <span
                  :class="[
                    'absolute top-1 right-1 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg',
                    i === 0 ? 'bg-yellow-400 text-black' : '',   // 🥇 1º lugar
                    i === 1 ? 'bg-gray-300 text-black' : '',     // 🥈 2º lugar
                    i === 2 ? 'bg-orange-400 text-black' : '',   // 🥉 3º lugar
                    i > 2 ? 'bg-violet-400 text-black' : ''      // default
                  ]"
                >
                {{ i + 1 }}º
               </span>
               <!-- <span
                  class="absolute top-6 right-1 text-xs font-bold w-6 h-6 flex items-center justify-center"
                >
                {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }}
               </span> -->
              <!-- Info -->
              <div class="mt-2 px-1">
                <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-300 truncate">
                  {{ obra.name }}
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ⭐ {{ obra.votes.toLocaleString() }} votos
                </p>
              </div>

              <!-- Badge 18+ -->
              <span 
                v-if="obra.mature" 
                class="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                +18
              </span>
            </div>
          </div>
        </div>


        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            📚 Explorar por Gênero
          </h2>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Explore obras originais criadas pela comunidade Lunar, organizadas por gênero literário. Encontre histórias que combinam com seu gosto e descubra novos autores talentosos!
          </p>
        </div>

        <!-- SEÇÃO GÊNEROS -->
        <div v-for="(grupo, key, index) in generos" :key="key" class="mb-14">

          <!-- Cabeçalho do gênero -->
          <h3 class="font-semibold mb-1 text-gray-800 dark:text-gray-300">
            {{ grupo.label }}:
          </h3>

          <!-- Lista horizontal scroll -->
          <div class="flex gap-3 md:gap-2 overflow-x-auto scrollbar-hide py-2 scroll-x">
            <div 
              v-for="obra in grupo.books" 
              :key="obra.id" 
              class="flex flex-col cursor-pointer relative group"
            >
              <img 
                :src="obra.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'" 
                :alt="obra.name" 
                class="h-[210px] w-[140px] object-cover shadow-md shadow-black/30 rounded group-hover:shadow-xl transition"
              />
              
              <div class="my-2 text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate px-1">
                por: <span class="text-blue-700 dark:text-blue-500">{{ obra.author || 'Anônimo'}}</span>
              </div>
              <div v-if="obra.tags?.length" class="mb-1 text-[11px] font-medium text-indigo-800 dark:text-indigo-500 truncate px-1 capitalize">
                #{{ obra.tags[0] }}
              </div>
              <div class="text-gray-800 dark:text-gray-400 text-[10px] flex items-center gap-1 px-1">
                <Lucide icon="Eye" class="w-4 h-4"/> {{ obra.views.toLocaleString() }}
              </div>
              <span v-if="obra.mature" class="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">+18</span>
            </div>
          </div>

          <!-- BLOCO DE ADS/EVENTO A CADA 3 SEÇÕES -->
          <div v-if="(index + 1) % 4 === 0" class="my-10">
            <div class="w-full dark:bg-white/5 dark:text-white bg-black/20 text-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center justify-center text-center">
              <h4 class="text-lg font-bold mb-2">🌙 Evento Lunar Especial</h4>
              <p class="text-sm mb-4">Participe do próximo concurso de histórias e concorra a prêmios incríveis!</p>
              <button class="bg-white text-violet-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition">
                Saiba Mais
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
