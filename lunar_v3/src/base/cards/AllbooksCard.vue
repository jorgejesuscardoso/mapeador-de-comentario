<script setup lang="ts">
import { getBooks } from '@/API/Api.v3';
import { ref, onMounted, watch, reactive, inject } from 'vue';
import { useRouter } from 'vue-router';
import { mockUser } from './mock';
import LoadCard from '../loading/LoadCard.vue';
import FilterBar from '../filters/FilterBar.vue';
import { setCache, getCache } from './BookCache';
import Lucide from '../lucide/Lucide.vue';

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
const showFilterBar = ref(false)

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


setInterval(async () => {
  const books = await fetchBooks();

  const currentIds = data.value.map(b => b.id).join(',');
  const newIds = books.map(b => b.id).join(',');

  if (currentIds !== newIds) {
    data.value = books;
    filteredData.value = [...books];
    emit('update-length', books.length);
    setCache('books_cache_v1', books, 3600); // Salva o cache também
    console.log('🔄 Atualizado via setInterval');
  } else {
    console.log('📦 Nenhuma mudança detectada, cache mantido');
  }
}, 60 * 10 * 1000);


watch(
  () => [searchFilter.search, searchFilter.genre, searchFilter.style, sortType.value],
  ([search, genre, style]) => {

    if (data.value.length === 0) return;

    const query = search.toLocaleLowerCase().trim();
    const genreQuery = genre.toLocaleLowerCase().trim();
    const styleQuery = style.toLocaleLowerCase().trim();

    let result = data.value.filter((book) => {
      const completed = book.completed ? 'completo' : 'andamento';
      const mature = book.mature ? 'adulto' : 'geral';

      const matchesSearch = !query || (
        book.title.toLowerCase().includes(query) ||
        book.user.name.toLowerCase().includes(query) ||
        book.user.userName.toLowerCase().includes(query) ||
        book.tags.some((s) => s.toLowerCase().includes(query)) ||
        completed.includes(query) ||
        mature.includes(query)
      );

      const matchesGenre = !genreQuery || book.tags.some((tag) =>
        tag.toLowerCase().includes(genreQuery)
      );

      const matchesStyle = !styleQuery || book.tags.some((tag) =>
        tag.toLowerCase().includes(styleQuery)
      );

      return matchesSearch && matchesGenre && matchesStyle;
    });

    // Ordenação (mantida igual)
    if (sortType.value === 'votes_desc') result.sort((a, b) => b.votes - a.votes);
    if (sortType.value === 'votes_asc') result.sort((a, b) => a.votes - b.votes);
    if (sortType.value === 'comments_desc') result.sort((a, b) => b.comments - a.comments);
    if (sortType.value === 'comments_asc') result.sort((a, b) => a.comments - b.comments);
    if (sortType.value === 'views_desc') result.sort((a, b) => b.readTotal - a.readTotal);
    if (sortType.value === 'views_asc') result.sort((a, b) => a.readTotal - b.readTotal);

    filteredData.value = result;
    emit('update-length', result.length);
  },
  { immediate: true }
);


async function fetchBooks() {
  try {
    const results = await Promise.allSettled(
      mockUser.map(book => getBooks(book.id))
    );

    const successfulBooks = results
      .map((result, i) => {
        if (result.status === 'fulfilled') return result.value;
        console.warn(`Erro ao buscar o livro com ID ${mockUser[i].id}:`, result.reason);
        return null;
      })
      .filter(Boolean) as booksData[];

    return successfulBooks;
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
  emit('update-length', books.length);

  if (books.length === 0) {
    permanentFailure.value = true;
  } else {
    setCache('books_cache_v1', books, 3600);
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

    // Atualização em segundo plano
    updateBooksInBackground(cacheKey, cache);
    return;
  }

  // Se não tiver cache, faz fetch normal
  await loadBooksNormally(cacheKey);
});


async function updateBooksInBackground(cacheKey: string, oldBooks: booksData[]) {
  const freshBooks = await fetchBooks();

  const oldIds = oldBooks.map(b => b.id).join(',');
  const freshIds = freshBooks.map(b => b.id).join(',');

  if (oldIds !== freshIds) {
    data.value = freshBooks;
    filteredData.value = [...freshBooks];
    emit('update-length', freshBooks.length);
    setTimeout(() => {      
      setCache(cacheKey, freshBooks, 3600);
    }, 60*1000)
    console.log('📥 Livros atualizados em segundo plano.');
  } else {
    console.log('✅ Livros do cache ainda válidos.');
  }
}


</script>


<template>
  <div
    @click="showFilterBar = !showFilterBar"    
    class="flex bg-white w-fit p-2 mb-2 shadow-xl rounded-lg cursor-pointer"
  >
    <Lucide 
      icon="ListFilter"
      class="text-violet-700 w-3 h-3"
    />
    <Lucide 
      :icon="!showFilterBar ? 'ChevronDown' : 'ChevronUp'"
      class="text-violet-700 w-3 h-3"
    />
  </div>
	<div
    v-if="showFilterBar"
    class="mb-2 relative bg-white px-4 pt-5 pb-3 shadow-lg rounded-xl"
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
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-1"
			>
				<div
					v-if="!isLoading"
					v-for="book in filteredData"
					:key="book.id"
					class="flex items-center flex-col bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 pt-2 cursor-pointer relative"
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
              class="text-base font-semibold text-gray-800 line-clamp-1"            
					    @click="router.push(`/work/${book.id}`)"
            >
							{{ book.title }}
						</h2>
						<span class="text-xs font-semibold text-fuchsia-600 line-clamp-1">Autor(a): <span>@{{ book.user.userName }}</span></span>
						<p class="text-xs text-gray-500 line-clamp-2 mt-1">
							{{ book.describe }}
						</p>
						<div class="mt-2 w-full flex items-center justify-between text-[10px] text-gray-400">
							<span>📚 {{ book.numCaps }} caps</span>
							<span v-if="book.user.userName != '3ricautora'">⭐ {{ book.votes }} votos</span>
							<span v-if="book.user.userName != '3ricautora'">💬 {{ book.comments }} comentários</span>
						</div>
						<div class="mt-1 text-[10px] text-gray-500">
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

</template>
