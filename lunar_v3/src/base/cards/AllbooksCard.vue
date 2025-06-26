<script setup lang="ts">
import { getBooks } from '@/API/Api.v3';
import { ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { mockUser } from './mock';
import LoadCard from '../loading/LoadCard.vue';
import Sort from '../filters/Sort.vue';

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
  tags: [string];
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
  genre: ''
})


const router = useRouter();
const emit = defineEmits<{
  (e: 'update-length', length: number): void;
}>();

const isAdm = ref()
const isLoading = ref(false)

const data = ref<booksData[]>([]);
const filteredData = ref<booksData[]>([]);


setInterval(async () => {
  for (const book of mockUser) {
    const result = await getBooks(book.id);

    const index = data.value.findIndex((item) => item.id === result.id);

    if (index !== -1) {
      
      data.value.splice(index, 1, result);
    } else {
      
      data.value.push(result);
    }
  }
}, 60 * 10 * 1000); 

watch(
  () => [searchFilter.search, searchFilter.genre],
  ([search, genre]) => {
    const query = search.toLocaleLowerCase().trim();
    const genreQuery = genre.toLocaleLowerCase().trim();

    filteredData.value = data.value.filter((book) => {
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

      return matchesSearch && matchesGenre;
    });

    emit('update-length', filteredData.value.length);
		console.log(filteredData.value)
  },
  { immediate: true }
);



onMounted(async () => {
	isLoading.value = true
  for (const book of mockUser) {
    const result = await getBooks(book.id);
    data.value.push(result);
  }
	isLoading.value = false
	emit('update-length', data.value.length)	
  filteredData.value = [...data.value];
});


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
</script>


<template>
	<div
		class="mb-1"
	>
		<Sort 
			@search:books="handleSearch"			
  		@filters:genre="handleGenreFilter"
		/>
	</div>
  <div class="border-t-2 border-purple-400 rounded-2xl">
		<div>
			<div 
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-1"
			>
				<div
					v-if="!isLoading"
					v-for="book in filteredData"
					:key="book.id"
					class="flex items-center flex-col bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 pt-2 cursor-pointer relative"
					@click="router.push(`/work/${book.id}`)"
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
					/>
					<span
						v-if="book.completed"
						class="absolute top-4 right-[-30px] w-[110px] rotate-45 bg-green-600 text-white text-[10px] font-bold text-center py-1 shadow-md z-10"
					>
						Completo
					</span>

					<div class="px-4 py-2 flex flex-col justify-between items-start h-full w-full">
						<h2 class="text-base font-semibold text-gray-800 line-clamp-1">
							{{ book.title }}
						</h2>
						<span class="text-xs font-semibold text-fuchsia-600 line-clamp-1">Autor(a): <span>@{{ book.user.userName }}</span></span>
						<p class="text-xs text-gray-500 line-clamp-2 mt-1">
							{{ book.describe }}
						</p>
						<div class="mt-2 w-full flex items-center justify-between text-[10px] text-gray-400">
							<span>📚 {{ book.numCaps }} caps</span>
							<span>💬 {{ book.comments }} comentários</span>
						</div>
						<div class="mt-1 text-[10px] text-gray-500">
							Criado em: {{ formatDate(book.createdAt) }}
						</div>
					</div>
				</div>


			</div>
		</div>
		<LoadCard 
			v-if="isLoading"
		/>
	</div>
</template>
