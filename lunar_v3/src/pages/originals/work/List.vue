<script setup lang="ts">
import { getBookLunarAuthor } from '@/API/OriginalLunarApi'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
  
  // Possíveis extensões futuras
  status?: 'draft' | 'published' | 'archived'  // Estado da obra
  rating?: number          // Média de avaliação (1-5)
  contestEntry?: boolean   // Se participa do Lunar Contest
}

const books = ref<Book[]>([])
const loading = ref(true)
const router = useRouter()

async function fetchBooks() {
  try {
    loading.value = true
    const res = await getBookLunarAuthor('Bushido') // <-- endpoint que retorna livros do user
   if(res.status !== 200){
    toast.warning("Nenhum livro encontrado!")
    return
   }

   books.value = res.data

  } catch (err) {
    console.error('Erro ao carregar livros', err)
  } finally {
    loading.value = false
  }
}

function goToChapters(bookId: string) {
  router.push(`/books/${bookId}/chapters`) // redireciona para exibição dos capítulos
}

onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <div class="flex items-start lg:justify-end justify-center w-full mt-10 min-h-screen bg-gray-50 px-6 py-10">
    <div class="lg:w-[80vw] xl:w-[85vw] w-full">
      <h2 class="text-2xl font-bold mb-8 text-gray-800">Minhas Obras Originais Lunar</h2>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center w-full h-1/2 text-violet-600">
        <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin" />
        <span class="mt-3 text-sm">Carregando...</span>
      </div>

      <!-- Sem livros -->
      <div v-else-if="books.length === 0" class="text-gray-400">Nenhuma obra encontrada.</div>

      <!-- Grid de livros -->
      <ul v-else class="flex gap-8 lg:w-1/2">
        <li
          v-for="book in books"
          :key="book.id"
          class="bg-whitie w-full shadow hover:shadow-xl transition overflow-hidden flex"
        >
          <!-- capa -->
          <div
            class="relative overflow-hidden group cursor-pointer"
            @click="goToChapters(book.id)"
          >
            <img
              :src="book.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'"
              alt="Capa"
              class="w-96"
            />
            <!-- overlay hover -->
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
          </div>

          <!-- corpo -->
          <div class="px-4 pb-4 flex flex-col">
            <div
              class="flex flex-col items-start justify-between h-full"
            >
              <div
                class="flex flex-col items-start h-full"              
              >
                <h3
                  class="text-lg font-semibold text-gray-800 hover:underline cursor-pointer mb-1"
                  @click="goToChapters(book.id)"
                >
                  {{ book.name }}
                </h3>
                <p class="text-[10px] text-gray-700 font-medium">
                  Genêro: <span class="text-[#10f] font-semibold ml-1"> {{ book.genre }}</span> 
                </p>

                <div
                  class="flex flex-col items-start justify-center h-full mt-2 mb-4"
                >
                  <p class="text-xs text-gray-700 font-light font-mono line-clamp-3">
                    {{ book.sinopse }}
                  </p>
                </div>
              </div>

              <!-- tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in book.tags"
                  :key="tag"
                  class="bg-violet-200 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- métricas -->
            <div class="w-fit gap-2 mt-auto flex justify-between text-[10px] text-gray-700 border-t font-bold0 pt-1">
              <span class="flex items-center gap-1">
                <Lucide icon="Star" class="w-3 h-3" /> {{ book.votes.toLocaleString() }}
              </span>
              <span class="flex items-center gap-1">
                <Lucide icon="MessageCircleMore" class="w-3 h-3" /> {{ book.commentsTotal.toLocaleString() }}
              </span>
              <span class="flex items-center gap-1">
                <Lucide icon="Eye" class="w-3 h-3" /> {{ book.views.toLocaleString() }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

