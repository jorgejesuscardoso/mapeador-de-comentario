<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { getBookLunarById } from '@/API/OriginalLunarApi'

// Interfaces
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

// Estado
const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string

const book = ref<Book>({
  id: '',
  name: '',
  author: '',
  cover: '',
  sinopse: '',
  tags: [],
  genre: '',
  createdAt: '',
  mature: false,
  updatedAt: ''
})

const chapters = ref<Chapter[]>([])
const loading = ref(true)

// API
async function fetchBook() {
  try {
    loading.value = true
    const res = await getBookLunarById(bookId)
    if (res.status === 200 && res.data) {
      const work = {
        author: res.data.author,
        cover: res.data.cover,
        createdAt: res.data.createdAt,
        genre: res.data.genre,
        id: res.data.id,
        mature: res.data.mature,
        name: res.data.name,
        sinopse: res.data.sinopse,
        tags: res.data.tags,
        updatedAt: res.data.updatedAt        
      } as Book
      book.value = work
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

// Ações do capítulo
function editChapter(chapterId: string) {
  router.push(`/v1/mywork/edit/${chapterId}`)
}

function togglePublish(chapter: Chapter) {
  chapter.status = chapter.status === 'published' ? 'draft' : 'published'
  toast.success(`Capítulo ${chapter.status === 'published' ? 'publicado' : 'despublicado'}!`)
}

function deleteChapter(chapterId: string) {
  chapters.value = chapters.value.filter(c => c.id !== chapterId)
  toast.success('Capítulo deletado!')
}

// Inicializa
onMounted(() => {
  fetchBook()
})
</script>

<template>
  <div class="flex items-start justify-end w-full mt-14 p-6 bg-gray-50 min-h-screen">
    <!-- Container principal em duas colunas -->
    <div class="flex flex-col lg:flex-row gap-8 w-full lg:w-[80vw] xl:w-[85vw]">
      
      <!-- Aside do livro -->
      <aside class="lg:w-1/2 w-full bg-white p-4 rounded-md shadow flex flex-col gap-4">
        <h2 class="text-xl font-bold text-gray-800 mb-2">Detalhes do Livro</h2>
        
        <!-- Capa -->
        <div class="flex justify-center mb-4">
          <img :src="book?.cover" alt="Capa do livro" class="w-32 h-48 object-cover rounded-md border"/>
        </div>

        <!-- Título -->
        <input v-model="book.name" type="text" placeholder="Título" class="border px-2 py-1 rounded w-full text-gray-800"/>

        <!-- Sinopse -->
        <textarea v-model="book.sinopse" placeholder="Sinopse" class="border px-2 py-1 rounded w-full text-gray-800 resize-none"></textarea>

        <!-- Tags -->
        <input 
          v-model="book.tags" 
          type="text" 
          placeholder="Tags (separadas por vírgula)" 
          class="border px-2 py-1 rounded w-full text-gray-800"
        />

        <!-- Gênero -->
        <input v-model="book.genre" type="text" placeholder="Gênero" class="border px-2 py-1 rounded w-full text-gray-800"/>

        <button class="bg-violet-600 hover:bg-violet-700 text-white py-2 rounded mt-2">
          Salvar Alterações
        </button>
      </aside>

      <!-- Lista de capítulos -->
      <main class="lg:w-2/3 w-full flex flex-col gap-4">
        <h2 class="text-xl font-bold text-gray-800 mb-2">Capítulos</h2>

        <div v-if="loading" class="flex items-center justify-center text-violet-600 py-20">
          <Lucide icon="RefreshCw" class="w-12 h-12 animate-spin"/>
        </div>

        <ul v-else class="flex flex-col gap-4">
          <li 
            v-for="chapter in chapters" 
            :key="chapter.id" 
            class="bg-white rounded-md shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition"
          >
            <!-- infos -->
            <div class="flex flex-col flex-1 gap-1">
              <h3 class="text-lg font-semibold text-gray-800">{{ chapter.title }}</h3>
              <p class="text-xs text-gray-500">Criado: {{ new Date(chapter.createdAt).toLocaleDateString() }}</p>
              <p class="text-xs text-gray-500">Atualizado: {{ new Date(chapter.updatedAt).toLocaleDateString() }}</p>
              <p class="text-xs text-gray-500">Palavras: {{ chapter.wordsCount }}</p>
            </div>

            <!-- métricas -->
            <div class="flex gap-4 text-gray-700 text-xs items-center">
              <span class="flex items-center gap-1"><Lucide icon="Eye" class="w-3 h-3"/> {{ chapter.views }}</span>
              <span class="flex items-center gap-1"><Lucide icon="Star" class="w-3 h-3"/> {{ chapter.votes }}</span>
              <span class="flex items-center gap-1"><Lucide icon="MessageCircleMore" class="w-3 h-3"/> {{ chapter.comments.length }}</span>
            </div>

            <!-- ações -->
            <div class="flex gap-2 text-xs">
              <button @click="editChapter(chapter.id)" class="text-blue-600 hover:underline">Editar</button>
              <button @click="togglePublish(chapter)" class="text-green-600 hover:underline">
                {{ chapter.status === 'published' ? 'Despublicar' : 'Publicar' }}
              </button>
              <button @click="deleteChapter(chapter.id)" class="text-red-600 hover:underline">Deletar</button>
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

<style scoped>
textarea { min-height: 80px; }
</style>
