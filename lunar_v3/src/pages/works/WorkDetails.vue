<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBooks } from '@/API/Api.v3';
import LoadCard from '../../base/loading/LoadCard.vue';

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
  user: { name?: string }; // você pode adaptar melhor isso
  votes: number;
}

interface capsData {
  comments: number,
  createdAt: string,
  reads: number,
  thumb: string,
  title: string,
  url: string,
  votes: number
}

const route = useRoute();
const router = useRouter();
const book = ref<booksData | null>(null);
const isLoading = ref(false);
const showModal = ref(false)
const capsId = ref('');
const wUser = ref('');
const capToSearch = ref('')


onMounted(async () => {
  const id = route.params.id as string;
  isLoading.value = true;
  book.value = await getBooks(id);
  isLoading.value = false;
});


function handleCapsId(cap: any) {
  const getUrl = cap.url;
  const splitId = getUrl.split('/')[3];
  const getNumberId = splitId.split('-')[0];
  capsId.value = getNumberId;
  showModal.value = true;
  capToSearch.value = cap.title
}

function handleSearchComments() {
  if (!wUser.value) return alert('Informe o nome do usuário do Wattpad!');
  router.push({ path: '/bot', query: { id: capsId.value, user: wUser.value, title: capToSearch.value } });
  showModal.value = false;
}


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
  <div class="p-6 mx-auto">
    <LoadCard v-if="isLoading" />

    <div v-else-if="book" class="bg-white rounded">
      <div class="flex flex-col md:flex-row p-4">
        <img
          :src="book.cover"
          alt="Capa do livro"
          class="w-60 h-2/3"
        />
        <div class="p-6 flex-1">
          <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold text-gray-800">
              {{ book.title }}
            </h1>
            <span
              v-if="book.completed"
              class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow"
            >
              ✔ Completo
            </span>
          </div>

          <p class="mt-2 text-sm text-gray-500">
            {{ book.describe }}
          </p>

          <div class="mt-4 flex gap-2 text-sm">
            <span
              :class="book.mature ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              class="px-2 py-1 rounded-full font-semibold"
            >
              {{ book.mature ? '+18' : 'Livre' }}
            </span>

            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {{ book.numCaps }} capítulos
            </span>

            <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
              {{ book.votes }} votos
            </span>

            <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold">
              {{ book.comments }} comentários
            </span>
          </div>

          <div class="mt-6 text-sm text-gray-500">
            Criado em: {{ formatDate(book.createdAt) }}<br />
            Leitura total: {{ book.readTotal }}<br />
            Autor: {{ book.user?.name || 'Desconhecido' }}
          </div>

          <div v-if="book.tags.length" class="mt-4">
            <h3 class="font-semibold text-sm text-gray-600">Tags:</h3>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="tag in book.tags"
                :key="tag"
                class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                #{{ tag }}
              </span>
            </div>
            
          </div>
        </div>
      </div>
      <div v-if="book?.caps?.length" class="px-10 pb-5">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Capítulos</h2>

        <ul class="divide-y divide-gray-200 rounded-lg overflow-hidden shadow-md border border-gray-300">
          <li
            v-for="cap in book.caps as capsData[]"
            :key="cap.url"
            class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition relative"
            @click="handleCapsId(cap)"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-sm font-semibold text-indigo-700">
                  {{ cap.title }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  Criado em: {{ formatDate(cap.createdAt) }}
                </p>
              </div>
              <div class="flex items-center justify-between gap-4 text-xs text-gray-500 text-right">
                <p>👁 {{ cap.reads }} leituras</p>
                <p>❤️ {{ cap.votes }} votos</p>
                <p>💬 {{ cap.comments }} comentários</p>
              </div>
            </div>            
          </li>
        </ul>


        <!--modal-->
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div class="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 border border-gray-200">
            <h2 class="text-lg font-bold text-gray-800 mb-4">
              Buscar Comentários do Wattpad
            </h2>

            <label class="block text-sm text-gray-600 mb-1" for="user-input">
              Nome de usuário:
            </label>
            <input
              id="user-input"
              v-model="wUser"
              type="text"
              placeholder="Ex: 3ricautora"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div class="mt-4 flex justify-end gap-2">
              <button
                @click="showModal = false"
                class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                @click="handleSearchComments"
                class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      Livro não encontrado.
    </div>
  </div>
</template>
