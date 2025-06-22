<script setup lang="ts">
import { getBooks, getComments } from '@/API/Api.v3';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoadCard from '../loading/LoadCard.vue';
import { defineProps } from 'vue';

const props = defineProps<{
  propId: string;
  propUser: string;
  propTitle: string;
}>();


const router = useRouter();

interface commentsData {
  commentId: {
    resourceId: string
  };
  created: string;
  text: string;
  user: {
    avatar: string;
    name: string
  }
}
const isAdm = ref()
const isLoading = ref(false)
const wUser = ref('')
const data = ref<any[]>([]);

onMounted(async () => {
	isLoading.value = true
  const result = await getComments(props.propUser,props.propId);
  data.value = result;
  
	isLoading.value = false
});


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
</script>


<template>
  <div>
    <header>
      <div
        class="flex flex-col"
      >
        <h3
          class="mx-4 mt-4 font-semibold text-gray-800"
        >
          Quantidade de comentários encontrados: {{ data.length }}
        </h3>
        <span
          class="mx-4 font-semibold text-gray-800 text-sm"
        >
          Buscou por: <span class="font-bold text-purple-700 ml-2 text-base">{{ propUser ? propUser : wUser }}</span>
        </span>
        <span
          class="mx-4 font-semibold text-gray-800 text-sm"
        >
          No capitulo: <span class="font-bold text-purple-700 ml-2 text-base">{{ propTitle }}</span>
        </span>
      </div>
    </header>
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-4"
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
            <p class="text-sm font-semibold text-gray-800">
              {{ comment.user.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(comment.created) }}
            </p>
          </div>
        </div>

        <!-- Corpo do comentário -->
        <div class="text-gray-700 text-sm mt-1">
          {{ comment.text }}
        </div>
      </div>
    </div>
		<LoadCard 
			v-if="isLoading"
		/>
	</div>
</template>
