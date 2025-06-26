<script setup lang="ts">
import { getBooks } from '@/API/Api.v3';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { mockUser } from './mock';
import LoadCard from '../loading/LoadCard.vue';

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
  tags: [];
  title: string;
  url: string;
  user: {
		name: string,
		userName: string
	};
  votes: number;
}

const router = useRouter();
const emit = defineEmits<{
  (e: 'update-length', length: number): void;
}>();

const props = defineProps<{ search: string }>()

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
  () => props.search,
  (val) => {
    const query = val.toLowerCase().trim();

    if (!query) {
      filteredData.value = [...data.value];
			emit('update-length', filteredData.value.length)	
    } else {
      filteredData.value = data.value.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.user.name.toLowerCase().includes(query) ||
          book.user.userName.toLowerCase().includes(query)
				);
			emit('update-length', filteredData.value.length)	
    }
  },
  { immediate: true } // <- já aplica no carregamento
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
</script>


<template>
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
		<LoadCard 
			v-if="isLoading"
		/>
	</div>
</template>
