<script setup lang="ts">
import { getBooks } from '@/API/Api.v3';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mockUser } from './mock';
import LoadCard from '../loading/LoadCard.vue';

const router = useRouter();
const emit = defineEmits<{
  (e: 'update-length', length: number): void;
}>();

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
  user: {};
  votes: number;
}
const isAdm = ref()
const isLoading = ref(false)

const data = ref<booksData[]>([]);

onMounted(async () => {
	isLoading.value = true
  for (const book of mockUser) {
    const result = await getBooks(book.id);
    data.value.push(result);
  }
	isLoading.value = false
	emit('update-length', data.value.length)
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
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-4"
		>
			<div
				v-if="!isLoading"
				v-for="book in data"
				:key="book.id"
				class="flex items-center flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 py-2 cursor-pointer relative"
				@click="router.push(`/work/${book.id}`)"
			>
			<span
				class="absolute top-4 left-4 font-semibold"
				:class="{
					'text-red-700': book.mature,
					'text-green-700': !book.mature
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
					class="absolute top-4 right-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold px-2 py-1"
				>
					Completo
				</span>

				<div class="p-4">
					<h2 class="text-xl font-semibold text-gray-800 line-clamp-1">
						{{ book.title }}
					</h2>
					<p class="text-sm text-gray-500 line-clamp-2 mt-1">
						{{ book.describe }}
					</p>
					<div class="mt-3 flex items-center justify-between text-xs text-gray-400">
						<span>📚 {{ book.numCaps }} caps</span>
						<span>💬 {{ book.comments }} comentários</span>
					</div>
					<div class="mt-3 text-xs text-gray-500">
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
