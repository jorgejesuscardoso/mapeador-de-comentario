<script setup lang="ts">
import { getBookLunarAuthor } from '@/API/OriginalLunarApi'
import Lucide from '@/base/lucide/Lucide.vue'
import { formatDate } from '@/base/utils/FormatDate'
import { toast } from '@/base/utils/toast'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from '../mock'

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
  contestEntry?: boolean   // Se participa do Lunar Contest
}

interface Notification {
  id: number
  message: string
  read: boolean
  date: string
  link?: string
}

// Mock de 20 notificações com data/hora
const notifications = ref<Notification[]>(notification)

const hasUser = ref(JSON.parse(localStorage.getItem('user')))

const books = ref<Book[]>([])
const loading = ref(true)
const user= ref('')
const router = useRouter()
const showNotify = ref(false)

async function fetchBooks() {
  try {
    loading.value = true
    const res = await getBookLunarAuthor(user.value)
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      books.value = [] // <-- limpa sempre
      return
    }

    books.value = res.data.filter(b => b && b.id) // só entra livro válido
  } catch (err) {
    console.error('Erro ao carregar livros', err)
    books.value = [] // evita lixo
  } finally {
    loading.value = false
  }
}

function goToChapters(bookId: string) {
  router.push(`/books/${bookId}/chapters`) // redireciona para exibição dos capítulos
}


let totalUnreadMessage = ref(0);

function updateUnreadCount() {
  totalUnreadMessage.value = notifications.value.filter(n => !n.read).length;
}

function markAsRead(id: number) {
  const notif = notifications.value.find(n => n.id === id);
  if (notif && !notif.read) {
    notif.read = true;
    updateUnreadCount(); // atualiza o contador imediatamente
  }
}

// inicializa contador
updateUnreadCount();

// se quiser manter watch para mudanças externas
watch(notifications, () => {
  updateUnreadCount();
});

watch(hasUser, (val) => {
  console.log(hasUser)
  if (!val?.token) {
    toast.error("Logue para poder acessar as suas histórias!")
    router.push('/login')
    return
  }
  user.value = val.user
  if (user.value) {
    fetchBooks()
  }
}, { immediate: true })


onMounted(() => {
  if (!hasUser.value?.token) {
    toast.error("Logue para poder acessar as suas histórias!")
    router.push('/login')
    return
  }
  fetchBooks()
})
</script>

