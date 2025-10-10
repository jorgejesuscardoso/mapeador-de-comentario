<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookLunarById, getChapterLunarById } from '@/API/OriginalLunarApi'
import Lucide from '@/base/lucide/Lucide.vue'
import formatNumber from '@/base/utils/FormatNumber'

interface Chapter {
  id: string
  bookId?: string
  title: string
  views: number
  votes: number
  comments: any[]
  paragraphs: string // HTML
  createdAt: string
  updatedAt: string
  status: string // 'published' | 'draft'
  wordsCount?: number
  order?: number
}

// router / params
const route = useRoute()
const router = useRouter()
const bookId = (route.params.bookId as string) || ''
const chapterId = (route.params.chapterId as string) || ''

// estados
const loading = ref(true)
const bookData = ref<any>(null)
    // { bookName, cover, ... }
const chapter = ref<any>(null)     // { title, paragraphs, wordsCount, ... }
const title = ref<string>('')

// util: transformar HTML salvo em texto plano (seguro pra SSR)
function htmlToText(html: string): string {
  if (!html) return ''
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerText || ''
  }
  // fallback simples para ambientes sem DOM
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// computed: texto limpo / contadores
const plainText = computed(() => htmlToText(chapter.value?.paragraphs || ''))
const wordCount = computed(() => {
  const t = (plainText.value || '').trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
})
const charCount = computed(() => (plainText.value || '').length)

// lifecycle: buscar dados
onMounted(async () => {
  loading.value = true
  try {
    // busca capítulo e livro em paralelo
    const [chapterRes, bookRes] = await Promise.all([
      getChapterLunarById(bookId, chapterId),
      getBookLunarById ? getBookLunarById(bookId) : Promise.resolve({ status: 404 })
    ])

    if (chapterRes?.status === 200) {
      chapter.value = chapterRes.data
      title.value = chapter.value?.title || ''
      console.log(chapter.value)
    } else {
      // fallback mínimo
      chapter.value = { paragraphs: '', title: '' }
      title.value = ''
      console.warn('Capítulo não encontrado', chapterRes)
    }

    if (bookRes?.status === 200) {
      bookData.value = bookRes
    } else {
      // se a API de book não existir ou retornar 404, tentamos extrair do chapter (caso tenha)
      bookData.value = {
        bookName: chapter.value?.bookName || '',
        cover: chapter.value?.cover || ''
      }
    }
  } catch (err) {
    console.error('Erro ao carregar capítulo/livro:', err)
    // mantém objetos vazios pra evitar crashes no template
    if (!chapter.value) chapter.value = { paragraphs: '', title: '' }
    if (!bookData.value) bookData.value = { bookName: '', cover: '' }
  } finally {
    loading.value = false
  }
})

// helpers de navegação
function goBack() {
  router.back()
}

function goToBook() {
  router.push(`/v1/origins/book/${bookId}`)
}

// exportados (script setup já acidentalmente "exporta" tudo usado no template)
</script>


<template>
  <div class="w-full min-h-screen flex flex-col bg-white dark:bg-[#000]">
    <!-- HEADER -->
    <header class="w-full sticky top-14 z-20 bg-white border-b dark:border-[#ffffff10] shadow-sm md:px-6 p-1 md:py-3 flex items-center justify-between dark:bg-[#000]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-14">
          <img
            :src="bookData?.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'"
            alt="Capa"
            class="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <div class="font-bold text-gray-800 text-base md:text-lg dark:text-gray-300">
            {{ bookData?.bookName }}
          </div>
          <div class="font-semibold text-gray-800 text-xs md:text-sm dark:text-gray-400">
            {{ title || 'Capítulo sem título' }}
          </div>
          <div class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
            {{ wordCount }} palavras • {{ charCount }} caracteres
          </div>
        </div>
      </div>
    </header>

    <!-- BODY -->
    <div class="flex flex-col lg:flex-row w-full max-w-7xl mx-auto md:px-4  py-8 gap-6">     

      <!-- LEft ASIDE -->
      <aside class="hidden lg:block lg:w-3/12 pr-1 lg:border-r border-[#00000030] dark:border-white/10">
        <div class="sticky top-52 space-y-6">
          <div class="border dark:border-white/10 rounded-lg shadow-md bg-white dark:bg-[#000] p-4">
            <h3 class="text-lg font-semibold mb-4 dark:text-gray-200">Espaço futuro</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Aqui vai ter comentários, estatísticas, ranking, notas do autor, ou propaganda.
            </p>
          </div>
        </div>
      </aside>

      <!-- MAIN READING AREA -->
      <main class="flex py-8 justify-center w-5/12">
        <div class="flex flex-col items-center justify-start ">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-[#ddd] text-center mb-1">
            {{ chapter?.title || 'Capítulo sem título' }}
          </h2>
          <!-- Metricas views votes comments reais-->
          <div class="flex justify-center gap-6 mb-32 text-gray-500 dark:text-gray-400 text-xs">
            <div class="flex items-center gap-1">
              <Lucide icon="Eye" class="w-4 h-4" />
              <span>{{ formatNumber(chapter?.views) || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Lucide icon="Star" fill="#777" class="text-[#777] w-4 h-4" />
              <span>{{ formatNumber(chapter?.votes) || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Lucide icon="MessageCircleMore"  class="w-4 h-4" />
              <span>{{ formatNumber(chapter?.comments?.length) || 0 }}</span>
            </div>
          </div>
          <article 
            v-if="!loading" 
            class="prose prose-lg dark:prose-invert dark:text-[#ccc] max-w-none font-serif leading-relaxed"
            v-html="chapter?.paragraphs"
          />

          <div v-else class="text-center text-gray-500 dark:text-gray-400">Carregando capítulo...</div>
        </div>
      </main>

      <!-- ASIDE DE RECOMENDAÇÕES -->
      <aside class="md:w-3/12 mt-10 lg:mt-0 h-fit border-t lg:border-t-0 pt-6 lg:pt-0 lg:border-l border-[#00000030] dark:border-white/10">
        <div class="sticky top-24 bg-white dark:bg-[#000] rounded-lg shadow-md px-4 md:p-4">
          <h3 class="text-xl font-semibold mb-4 dark:text-gray-300">Leia também</h3>
          <ul class="space-y-3">
            <li
              v-for="r in 6"
              :key="r"
              class="flex gap-3 items-start cursor-pointer bgo-gray-100 daork:bg-[#ffffff06] hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <!-- Capa -->
              <div class="w-[66px] h-[98px] overflow-hidden bg-gray-200 dark:bg-white/5 flex-shrink-0">
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
                </div>

                <!-- Metadados -->
                <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-100">
                  <div class="flex items-center gap-1">
                    <Lucide icon="Eye" class="w-3.5 h-3.5" />
                    <span>{{ 314 * r }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Lucide icon="Star" fill="#777" class="text-[#777] w-3.5 h-3.5" />
                    <span>{{ 13 * 3 * 7 * r }}</span>
                  </div>
                </div>

                <!-- Sinopse -->
                <p class="text-xs text-gray-700 dark:text-gray-300 leading-snug mt-2 line-clamp-2">
                  Em um mundo dominado pelas sombras, um jovem guerreiro busca a verdade sobre seu passado, enquanto enfrenta forças que desafiam os próprios deuses...
                </p>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

