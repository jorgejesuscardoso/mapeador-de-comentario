<script setup lang="ts">
import { getBooks } from '@/API/Api.v3';
import { ref, onMounted, watch, reactive, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import LoadCard from '../loading/LoadCard.vue';
import FilterBar from '../filters/FilterBar.vue';
import { setCache, getCache } from '../cache/Cache';
import Lucide from '../lucide/Lucide.vue';
import { feed, getBooksAws } from '@/API/BookApi';

interface booksData {
  caps: [];
  comments: number;
	completed: boolean;
  cover: string;
  createdAt: string;
  describe: string;
  id: string;
  mature: boolean;
  numCaps: number;
  readTotal: number;
  tags: string[];
  title: string;
  url: string;
  user: {
		name: string,
		userName: string
	};
  votes: number;
}


const searchFilter = reactive({
  search: '',
  genre: '',
  style: ''
})

const sortType = ref('');
const showFilterBar = ref(true)

const router = useRouter();
const emit = defineEmits<{
  (e: 'update-length', length: number): void;
}>();

const isAdm = ref(inject('isAdmin'))
const retrying = ref(false);
const fetchError = ref(false);
const isLoading = ref(false)
const permanentFailure = ref(false);


const data = ref<booksData[]>([]);
const filteredData = ref<booksData[]>([]);


const sortPriority = (data: any) => {

  const prioridadeAutores = ['anna_fransa', '3ricautora', 'jcbushido'];

  data.sort((a, b) => {
    const prioridade = (userName: string) => {
      const index = prioridadeAutores.indexOf(userName.toLowerCase());
      return index !== -1 ? index : 999;
    };
    const prioridadeA = prioridade(a.user.userName);
    const prioridadeB = prioridade(b.user.userName);

    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

setInterval(async () => {
  const books = await fetchBooks();

  const currentIds = data.value.map(b => b.id).join(',');
  const newIds = books.map(b => b.id).join(',');
 
  if (currentIds !== newIds) {
    data.value = books;
    filteredData.value = [...books];
    emit('update-length', books.length);
    sortPriority(filteredData.value)
    setCache('books_cache_v1', books, 604800); // Salva o cache também
    console.log('🔄 Atualizado via setInterval');
  } else {
    console.log('📦 Nenhuma mudança detectada, cache mantido');
  }
}, 60 * 10 * 1000);

const activeFilters = computed(() => ({
  search: searchFilter.search.trim().toLowerCase(),
  genre: searchFilter.genre.trim().toLowerCase(),
  style: searchFilter.style.trim().toLowerCase(),
  sort: sortType.value.trim().toLowerCase()
}));

const handleSortBooks = ({ search, genre, style, sort }) => {
   if (data.value.length === 0) return;

    let result = data.value.filter((book) => {
      const completed = book.completed ? 'completo' : 'andamento';
      const mature = book.mature ? 'adulto' : 'geral';

      const matchesSearch = !search || (
        book.title.toLowerCase().includes(search) ||
        book.user.userName.toLowerCase().includes(search) ||
        book.tags.some((s) => s.toLowerCase().includes(search)) ||
        completed.includes(search) ||
        mature.includes(search)
      );

      const matchesGenre = !genre || book.tags.some((tag) =>
        tag.toLowerCase().includes(genre)
      );

      const matchesStyle = !style || book.tags.some((tag) =>
        tag.toLowerCase().includes(style)
      );

      return matchesSearch && matchesGenre && matchesStyle;
    });


    // 🔥 priorização
    if (!search && !genre && !style && !sort) {

      sortPriority(result)

    } else {
      // outros sorts
      if (sort === 'votes_desc') result.sort((a, b) => b.votes - a.votes);
      if (sort === 'votes_asc') result.sort((a, b) => a.votes - b.votes);
      if (sort === 'comments_desc') result.sort((a, b) => b.comments - a.comments);
      if (sort === 'comments_asc') result.sort((a, b) => a.comments - b.comments);
      if (sort === 'views_desc') result.sort((a, b) => b.readTotal - a.readTotal);
      if (sort === 'views_asc') result.sort((a, b) => a.readTotal - b.readTotal);
    }

    filteredData.value = result;
    emit('update-length', result.length);
}

watch(
  activeFilters,
  ({ search, genre, style, sort }) => {
   handleSortBooks({ search, genre, style, sort })
  },
  { immediate: true }
);

async function fetchBooks() {
  try {
    const book = await getBooksAws()
    const results = await  getBooks(book);

    return results;
  } catch (err) {
    console.error("Erro inesperado ao buscar livros:", err);
    return [];
  }
}


async function loadBooksNormally(cacheKey: string) {
  const timeoutLimit = 50000; // 50 segundos
  const retryInterval = 5000; // 5 segundos

  const startTime = Date.now();
  let books: booksData[] = [];

  while ((Date.now() - startTime) < timeoutLimit && books.length === 0) {
    books = await fetchBooks();
    if (books.length > 0) break;

    retrying.value = true;
    fetchError.value = true;
    await new Promise(res => setTimeout(res, retryInterval));
  }

  data.value = books;
  filteredData.value = [...books];
  sortPriority(filteredData.value)
  emit('update-length', books.length);

  if (books.length === 0) {
    permanentFailure.value = true;
  } else {
    setCache('books_cache_v1', books, 604800);
  }

  isLoading.value = false;
  retrying.value = false;
}


function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const handleSearch = (s: string) => {
  searchFilter.search = s;
};

const handleGenreFilter = (genre: string) => {
  searchFilter.genre = genre;
};

const handleClearFilter = () => {
  searchFilter.genre = '';
  searchFilter.search = '';
  searchFilter.style = '';
  sortType.value = '';
};

const handelSortBooks = (s: string) => {
  sortType.value = s;
};


/// Falta implementar a Logica - Ainda nao existe separação por estilo //////
const handleStyleFilter = (s: string) => {
  searchFilter.style = s
};
/// Falta implementar a Logica - Ainda nao existe separação por estilo //////

onMounted(async () => {
  
  isLoading.value = true;
  fetchError.value = false;
  retrying.value = false;
  
  const cacheKey = 'books_cache_v1';
  const cache = getCache(cacheKey);

  if (cache) {
    data.value = cache;
    filteredData.value = [...cache];
    emit('update-length', cache.length);
    isLoading.value = false;

    sortPriority(filteredData.value)

    // Atualização em segundo plano
    updateBooksInBackground(cacheKey, cache);
    
    window.scrollTo({ top: 0, behavior: 'smooth'})
    return;
  }

  // Se não tiver cache, faz fetch normal
  await loadBooksNormally(cacheKey);

  window.scrollTo({ top: 0, behavior: 'smooth'})
});


async function updateBooksInBackground(cacheKey: string, oldBooks: booksData[]) {
  const freshBooks = await fetchBooks();

  const oldIds = oldBooks.map(b => b.id).join(',');
  const freshIds = freshBooks.map(b => b.id).join(',');
  
  if ((oldIds !== freshIds) && freshIds) {
    data.value = freshBooks;
    filteredData.value = [...freshBooks];
    sortPriority(filteredData.value)
    emit('update-length', freshBooks.length);
    setTimeout(() => {      
      setCache(cacheKey, freshBooks, 604800);
    }, 60*1000)
    console.log('📥 Livros atualizados em segundo plano.');
  } else {
    console.log('✅ Livros do cache ainda válidos.');
  }
}


</script>


<template>
  <div
    class="p-4 lg:rounded-xl bg-[rgba(0,0,0,0.75)]"
  >
    <div
      @click="showFilterBar = !showFilterBar"    
      class="flex bg-[rgb(0,0,0,0.6)] w-fit p-2 mb-2 shadow-xl rounded-lg cursor-pointer"
    >
      <Lucide 
        icon="ListFilter"
        class="text-violet-200 w-3 h-3"
      />
      <Lucide 
        :icon="!showFilterBar ? 'ChevronDown' : 'ChevronUp'"
        class="text-violet-200 w-3 h-3"
      />
    </div>
    <div
      v-if="showFilterBar"
      class="mb-2 relative px-4 py-2 pb-3 shadow-lg rounded-xl"
    >
      <FilterBar 
        @clear="handleClearFilter"
        @search:books="handleSearch"			
        @filters:genre="handleGenreFilter"
        @filters:sort="handelSortBooks"
        @filters:style="handleStyleFilter"
        :total="filteredData.length"
      />
    </div>
    <div class="flex items-center justify-center w-full rounded-lg">
      <div>
        <div 
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1"
        >
          <div
            v-if="!isLoading"
            v-for="book in filteredData"
            :key="book.id"
            class="flex items-center flex-col bg-[rgb(0,0,0,0.9)] rounded-xl shadow-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 pt-2 cursor-pointer relative"
          >
            <span
              class="absolute top-4 left-2 text-xs font-semibold"
              :class="{
                'text-red-700': book.mature,
                'text-green-600': !book.mature
              }"
            >
              {{ book.mature ? '+18' : 'Livre' }}
            </span>
            <img
              :src="book.cover"
              alt="Book cover"
              class="w-44 h-60 object-cover"          
              @click="router.push(`/work/${book.id}`)"
            />
            <span
              v-if="book.completed"
              class="absolute top-4 right-[-30px] w-[110px] rotate-45 bg-green-600 text-white text-[10px] font-bold text-center py-1 shadow-md z-10"
            >
              Completo
            </span>

            <div class="px-4 py-2 flex flex-col justify-between items-start h-full w-full">
              <h2 
                class="text-base font-semibold text-gray-300 line-clamp-1"            
                @click="router.push(`/work/${book.id}`)"
              >
                {{ book.title }}
              </h2>
              <span class="text-xs font-semibold text-fuchsia-400 line-clamp-1">Autor(a): <span>@{{ book.user.userName }}</span></span>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1">
                {{ book.describe }}
              </p>
              <div class="mt-2 w-full flex items-center justify-between text-[10px] text-gray-400">
                <span>📚 {{ book.numCaps }} caps</span>
                <span v-if="book.user.userName != '3ricautora'">⭐ {{ book.votes }} votos</span>
                <span v-if="book.user.userName != '3ricautora'">💬 {{ book.comments }} comentários</span>
              </div>
              <div class="mt-1 text-[10px] text-gray-400">
                Criado em: {{ formatDate(book.createdAt) }}
              </div>
            </div>
          </div>


        </div>
      </div>
      <div
        class="flex flex-col items-center justify-center h-[50vh]"
      >
        <LoadCard 
          v-if="isLoading"
        />
        <div
          v-if="fetchError && retrying"
          class="text-center text-sm mt-4 text-red-500 max-w-[300px] mx-auto bg-red-100 p-3 rounded"
        >
          Falha ao obter dados. Re-tentando conexão com o servidor...
          <br />
          Isso pode levar até 50 segundos.
        </div>

        <div
          v-if="permanentFailure"
          class="text-center text-sm text-red-600 mt-4 max-w-[300px] mx-auto bg-red-100 p-3 rounded-lg"
        >
          Não foi possível carregar nenhum livro após múltiplas tentativas.
          <br />
          Verifique sua conexão ou entre em contato com o desenvolvedor para suporte.
        </div>

      </div>
    </div>
  </div>

</template>