<template>
  <div class="flex items-start lg:justify-end justify-center w-full mt-7 md:mt-10 min-h-screen bg-gray-50 px-4 py-10">
    <!-- wrapper em grid/flex -->
    <div class="flex flex-col md:flex-row items-start justify-between w-full lg:w-[80vw] xl:w-[83vw]">
      
      <!-- seção do autor -->
      <aside class="flex flex-col sm:flex-row md:flex-col w-full md:w-1/2 lg:w-[40%] xl:w-[30%] mb-6 md:mb-0 sm:pb-6 lg:pb-14 md:pb-0 md:min-h-screen min-h-[40vh] border-b-2 md:border-r-2 gap-x-4 md:gap-x-0 md:pr-6 md:mr-6">
        <!-- avatar + nome -->
        <div
          class="flex flex-col w-full sm:w-1/2 md:w-full"
        >
          <div class="flex items-center gap-3 mb-4">
            <img 
              :src="hasUser?.avatar" 
              alt="avatar" 
              class="w-16 h-16 rounded-full border object-cover"
            />
            <div>
              <h3 class="text-lg font-bold text-gray-800">@{{ user }}</h3>
              <p class="text-sm text-gray-500">{{hasUser?.name || ''}}</p>
            </div>
          </div>

          <!-- bio -->
          <p class="text-sm text-gray-600 leading-relaxed mt-2 mb-6">
            {{ hasUser?.description }}
          </p>

          <!-- métricas -->
          <div class="flex items-center justify-between max-w-52 text-sm font-semibold text-gray-700 mb-6">
            <span class="flex items-center gap-1">
              <Lucide icon="Users" class="w-4 h-4 text-violet-600" /> 1.2k seguidores
            </span>
            <span class="flex items-center gap-1">
              <Lucide icon="ThumbsUp" class="w-4 h-4 text-violet-600" /> 3.4k likes
            </span>
          </div>

          <!-- redes sociais -->
          <div class="flex gap-4 mb-6">
            <a href="#" class="text-violet-600 hover:text-violet-800">
              <Lucide icon="Twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-violet-600 hover:text-violet-800">
              <Lucide icon="Instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="text-violet-600 hover:text-violet-800">
              <Lucide icon="Globe" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- notificações -->
        <div class="border-t-2 py-6 sm:border-0 md:border-t w-full sm:w-1/2 md:w-full md:mt-4 relative">
          <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <Lucide icon="Bell" class="w-4 h-4 text-violet-700" /> 
            Notificações
            <span class="text-gray-400">({{ totalUnreadMessage }})</span>
          </h4>
          <div
            @click="showNotify = !showNotify"
          >
            <Lucide
              :icon="showNotify ? 'ChevronUp' : 'ChevronDown'"
              class="absolute right-4"
              :class="{
                'top-1/2 -translate-y-1/2': !showNotify,
                'top-2 translate-y-1/2': showNotify
              }"
            />
          </div>

          <ul 
            class="flex bg-black/40 rounded border-y-2 border-gray-300 p-1 flex-col gap-2 overflow-y-auto"
            :class="{
              'h-[60vh] lg:min-h-80': showNotify,
              'hidden': !showNotify
            }"
          >
            <li
              v-for="notif in notifications"
              :key="notif.id"
              @click="notif.link && markAsRead(notif.id)"
              class="text-xs"
              :class="['cursor-pointer p-2 rounded-md flex flex-col justify-between', notif.read ? 'bg-white text-gray-500' : 'bg-gray-300 text-gray-900']"
            >
              <div class="flex justify-between items-center">
                <span>{{ notif.message }}</span>
                <Lucide icon="ArrowRight" class="w-3 h-3 text-gray-500" />
              </div>
              <span class="text-[10px] text-gray-600 mt-1">{{ formatDate(notif.date) }}</span>
            </li>
          </ul>

          <p v-if="notifications.length === 0" class="text-xs text-gray-400 mt-2 text-center">
            Nenhuma notificação por enquanto.
          </p>
        </div>
      </aside>

      <!-- seção das obras (já existente) -->
      <div class="lg:w-7/12 w-full xl:w-2/3 md:w-1/2 pb-24 md:pb-0">
        <h2 class="text-2xl font-bold mb-8 text-gray-800">Minhas Obras Originais Lunar</h2>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center w-full h-1/2 text-violet-600">
          <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin" />
          <span class="mt-3 text-sm">Carregando...</span>
        </div>

        <!-- Sem livros -->
        <div v-else-if="books.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
          <Lucide icon="BookOpen" class="w-12 h-12 mb-4 text-gray-300" />
          <p class="text-center text-sm">
            Nenhuma obra encontrada por enquanto. <br />
            Quando você criar suas histórias, elas aparecerão aqui ✨
          </p>
        </div>

        <!-- Grid de livros -->
        <ul v-else class="flex flex-col gap-6 w-full">
          <li
            v-for="book in books"
            :key="book.id"
            class="bg-white w-full shadow hover:shadow-lg transition overflow-hidden flex"
          >
            <!-- capa -->
            <div
              class="relative overflow-hidden group cursor-pointer"
              @click="goToChapters(book.id)"
            >
              <img
                :src="book.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'"
                alt="Capa"
                class="w-32 aspect-[2/3]"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            <!-- corpo -->
            <div class="px-4 pb-4 flex flex-col flex-1">
              <div class="flex flex-col h-full">
                <h3
                  class="text-lg font-semibold text-gray-800 hover:underline cursor-pointer mb-1"
                  @click="goToChapters(book.id)"
                >
                  {{ book.name }}
                </h3>
                <p class="text-[10px] text-gray-700 font-medium">
                  Genêro: <span class="text-[#10f] font-semibold ml-1">{{ book.genre }}</span> 
                </p>
                <p class="text-xs text-gray-700 font-light font-mono mt-2 line-clamp-3">
                  {{ book.sinopse }}
                </p>
              </div>

              <!-- tags -->
              <div class="flex flex-wrap gap-2 my-3">
                <span
                  v-for="tag in book.tags"
                  :key="tag"
                  class="bg-violet-200 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  #{{ tag }}
                </span>
              </div>

              <!-- métricas -->
              <div class="w-fit gap-4 mt-auto flex text-[10px] text-gray-700 border-t pt-1">
                <span class="flex items-center gap-1">
                  <Lucide icon="Star" class="w-3 h-3" /> {{ book.votes?.toLocaleString() || 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <Lucide icon="MessageCircleMore" class="w-3 h-3" /> {{ book.commentsTotal?.toLocaleString() || 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <Lucide icon="Eye" class="w-3 h-3" /> {{ book.views?.toLocaleString() || 0 }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
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

