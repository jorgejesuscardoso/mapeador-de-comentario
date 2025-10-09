<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { createChapters, deleteChapterLunarById, getBookLunarById } from '@/API/OriginalLunarApi'

interface Chapter {
  id: string
  bookId: string
  title: string
  views: number
  votes: number
  comments: {}[]
  paragraphs: string
  createdAt: string
  updatedAt: string
  status: string 
  wordsCount: number
}

const isPremium = ref(false)
const isBeta = ref(false)

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
}
const idTodelete = ref('')
const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string

const goToChapter = (data: any) => {
  router.push(`/v1/origins/mywork/write/${bookId}/${data.id}`)
}

const deleteChapter = async () => {
  try {
    if(!idTodelete.value) {
      toast.error("Falha ao identificar o capítulo!")
      return
    }
    const response = await deleteChapterLunarById(bookId, idTodelete.value)
    if(response.status !== 200) {
      toast.error("Falha ao deletar capítulo!")
      isDelete.value = false
      return
    }
    toast.success("Capítulo deletado com sucesso!")
    isDelete.value = false
    fetchBook()
  } catch(err) {
    toast.error("Falha ao deletar capítulo!")
    isDelete.value = false
    console.error(err)
  }
}

const book = ref<Book | null>(null)
const chapters = ref<Chapter[]>([])
const loading = ref(true)
const newChapters = ref(false)
const isDelete = ref(false)

async function fetchBook() {
  try {
    loading.value = true
    const res = await getBookLunarById(bookId)
    if (res.status === 200 && res.data) {
      book.value = {
        id: res.data.id,
        author: res.data.author,
        cover: res.data.cover,
        createdAt: res.data.createdAt,
        genre: res.data.genre,
        mature: res.data.mature,
        name: res.data.name,
        sinopse: res.data.sinopse,
        tags: res.data.tags,
        updatedAt: res.data.updatedAt
      }
      chapters.value = res.data.chapters
    } else {
      toast.error('Erro ao carregar o livro ou capítulos')
    }
  } catch (err) {
    console.error(err)
    toast.error('Erro ao carregar dados do livro')
  } finally {
    loading.value = false
  }
}

const handleCreateNewChapters = async () => {
  loading.value = true
  newChapters.value = false
  toast.warning('Criando seu novo capítulo!')
  try {
    const response = await createChapters(bookId)
    if(response.status !== 201) {
      toast.error("Falha na criação do seu novo capítulo!")
      loading.value = false
      return
    }
    toast.success("Capítulo criado com sucesso!!!")
    loading.value = false
    fetchBook()
  } catch (err) {
    console.error(err)
    toast.error("Falha ao criar capítulo.")
    loading.value = false
  }

}

onMounted(() => {
  const storage = JSON.parse(localStorage.getItem('user')) || {}
  if(!storage || !storage.token || !storage.user) return
  isPremium.value = storage.licenses.some((s) => s === 'premium')
  isBeta.value = storage.licenses.some((s) => s === 'ebeta_tester')
  fetchBook()
})
</script>

