<script setup lang="ts">
import { ref, onMounted, watch, inject, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookDetail } from '@/API/Api.v3';
import LoadCard from '../../base/loading/LoadCard.vue';
import Lucide from '@/base/lucide/Lucide.vue';

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
  user: { name?: string, userName?: string }; // você pode adaptar melhor isso
  votes: number;
} 

interface capsData {
  comments: number,
  createdAt: string,
  reads: number,
  thumb: string,
  title: string,
  url: string,
  votes: number,
  length: number
}

const route = useRoute();
const router = useRouter();
const book = ref<booksData | null>(null);
const isLoading = ref(false);
const showModal = ref(false)
const capsId = ref('');
const wUser = ref('');
const capToSearch = ref<any>('')
const length = ref(0)
const isAdm = ref(inject('isAdmin'))
const modalRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  isLoading.value = true;
  book.value = await getBookDetail(id);
  isLoading.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' })
});

function goBack() {
  router.back();
}

const handleGetLength = (n: number) => {
  length.value = n
}

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
  router.push({ path: '/comments', query: { id: capsId.value, user: wUser.value, title: capToSearch.value, bookName: book.value.title, length: length.value } });
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

function handleClickOutside(event: MouseEvent) {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    showModal.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <div class="lg:p-6 mx-auto mt-3 lg:mt-4">
    <LoadCard v-if="isLoading" />

    <div v-else-if="book" class="bg-white rounded">
      <div class="flex flex-col md:flex-row p-4 relative">
        <div
          class="flex items-center gap-1 pb-1 text-xs border-b border-gray-300 lg:border-0 mb-4 text-purple-700 font-semibold lg:absolute lg:top-3 lg:left-4"  
        >
          <Lucide
            icon="ArrowLeft"
            class="h-4 w-4"        
            @click="goBack"
          />
          <h3        
            @click="goBack"
          >
            Voltar
          </h3>
        </div>
        <img
          :src="book.cover"
          alt="Capa do livro"
          class="lg:w-60 h-2/3 lg:mt-6"
        />
        <div class="lg:px-6 flex-1 my-4">
          <div class="flex justify-between items-center">
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

          <div class="mt-4 flex flex-wrap gap-2 text-sm">
            <span
              :class="book.mature ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              class="px-2 py-1 rounded-full font-semibold"
            >
              {{ book.mature ? '+18' : 'Livre' }}
            </span>

            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {{ book.numCaps }} capítulos
            </span>

            <span 
              v-if="book.user.userName != '3ricautora'"
              class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold"
            >
              {{  book.votes }} votos
            </span>

            <span 
              v-if="book.user.userName != '3ricautora'"
              class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold"
            >
              {{ book.comments }} comentários
            </span>
          </div>

          <div class="mt-6 text-sm font-semibold text-fuchsia-500">
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

      <div v-if="book?.caps?.length" class="p-2 lg:px-10 pb-5">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Capítulos</h2>

        <ul class="divide-y divide-gray-300 rounded overflow-hidden shadow-md border border-gray-300">
          <li 
            v-for="cap in book.caps as capsData[]"
            :key="cap.url"
            class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition relative"
            @click.stop="{ handleCapsId(cap); handleGetLength(cap.length)}"
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
              <div                
                v-if="book.user.userName != '3ricautora'"
                class="flex items-center justify-between gap-4 text-xs text-gray-500 text-right"
              >
                <p>👁 {{ cap.reads }} leituras</p>
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
          <div 
            ref="modalRef"
            class="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 border border-gray-200"
          >
            <h2 class="text-lg font-bold text-gray-800 mb-4">
              {{ isAdm ? 'Verificação de leitura' : 'Capítulo disponível no Wattpad' }}
            </h2>

            <!-- Formulário visível apenas para administradores -->
            <form v-if="isAdm" @submit.prevent="handleSearchComments">
              <label class="block text-sm text-gray-600 mb-1" for="user-input">
                Usuário a ser verificado:
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
                  type="button"
                  @click="showModal = false"
                  class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
                >
                  Buscar Comentários
                </button>
              </div>
            </form>

            <!-- Botão de leitura, disponível sempre -->
            <div :class="isAdm ? 'mt-6 border-t pt-4' : ''">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">
                {{ isAdm ? 'Ou abra o capítulo:' : 'Acesse o capítulo no Wattpad:' }}
              </h3>
              <a
                :href="`${(book?.caps.find((c: any) => c.title === capToSearch) as capsData )?.url }`"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block w-full text-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition"
              >
                📖 Ler Capítulo no Wattpad
              </a>
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
