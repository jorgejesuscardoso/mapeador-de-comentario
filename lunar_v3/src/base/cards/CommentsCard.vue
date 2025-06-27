<script setup lang="ts">
import { getComments } from '@/API/Api.v3';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute} from 'vue-router';
import LoadCard from '../loading/LoadCard.vue';
import Lucide from '../lucide/Lucide.vue';

const route = useRoute();
const id = route.query.id as string;
const wUser = route.query.user as string;
const title = route.query.title as string;
const bookName = route.query.bookName as string;

const isAdm = ref()
const isLoading = ref(false)
const data = ref<any[]>([]);
const router = useRouter();

function goBack() {
  router.back();
}


function formatDate(dataISO: string): string {
  const dataComentario = new Date(dataISO);
  const agora = new Date();

  const diffMs = agora.getTime() - dataComentario.getTime(); // <- getTime() retorna number
  const diffHoras = diffMs / (1000 * 60 * 60);

  const hora = String(dataComentario.getHours()).padStart(2, '0');
  const minuto = String(dataComentario.getMinutes()).padStart(2, '0');

  if (diffHoras < 24) {
    return `Hoje às ${hora}:${minuto}`;
  } else if (diffHoras < 48 && agora.getDate() !== dataComentario.getDate()) {
    return `Ontem às ${hora}:${minuto}`;
  } else {
    const dia = String(dataComentario.getDate()).padStart(2, '0');
    const mes = String(dataComentario.getMonth() + 1).padStart(2, '0');
    const ano = dataComentario.getFullYear();
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  }
}

onMounted(async () => {
	isLoading.value = true
  const result = await getComments(wUser, id);
  data.value = result;
  window.scrollTo({top: 0})
	isLoading.value = false
});


</script>


<template>
  <div
    class="flex flex-col items-center justify-center mt-10"
  >
    <header
      class="w-full"
    >
      <div
        class="flex flex-col bg-white mx-4 my-1 py-4 px-2 rounded-2xl shadow-lg"
      > 
        <div
          class="flex flex-col"
        >
          <span
            class="mx-4 font-semibold text-indigo-700 text-sm"
          >
            User: <span class="font-bold text-violet-700 ml-2 text-sm">{{ wUser }}</span>
          </span>
          <span
            class="mx-4 font-semibold text-indigo-700 text-sm"
          >
            Capitulo: <span class="font-bold text-violet-700 ml-2 text-sm">{{ title }}</span>
          </span>
          
          <span
            class="mx-4 font-semibold text-indigo-700 text-sm"
          >
            Livro: <span class="font-bold text-violet-700 ml-2 text-sm">{{ bookName }}</span>
          </span>        
          <h3
            class="mx-4  font-semibold text-indigo-700 text-sm"
          >
            Comentários: 
            <span class="font-bold text-violet-700 ml-2 text-sm">{{ data.length }}</span>
          </h3>
        </div>
        <span
          @click="goBack"
          class="flex items-center justify-start ml-4 mt-6 text-xs text-violet-700 cursor-pointer"
        >
          <Lucide
            icon="ArrowLeft"
            class="w-4 h-4"
          />
          Voltar para todos capítulos
        </span>
      </div>
    </header>
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 p-4"
    >
      <div
        v-if="!isLoading"
        v-for="(comment, index) in data"
        :key="index"
        class="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-xl transition duration-300"
      >
        <!-- Header do usuário -->
        <div class="flex items-center gap-3">
          <img
            :src="comment.user.avatar"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p class="text-sm font-semibold text-fuchsia-800">
              {{ comment.user.name }}
            </p>
            <p class="text-xs text-violet-800">
              {{ formatDate(comment.created) }}
            </p>
          </div>
        </div>

        <!-- Corpo do comentário -->
        <div class="text-gray-600 text-sm mt-1">
          {{ comment.text }}
        </div>
      </div>
    </div>
		<LoadCard 
			v-if="isLoading"
		/>
	</div>
</template>