<template>
  <div class="flex flex-col md:flex-row items-start justify-end w-full mt-14 bg-white dark:bg-[#000] gray-50 min-h-screen">
    <div
      class="md:hidden fixed z-40 top-16 left-3 mt-1 p-1"
      @click="router.back()"
    >
      <Lucide
        icon="ArrowLeft"
        class="dark:text-white/60 w-6 h-6 p-1 rounded-full dark:bg-white/20 text-white/90 bg-black/40"
      />
    </div>

    <!-- Modal de confirmação -->
    <div
      v-if="isDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-800">Deletar o capítulo?</h3>
        <p class="text-sm text-gray-600">
          Você está prestes a deletar um capítulo. Deseja continuar?
        </p>

        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="isDelete = false"
            class="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            @click="deleteChapter"
            class="px-3 py-1 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div
      v-if="newChapters"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">        
        
        <h3 class="text-lg font-bold text-gray-800">Criar novo capítulo?</h3>
        <p class="text-sm text-gray-600">
          Você está prestes a criar um capítulo em branco. Deseja continuar?
        </p>
        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="newChapters = false"
            class="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            @click="handleCreateNewChapters()"
            class="px-3 py-1 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
    <!-- Wrapper -->
    <div class="flex flex-col justify-end lg:flex-row gap-2 md:gap-8 w-full lg:w-[85vw] p-2 md:p-6">
      
      <!-- Capa -->
      <aside class="flex flex-col lg:w-1/4 xl:w-1/5 w-full justify-start max-h-[95vh]">
        <span
          v-if="loading"
          class="w-full max-w-md  md:shadow-lg object-cover border gap-3 text-gray-500 h-72 flex flex-col items-center justify-center bg-gray-100"
        >
          <Lucide
            icon="Image"
          />
          carregando a sua capa
        </span>
        <img 
          v-else
          :src="book?.cover || 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'" 
          alt="Capa do livro" 
          class="w-full max-w-md shadow-lg dark:shadow-black dark:border-none object-cover border shadow-gray-500"
        >
        </img>

        <!-- CTA Premium -->
        <div 
          v-if="!isPremium"
          class="w-full max-w-sm bg-standard dark:bg-standard-dark rounded-lg shadow-md p-4 text-center relative my-4 md:mt-1"
        >
          <h3 class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-50">
            Seja Premium 🚀
          </h3>
          <p class="text-sm text-white/90 mt-1">
            Ganhe mais visibilidade, vitrine exclusiva, destaque em campanhas e acesso antecipado às novidades.
          </p>
          <button 
            class="mt-3 px-4 py-2 rounded-md text-sm font-semibold bg-white text-violet-700 hover:bg-gray-100 transition"
          >
            Conheça as vantagens
          </button>
        </div>
      </aside>

      <!-- Lista de capítulos -->
      <main 
        class="lg:w-2/3 w-full min-h-screen flex flex-col gap-4 bg-white p-2 md:p-6 md:shadow-xl shadow-md border-gray-300 dark:shadow-none dark:bg-[#ffffff05] dark:border-none shadow-gray-400 border md:border-gray-100 rounded-lg"
        :class="{
          'mt-14': !isPremium
        }"
      >
        <div
          class="flex items-center justify-between pb-2 mb-2 border-b dark:border-[#ffffff10]"
        >
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Capítulos:</h2>
          <button
            class="flex items-center justify-center text-xs px-2 py-1 bg-standard text-white rounded font-semibold relative"
            @click="newChapters = true"
          >
            <div
              class="hidden dark:flex bg-[#0002] hover:bg-[#00000005] w-full h-full absolute"
            >
                <!-- Empty state -->
            </div>
            <Lucide
              icon="Plus"
              class="h-4 w-4"
            />
            NOVO CAPÍTULO
          </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center text-violet-600 py-20">
          <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin"/>
        </div>

        <ul v-else class="flex flex-col gap-1 md:gap-4">
          <li 
            v-for="chapter in chapters" 
            :key="chapter.id" 
            class="bg-white rounded shadow dark:border-none dark:bg-[#ffffff05]  border border-gray-300 md:border-gray-200 gap-6 p-3 flex items-center justify-between hover:shadow-xl transition relative"
          >
            <div
              class="absolute top-2 right-2"
              @click="isDelete = true, idTodelete = chapter.id"
            >
              <Lucide
                icon="X"
                :stroke-width="2"
                class="h-4 w-4 text-gray-600"
              />
            </div>
            <div>
              <Lucide
                icon="Menu"
                :stroke-width="2"
                class="h-8 w-8 text-gray-600 dark:text-gray-400"
              />
            </div>
          
            <!-- título -->
            <div
              class="w-full"
            >
              <h3 
                @click="goToChapter(chapter)"
                class="md:text-lg text-base font-semibold text-gray-800 cursor-pointer dark:text-gray-400"
              >
                {{ chapter.title }}
              </h3>
              

              <!-- métricas -->
              <div class="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-gray-500 mt-2 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <Lucide icon="Eye" fill="#eee" class="w-4 h-4"/> {{ chapter.views.toLocaleString() }}
                </span>
                <span class="flex items-center gap-1">
                  <Lucide icon="Star" fill="gray" class="w-4 h-4"/> {{ chapter.votes.toLocaleString() }}
                </span>
                <span class="flex items-center gap-1 ">
                  <Lucide icon="MessageCircleMore" fill="#eee" class="w-4 h-4"/> {{ chapter.comments.length.toLocaleString() }}
                </span>
                <span class="flex items-center font-semibold gap-1">
                  {{ chapter.status === 'published' ? 'Publicado' : 'Rascunho' }}: {{ new Date(chapter.updatedAt).toLocaleDateString() }}
                </span>
                <span>Palavras: {{ chapter.wordsCount || 0 }}</span>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="chapters.length === 0 && !loading" class="text-gray-400 text-center py-10">
          Nenhum capítulo encontrado ainda.
        </div>
      </main>
    </div>
  </div>
</template>
