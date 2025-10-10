<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lucide from '@/base/lucide/Lucide.vue'
import { getBookLunarById } from '@/API/OriginalLunarApi'
import { toast } from '@/base/utils/toast'
import { genres } from './genres'
import formatNumber from '@/base/utils/FormatNumber'
import { formatDate } from '@/base/utils/FormatDate'

// TYPES
interface Chapter {
  id: string
  bookId?: string
  title: string
  views: number
  votes: number
  comments: any[]
  createdAt: string
  updatedAt: string
  status: string // 'published' | 'draft'
  wordsCount?: number
  order?: number
}

interface Book {
  id: string
  author: string
  name: string
  cover: string
  sinopse: string
  tags: string[]
  genre: string
  createdAt: string
  updatedAt: string
  mature: boolean
  status: string // 'ongoing' | 'complete'
  chapters?: Chapter[]
  views?: number
  votes?: number
  commentsTotal?: number
}

const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string

const loading = ref(true)
const book = ref<Book | null>(null)
const chapters = ref<Chapter[]>([])
const following = ref(false) // exemplo de estado "seguir obra"
const showFullSynopsis = ref(false)

const genreMap: Record<string,string> = Object.fromEntries(genres.map(g => [g.value, g.label]))

const genreLabel = (g: string) => genreMap[g] || g || '—'

const publishedChapters = computed(() => {
  return (chapters.value || [])
    .filter(c => c.status === 'published')
    .sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
})


function readingTimeEst(words = 0) {
  const wpm = 200
  return Math.max(1, Math.ceil((words || 0) / wpm))
}

async function fetchBook() {
  try {
    loading.value = true
    const res = await getBookLunarById(bookId)
    if (res.status === 200 && res.data) {
      const data = res.data
      book.value = {
        id: data.id,
        author: data.author,
        cover: data.cover,
        createdAt: data.createdAt,
        genre: data.genre,
        mature: data.mature,
        name: data.name,
        sinopse: data.sinopse,
        tags: data.tags || [],
        updatedAt: data.updatedAt,
        views: data.views || 0,
        votes: data.votes || 0,
        status: data.status || 'ongoing',
        chapters: data.chapters || [],
        commentsTotal: data.commentsTotal || 0,
      }
      chapters.value = data.chapters || []
      console.log('Book data:', book.value)
    } else {
      // fallback
      book.value = null
      chapters.value = []
    }
  } catch (err) {
    console.error(err)
    book.value = null
    chapters.value = []
  } finally {
    loading.value = false
  }
}

function goToChapter(ch: Chapter) {
  // ajustar rota conforme teu app — exemplo:
  router.push(`/v1/origins/read/${bookId}/${ch.id}`)
}

function handleFollow() {
  following.value = !following.value
  // aqui tu pode chamar API pra seguir/desseguir
}

function shareBook() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ title: book.value?.name || 'Obra', url }).catch(()=>{})
  } else {
    navigator.clipboard.writeText(url)
    // toast ou feedback visual pode ser adicionado
    toast.success('Link copiado para a área de transferência')
  }
}

onMounted(() => {
  fetchBook()
})
</script>

