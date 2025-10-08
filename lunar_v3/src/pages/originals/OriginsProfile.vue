<script setup lang="ts">
import { getBookLunarAuthor } from '@/API/OriginalLunarApi'
import Lucide from '@/base/lucide/Lucide.vue'
import { formatDate } from '@/base/utils/FormatDate'
import { toast } from '@/base/utils/toast'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from './mock'

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

const hasUser = ref(JSON.parse(localStorage.getItem('user')) || {})
const isBeta = ref(false)
const isPremium = ref(false)

const books = ref<Book[]>([])
const loading = ref(true)
const user= ref('')
const router = useRouter()

const showAll = ref(false)

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

function goToDetail(bookId: string) {
  router.push(`/v1/origins/mywork/detail/${bookId}`) // redireciona para exibição dos capítulos
}

function checkUser() {
  if (!hasUser.value?.token) {
    toast.error("Logue para poder acessar as suas histórias!")
    router.push('/login')
    return false
  }
  user.value = hasUser.value.user
  return true
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

const limitedNotifications = computed(() => {
  if (showAll.value) return notifications.value
  return notifications.value.slice(0, 3)
})

function toggleShowAll() {
  showAll.value = !showAll.value
}

// inicializa contador
updateUnreadCount();

// se quiser manter watch para mudanças externas
watch(notifications, () => {
  updateUnreadCount();
});

watch(hasUser, (val) => {
  checkUser()
  user.value = val.user
  if (user.value) {
    fetchBooks()
  }
}, { immediate: true })


const handlePermission = () => {
	if(!isBeta.value) return toast.error("Acesso antecipado apenas para testadores beta!")
	router.push('/v1/origins/work/create')
}

onMounted(() => {
})

onMounted(() => {
  checkUser()
  fetchBooks()
  if(!hasUser || !hasUser.value.token || !hasUser.value.user) return
  isPremium.value = hasUser.value.licenses.some((s) => s === 'premium')
  isBeta.value = hasUser.value.licenses.some((s) => s === 'beta_tester')
})
</script>

<template>
  <div class="flex flex-col md:flex-row dark:bg-[#000] items-start lg:justify-end justify-center w-full mt-7 md:mt-14 min-h-screen bg-gray-50 px-4 py-8">
    <div
      class="md:hidden p-1"
      @click="router.back()"
    >
      <Lucide
        icon="ArrowLeft"
        class="dark:text-white w-6 h-6 p-1 rounded-full dark:bg-white/40 text-black/70 bg-black/30"
      />
    </div>
    <!-- wrapper em grid/flex -->
    <div class="flex flex-col md:flex-row items-start justify-between w-full lg:w-[80vw] xl:w-[83vw] mt-2 md:mt-0">
      
      <!-- seção do autor -->
      <aside class="flex flex-col sm:flex-row md:flex-col w-full md:w-1/2 lg:w-[40%] xl:w-[30%] mb-6 md:mb-0 sm:pb-6 lg:pb-14 md:pb-0 md:min-h-screen min-h-[40vh] border-b-2 md:border-b-0 md:border-r-2 dark:border-[#ffffff10] gap-x-4 md:gap-x-0 md:pr-6 md:mr-6">
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
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-300">@{{ user }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{hasUser?.name || ''}}</p>
            </div>
          </div>

          <!-- bio -->
          <p class="text-sm text-gray-600 leading-relaxed mt-2 mb-6 dark:text-gray-400">
            {{ hasUser?.description }}
          </p>

          <!-- métricas -->
          <div class="flex items-center justify-between max-w-52 text-xs font-semibold text-gray-700 dark:text-gray-400 mb-6">
            <span class="flex items-center gap-1">
              <Lucide icon="Users" class="w-4 h-4 text-violet-600 dark:text-violet-500" /> {{ user === "jhony_1222" ? '117.7M seguidores' : '1.2k seguidores' }}
            </span>
            <span class="flex items-center gap-1">
              <Lucide icon="ThumbsUp" class="w-4 h-4 text-violet-600 dark:text-violet-500" /> 3.4k likes
            </span>
          </div>

          <!-- redes sociais -->
          <div class="flex gap-4 mb-6">
            <a href="#" class="text-violet-600 hover:text-violet-800 dark:text-violet-500">
              <Lucide icon="Twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-violet-600 hover:text-violet-800 dark:text-violet-500">
              <Lucide icon="Instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="text-violet-600 hover:text-violet-800 dark:text-violet-500">
              <Lucide icon="Globe" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- notificações -->
        <div class="border-t-2 py-6 sm:border-0 md:border-t dark:border-[#ffffff10] w-full sm:w-1/2 md:w-full md:mt-4  relative">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-400 mb-2 flex items-center gap-1 border-b-2 pb-2 dark:border-[#ffffff10]">
            <Lucide icon="Bell" class="w-4 h-4 text-violet-700 dark:text-violet-500" /> 
            Notificações
            <span class="text-gray-400 dark:text-gray-700">({{ totalUnreadMessage }}) fase de testes<span class="text-red-600">*</span></span>
          </h4>

          <ul class="flex flex-col gap-1 rounded overflow-y-auto">
            <li
              v-for="notif in limitedNotifications"
              :key="notif.id"
              @click="notif.link && markAsRead(notif.id)"
              class="text-xs relative cursor-pointer p-2 rounded-md flex flex-col justify-between"
              :class="notif.read 
                ? 'bg-white text-gray-600 border border-gray-300 dark:border-none dark:text-gray-400 dark:bg-gray-700' 
                : 'bg-gray-200 text-gray-900 dark:text-gray-300 dark:bg-gray-950'"
            >
              <div>
                <Lucide :icon="notif.read ? 'MailOpen' : 'Mail'" class="h-3 w-3 mb-2" />
              </div>
              <div class="flex justify-between items-center">
                <span class="px-2">{{ notif.message }}</span>
                <Lucide icon="ArrowRight" class="w-3 h-3 text-gray-600 dark:text-gray-200" />
              </div>
              <span class="text-[10px] text-gray-400 mt-3">{{ formatDate(notif.date) }}</span>
              <span
                v-if="notif.read"
                class="text-[9px] font-light text-gray-500 absolute bottom-1 right-2"
              >
                Lido
              </span>
            </li>
          </ul>

          <!-- botão ver mais -->
          <div v-if="notifications.length > 10" class="flex justify-center mt-2">
            <button
              @click="toggleShowAll"
              class="text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              {{ showAll ? 'Ver menos' : 'Ver todas' }}
            </button>
          </div>

          <p v-if="notifications.length === 0" class="text-xs text-gray-400 mt-2 text-center">
            Nenhuma notificação por enquanto.
          </p>
        </div>
      </aside>

      <!-- seção das obras (já existente) -->
      <div class="lg:w-7/12 w-full xl:w-2/3 md:w-1/2 pb-24 md:pb-0 relative">
        <h2 class="text-lg font-bold mb-8 text-gray-800 border-b pb-2 dark:border-[#ffffff10] dark:text-gray-400">Minhas Obras</h2>

        <div
          class="flex gap-5 absolute top-1 right-10 dark:text-gray-400"
        >
          <Lucide
            icon="Plus"
            class="w-5 h-5 cursor-pointer"
            :stroke-width="3"
            @click="handlePermission"
          />
          <Lucide
            icon="Ellipsis"
            class="cursor-pointer"
            :stroke-width="2"
          />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center w-full h-1/2 text-violet-600">
          <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin" />
          <span class="mt-3 text-sm ">Carregando...</span>
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
        <ul v-else class="flex flex-col gap-2 w-full">
          <li
            v-for="book in books"
            :key="book.id"
            class="bg-white dark:bg-[#ffffff06] w-full shadow hover:shadow-lg transition overflow-hidden flex"
          >
            <!-- capa -->
            <div
              class="relative overflow-hidden group cursor-pointer"
              @click="goToDetail(book.id)"
            >
              <img
                :src="book.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'"
                alt="Capa"
                class="w-32 aspect-[2/3]"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            <!-- corpo -->
            <div class="px-4 pb-4 pt-2 flex flex-col flex-1">
              <div class="flex flex-col h-full">
                <h3
                  class="text-base font-semibold text-gray-800 dark:text-gray-300 hover:underline cursor-pointer mb-1"
                  @click="goToDetail(book.id)"
                >
                  {{ book.name }}
                </h3>
                <p class="text-[10px] text-gray-700 font-medium dark:text-gray-400">
                  Genêro: <span class="text-[#10f] font-semibold ml-1 dark:text-blue-400">{{ book.genre }}</span> 
                </p>
                <p class="text-xs text-gray-700 font-normal mt-2 line-clamp-3 dark:text-gray-500">
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
              <div class="w-fit gap-4 mt-auto flex text-[10px] dark:text-gray-400 dark:border-[#ffffff40] text-gray-700 border-t pt-1">
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

