<!--bookcard do perfil para listar todos os livros que se é proprietario-->
<script setup lang="ts">
import Lucide from '@/base/lucide/Lucide.vue';
import { ref, onMounted, watch, watchEffect } from 'vue';
import { toRef } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps<{
  userId: string
  thirdUser?: boolean
}>()
const userId = toRef(props, 'userId')

const router = useRouter();

const allBooks = ref([])
const userBooks = ref([])
const isLoading = ref(false)
const showWork = ref(true)

// 👉 Filtra os livros do usuário recebido via props
function filterUserBooks() {
  if (!props.userId) return
  userBooks.value = allBooks.value.filter((book) => book.user.userName === props.userId)
}


function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

watchEffect(() => {
  props.userId
  filterUserBooks()
})

onMounted(async () => {
  isLoading.value = true

  try {
    const storage = localStorage.getItem('books_cache_v1')
    const parsedBooks = storage ? JSON.parse(storage) : []
    
    allBooks.value = parsedBooks.value
  } catch (e) {
    console.error('Erro ao carregar livros:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div 
    class="w-full"
  >
    <h2 
      class="flex justify-between text-base font-bold text-start text-white border-b border-purple-500 cursor-pointer"  
      @click="showWork = !showWork"    
    >
      {{ thirdUser ? `Obras de ${userId} no Lunar`: 'Suas obras na biblioteca Lunar' }}
      <Lucide
        :icon="!showWork ? 'ChevronDown' : 'ChevronUp'"
       />
    </h2>

    <div v-if="isLoading" class="text-gray-500">Carregando livros...</div>
    <div v-else-if="userBooks.length === 0" class="text-gray-400 italic">Nenhum livro encontrado.</div>

    <div 
      v-if="showWork && !isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
    >
      <div
        v-for="book in userBooks"
        :key="book.id"
        class="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition relative flex gap-4"
      >     
        <!-- Capa do livro -->
        <div>
          <img
            :src="book.cover"
            alt="Book cover"
            class="w-20 object-cover rounded-md cursor-pointer"
            @click="router.push(`/work/${book.id}`)"
          />
          <span
            v-if="book.completed"
            class="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded self-start shadow-sm w-full inline-block"
          >
            Completo
          </span>
        </div>
        <!-- Informações do livro -->
        <div class="flex flex-col justify-between w-full pr-2">  
          <!-- Título -->
          <h2
            class="flex items-center justify-between text-base font-semibold text-fuchsia-500 line-clamp-1 cursor-pointer"
            @click="router.push(`/work/${book.id}`)"
          >
            {{ book.title }}
             <!-- Selo +18 ou Livre -->
            <span
              class="text-sm font-semibold flex items-center justify-center"
              :class="{
                'text-red-700 bg-[rgb(255,255,255,0.9)] rounded-full h-8 w-8': book.mature,
                'text-green-600': !book.mature
              }"
            >
              {{ book.mature ? '+18' : 'Livre' }}
            </span>
          </h2>

          <!-- Autor -->
          <span class="text-xs font-semibold text-violet-400 line-clamp-1">
            Autor(a): <span>@{{ book.user.userName }}</span>
          </span>

          <!-- Descrição -->
          <p class="text-xs text-white line-clamp-2 mt-1">
            {{ book.describe }}
          </p>

          <!-- Métricas -->
          <div class="mt-2 w-full flex items-center justify-between text-[10px] text-gray-200">
            <span>📚 {{ book.numCaps }} caps</span>
            <span v-if="book.user.userName">⭐ {{ book.votes }} votos</span>
            <span v-if="book.user.userName">💬 {{ book.comments }} comentários</span>
          </div>

          <!-- Data de criação -->
          <div class="mt-1 text-[10px] text-indigo-400">
            Criado em: {{ formatDate(book.createdAt) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>