<template>
  <div class="flex items-center justify-end min-h-screen w-full bg-white dark:bg-[#000] text-gray-900 dark:text-gray-100 pb-24">
    <div class="md:mr-32 w-full md:w-[75vw] px-2 md:px-8 pt-6 md:pt-10">
      <div
        class="w-20"
      >
        <button @click="router.back()" class="text-sm text-gray-500 dark:text-gray-400 hover:underline flex items-center gap-1 mb-6">
          <Lucide icon="ArrowLeft" class="w-4 h-4" /> Voltar
        </button>
      </div>
      <!-- HERO / SUMMARY -->
      <section class="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-6">
        <!-- cover -->
        <div class="flex items-start col-span-1 justify-start ">
          <div class="md:w-[240px] shadow-xl rounded-lg overflow-hidden">
            <div v-if="loading" class="h-[380px] w-full flex items-center justify-center bg-gray-100 dark:bg-white/5">
              <Lucide icon="Image" class="w-10 h-10 text-gray-400" />
            </div>
            <img v-else :src="book?.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'" :alt="book?.name" class="md:w-[240px] md:h-[350px] object-cover"/>
          </div>
        </div>

        <!-- meta -->
        <div class="w-full md:col-span-2 mt-4 md:mt-0 flex flex-col gap-3">
          <div class="flex flex-col items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold leading-tight">
                {{ book?.name || 'Título indisponível' }} 
                <!-- Badge de status -->
                <span
                  v-if="book?.status"
                  class="inline-block items-center justify-center text-xs p-1 px-2 text-center align-middle rounded font-medium ml-2"
                  :class="book?.status === 'complete'
                    ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'
                    : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-50'"
                >
                  {{ book?.status === 'complete' ? 'Completa' : 'Em andamento' }}
                </span>
              </h1>
              <div class="flex gap-3 items-center mt-2">
                <button @click="router.push(`/v1/origins/author/${book?.author}`)" class="text-sm text-violet-700 dark:text-violet-300 font-medium hover:underline">
                  por {{ book?.author || 'Anônimo' }}
                </button>

                <span class="text-xs text-gray-500 dark:text-gray-400">•</span>

                <span class="text-xs text-gray-500 dark:text-gray-400">{{ genreLabel(book?.genre || '') }}</span>

                <span v-if="book?.mature" class="ml-2 inline-block text-xs bg-red-600 text-white px-2 py-0.5 rounded">+18</span>
              </div>
            </div>

            <!-- CTAs -->
            <div class="grid md:grid-cols-3 grid-cols-2 items-center gap-2">
              <button
                @click="() => { if(publishedChapters.length) goToChapter(publishedChapters[0]) }"
                :disabled="publishedChapters.length === 0 || loading"
                class="px-4 py-2 rounded-md bg-standard text-sm text-white font-semibold shadow-md disabled:opacity-60"
              >
                Iniciar Leitura
              </button>

              <button @click="handleFollow" class="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium" :class="following ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-white dark:bg-[#000] '">
                <Lucide icon="Heart" class="inline-block w-4 h-4 mr-1" /> {{ following ? 'Seguindo' : 'Seguir' }}
              </button>

              <button @click="shareBook" class="px-3 py-2 rounded-md border border-gray-300 text-sm">
                <Lucide icon="Share2" class="inline-block w-4 h-4 mr-1" /> Compartilhar
              </button>
            </div>
          </div>

          <!-- stats + tags -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <Lucide icon="Eye" class="w-4 h-4" /> <span>{{ formatNumber(book?.views) || 0 }} visualizações</span>
            </div>
            <div class="flex items-center gap-2">
              <Lucide icon="Star" class="w-4 h-4" /> <span>{{ formatNumber(book?.votes) || 0 }} curtidas</span>
            </div>
            <div class="flex items-center gap-2">
              <Lucide icon="Clock" class="w-4 h-4" /> <span>{{ publishedChapters.length }} capítulos</span>
            </div>

            <div class="ml-2 flex items-center gap-2 flex-wrap">
              <template v-for="t in book?.tags || []" :key="t">
                <span class="text-xs flex h-6 items-center justify-center p-2 bg-purple-200 dark:bg-white/6 rounded-full text-purple-800 dark:text-purple-700 capitalize">#{{ t }}</span>
              </template>
            </div>
          </div>

          <!-- sinopse -->
          <div class="bg-white dark:bg-[#0000] rounded-md mt-1 dark:border-[#ffffff10] shadow-sm">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span v-if="!loading">
                <template v-if="book?.sinopse">
                  <span v-if="showFullSynopsis">{{ book!.sinopse }}</span>
                  <span v-else>
                    {{ book!.sinopse }}
                  </span>
                </template>
                <template v-else>Sinopse indisponível</template>
              </span>
            </p>
          </div>
        </div>
      </section>

       <!-- CAPÍTULOS + RECOMENDADOS -->
      <section class="mt-10 flex flex-col lg:flex-row lg:items-start lg:gap-2">
        <!-- LISTA DE CAPÍTULOS -->
        <div class="flex flex-col w-full">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-xl font-semibold">Capítulos Disponíveis</h2>
            <span class="text-sm text-gray-500">{{ publishedChapters.length }} capítulo(s)</span>
          </div>

          <!-- loading -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin text-violet-600" />
          </div>

          <!-- empty state -->
          <div v-else-if="publishedChapters.length === 0" class="border border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Lucide icon="BookOpen" class="w-16 h-16 mx-auto text-gray-400" />
            <h3 class="text-lg font-semibold mt-4">Nenhum capítulo disponível</h3>
            <p class="text-sm text-gray-500 mt-2">
              O autor ainda não publicou capítulos desta obra. Volte mais tarde ou siga a obra para receber notificações.
            </p>
            <div class="mt-4 flex items-center justify-center gap-3">
              <button @click="handleFollow" class="px-4 py-2 rounded-md bg-violet-600 text-white">Seguir a obra</button>
              <button @click="shareBook" class="px-4 py-2 rounded-md border">Compartilhar</button>
            </div>
          </div>

          <!-- lista -->
          <div
            v-else
            class="w-full border border-gray-300 dark:border-white/10 shadow-xl rounded-xl h-fit custom-scrollbar"
          >
            <ul class="flex flex-col gap-0.5">
              <li
                v-for="(ch, i) in publishedChapters"
                :key="ch.id"
                class="first:rounded-t-xl last:rounded-b-xl  px-4 py-2 bg-white dark:bg-[#ffffff05] border-b border-gray-300 dark:border-[#ffffff10] transition flex flex-col"
              >
                <div class="flex items-start justify-between gap-4 relative">
                  <div>
                    <div class="text-xs text-gray-500">Capítulo {{ i + 1 }}</div>
                    <h3 class="text-base font-semibold mt-1 w-fit cursor-pointer hover:underline" @click="goToChapter(ch)">
                      {{ ch.title }}
                    </h3>
                    <div class="text-xs text-gray-500 mt-2 flex items-center gap-3">
                      <span class="flex items-center gap-1"><Lucide icon="Eye" class="w-4 h-4" /> {{ formatNumber(ch.views) }}</span>
                      <span class="flex items-center gap-1"><Lucide icon="Star" class="w-4 h-4" /> {{ formatNumber(ch.votes) }}</span>
                      <span class="flex items-center gap-1"><Lucide icon="MessageCircleMore" class="w-4 h-4" /> {{ formatNumber(ch.comments.length) }}</span>
                      <span class="block w-20"> ~ {{ readingTimeEst(ch.wordsCount) }} min</span>
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-2 absolute top-0 right-0">
                    <div class="text-xs text-gray-500">{{ formatDate(ch.updatedAt) }}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- ASIDE DE RECOMENDAÇÕES -->
        <aside class="md:w-8/12 mt-10 lg:mt-0 border dark:border-white/10 shadow-lg rounded-lg h-fit">
          <div class="sticky top-24 bg-white dark:bg-[#000] border border-gray-300 dark:border-[#ffffff10] rounded-lg shadow-md p-2 md:p-4">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Talvez você também goste</h3>
            <ul class="space-y-3">
              <li
                v-for="r in 6"
                :key="r"
                class="flex gap-3 items-start cursor-pointer bgo-gray-100 daork:bg-[#ffffff06] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition"
              >
                <!-- Capa -->
                <div class="w-[95px] h-[140px] rounded-md overflow-hidden bg-gray-200 dark:bg-white/5 flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp"
                    alt="Recomendação"
                    class="h-full w-full object-cover"
                  />
                </div>

                <!-- Infos -->
                <div class="flex flex-col justify-between">
                  <!-- Título e autor -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                      Obra recomendada {{ r }}
                    </h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400">por Autor Exemplo</span>
                  </div>

                  <!-- Metadados -->
                  <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-1">
                      <Lucide icon="Layers" class="w-3.5 h-3.5" />
                      <span>12 caps</span>
                    </div>

                    <span class="text-[11px] px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full font-medium">
                      Em andamento
                    </span>

                    <span
                      class="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      :class="r % 2 === 0
                        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                        : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'"
                    >
                      {{ r % 2 === 0 ? '+18' : 'Livre' }}
                    </span>
                  </div>

                  <!-- Sinopse -->
                  <p class="text-xs text-gray-700 dark:text-gray-300 leading-snug mt-2 line-clamp-3">
                    Em um mundo dominado pelas sombras, um jovem guerreiro busca a verdade sobre seu passado, enquanto enfrenta forças que desafiam os próprios deuses...
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </aside>

      </section>

    </div>
  </div>
</template>

<style scoped>
/* pequenas melhorias visuais */
</style>
