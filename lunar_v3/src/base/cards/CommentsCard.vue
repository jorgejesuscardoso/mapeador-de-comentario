<script setup lang="ts">
import { getComments, getParagraph } from '@/API/Api.v3';
import { ref, onMounted, watch } from 'vue';
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
const paragraphs = ref<any>([])
const idRefsToParagraphs = ref([])
const qtdParagraph = ref(0)

const paragraphStats = ref({
  '1º início': 0,
  '2º meio início': 0,
  '3º meio': 0,
  '4º meio fim': 0,
  '5º fim': 0
})


function goBack() {
  router.back();
}

async function getParagraphs() {
  const rawHtml = await getParagraph(id);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawHtml;

  const nodes = Array.from(tempDiv.querySelectorAll('p[data-p-id]'));

  qtdParagraph.value = nodes.length
  const parsed = nodes.map((el, index) => {
  const rawId = el.getAttribute('data-p-id') || `no-id-${index}`;
  const cleanId = rawId.replace(/\\+"/g, ''); // Remove \" escapado
    return {
      id: cleanId,
      content: el.innerHTML,
      index,
    };
  });

  paragraphs.value = parsed;
  return parsed;
}


watch(data, (val)=>{
  const a = val.map((s) => s.resource.resourceId)
  idRefsToParagraphs.value = a
})

// watch(data, (val)=>{
//   const v = idRefsToParagraphs.value.map((s) => s.split('_',2)[1])
//   console.log(v)
// })

watch([paragraphs, idRefsToParagraphs], () => {
  if (!paragraphs.value.length || !idRefsToParagraphs.value.length) return;

  const total = paragraphs.value.length;
  const sliceSize = Math.floor(total / 5);

  const slices = [
    paragraphs.value.slice(0, sliceSize),
    paragraphs.value.slice(sliceSize, sliceSize * 2),
    paragraphs.value.slice(sliceSize * 2, sliceSize * 3),
    paragraphs.value.slice(sliceSize * 3, sliceSize * 4),
    paragraphs.value.slice(sliceSize * 4)
  ];

  const labels = ['1º início', '2º meio início', '3º meio', '4º meio fim', '5º fim'];

  const counters: any = {
    '1º início': 0,
    '2º meio início': 0,
    '3º meio': 0,
    '4º meio fim': 0,
    '5º fim': 0
  };

  // Transforma os slices em conjuntos de IDs dos parágrafos
  const sliceIdSets = slices.map(slice =>
    new Set(slice.map(paragraph => paragraph.id))
  );

  // Agora compara os ids dos comentários com os ids dos parágrafos de cada bloco
  const splited = idRefsToParagraphs.value.map((s) => s.split('_',2)[1])
  splited.forEach((refId) => {
    sliceIdSets.forEach((idSet, index) => {
      if (idSet.has(refId)) {
        counters[labels[index]]++;
      }
    });
  });

  paragraphStats.value = counters;
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

const handleGetComments = async () => {
  isLoading.value = true;

  const comments = await getComments(wUser.trim(), id); // já filtra por user se quiser

  await getParagraphs();

  data.value = comments;

  window.scrollTo({ top: 0 });
  isLoading.value = false;
  
}

onMounted(async () => {
  await handleGetComments()
});

</script>


<template>
  <div
    class="flex flex-col items-center min-w-full justify-center mt-10"
  >
    <header
      class="w-full"
    >
      <div
        class="flex flex-col bg-white mx-4 my-1 py-4 px-2 rounded-xl shadow-lg"
      > 
        <div
          class="grid grid-cols-2 w-full"
        >
          <div
            class="flex flex-col gap-1.5"
          >
            <span
              class="flex items-center justify-start mx-4 font-semibold text-indigo-800 text-sm"
            >
              <Lucide
                icon="UserCircle"
                class="mr-1 w-4 h-4"
              />
              User: <span class="font-bold text-fuchsia-600 ml-0.5 text-sm">{{ wUser }}</span>
            </span>
            <span
              class="flex items-center justify-start mx-4 font-semibold text-indigo-800 text-sm"
            >
              <Lucide
                icon="FileText"
                class="mr-1 w-4 h-4"
              />
              Capitulo: <span class="font-bold text-fuchsia-600 ml-0.5 text-sm">{{ title }}</span>
            </span>
            
            <span
              class="flex items-center justify-start mx-4 font-semibold text-indigo-800 text-sm"
            >
              <Lucide
                icon="BookOpenText"
                class="mr-1 w-4 h-4"
              />
              Livro: <span class="font-bold text-fuchsia-600 ml-0.5 text-sm">{{ bookName }}</span>
            </span>

            <span
              class="flex items-center justify-start mx-4 font-semibold text-indigo-800 text-sm"
            >
              <Lucide
                icon="AlignLeft"
                class="mr-1 w-4 h-4"
              />
              Qtd. parágrafos: <span class="font-bold text-fuchsia-600 ml-0.5 text-sm">{{ qtdParagraph }}</span>
            </span> 

            <span
              class="flex items-center justify-start mx-4 font-semibold text-indigo-800 text-sm"
            >
              <Lucide
                icon="MessageSquareMore"
                class="mr-1 w-4 h-4"
              />
              Comentários: 
              <span class="font-bold text-fuchsia-600 ml-0.5 text-sm">{{ data.length }}</span>
            </span>
          </div>

          
          <div>
            <ul class="text-sm text-gray-800 ml-4 mt-2">
              <li class="font-semibold text-violet-800">Distribuição dos comentários:</li>
              <li v-for="(count, label) in paragraphStats" :key="label">
                {{ label }}: <span class="font-bold text-pink-600">{{ count }}</span> comentário(s)
              </li>
            </ul>
          </div>
        </div>

        <span
          @click="goBack"
          class="flex items-center justify-start ml-4 mt-6 text-xs text-pink-600 cursor-pointer"
        >
          <Lucide
            icon="ArrowLeft"
            class="w-4 h-4"
          />
          Voltar para todos capítulos
        </span>
        <div
          class="w-full px-6 mt-6"
        >
          <button
            class="text-fuchsia-600 cursor-pointer border border-purple-500 px-4 py-1 rounded-lg"
            @click="handleGetComments"
          >
            <Lucide
              icon="RefreshCcw"
              class="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </header>
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 p-4 min-w-full"
    >
      <div
        v-if="!isLoading"
        v-for="(comment, index) in data"
        :key="index"
        class="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-xl transition duration-300"
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
