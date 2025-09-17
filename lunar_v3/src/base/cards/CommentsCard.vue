<script setup lang="ts">
import { getComments, getParagraph } from '@/API/Api.v3';
import { ref, onMounted, watch, inject } from 'vue';
import { useRouter, useRoute} from 'vue-router';
import LoadCard from '../loading/LoadCard.vue';
import Lucide from '../lucide/Lucide.vue';
import { toast } from '../utils/toast';

const route = useRoute();
const id = route.query.id as string;
const wUser = route.query.user as string;
const title = route.query.title as string;
const bookName = route.query.bookName as string;
const length = route.query.length as string;
const allCaps = ref([])

const isAdm = ref(inject('isAdmin'))
const isLoading = ref(false)
const data = ref<any[]>([]);
const router = useRouter();
const paragraphs = ref<any>([])
const idRefsToParagraphs = ref([])
const qtdParagraph = ref(0)
const readingApproved = ref(false)
const msgReadingPending = ref('')
const goodDivision = ref(false)
const times = ref({
  est: 0,
  wast: 0
})

const firstAndLastComments = ref<{
  first: any | null,
  last: any | null
 }>({
  first: null,
  last: null
});

const paragraphStats = ref({
  '1º início': 0,
  '2º meio': 0,
  '3º fim': 0
})


function goBack() {
  router.back();
}

const goNext = async () => {
  if (!allCaps.value || allCaps.value.length === 0) return

  // pega a lista linear (se você guardou array dentro de array no localStorage, pode precisar de .flat())
  const capsList = allCaps.value.flat ? allCaps.value.flat() : allCaps.value  

  const currentIndex = capsList.findIndex(c => c === id)
  if (currentIndex === -1) return toast.warning('ID atual não encontrado no allCaps')

  const nextIndex = currentIndex + 1
  if (nextIndex >= capsList.length) {
    console.log('Último capítulo, não há próximo.')
    return
  }

  const nextId = capsList[nextIndex]

  // Atualiza a URL com o próximo id
  router.push({
    query: { 
      id: nextId, 
      user: wUser, 
      title, 
      bookName, 
      length: length 
    }
  })

  // Atualiza variável reativa e busca comentários
  await handleGetComments()

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
  const sliceSize = Math.floor(total / 3); // agora dividido por 3

  const slices = [
    paragraphs.value.slice(0, sliceSize), // 1ª parte
    paragraphs.value.slice(sliceSize, sliceSize * 2), // 2ª parte
    paragraphs.value.slice(sliceSize * 2) // 3ª parte pega o restante
  ];

  const labels = ['1º início', '2º meio', '3º fim'];

  const counters: any = {
    '1º início': 0,
    '2º meio': 0,
    '3º fim': 0
  };

  // Transforma os slices em conjuntos de IDs dos parágrafos
  const sliceIdSets = slices.map(slice =>
    new Set(slice.map(paragraph => paragraph.id))
  );

  // Agora compara os ids dos comentários com os ids dos parágrafos de cada bloco
  const splited = idRefsToParagraphs.value.map((s) => s.split('_', 2)[1]);
  splited.forEach((refId) => {
    sliceIdSets.forEach((idSet, index) => {
      if (idSet.has(refId)) {
        counters[labels[index]]++;
      }
    });
  });

  paragraphStats.value = counters;

  const inicio = counters['1º início'] > 0;
  const meio = counters['2º meio'] > 0;
  const fim = counters['3º fim'] > 0;

  goodDivision.value = inicio && meio && fim;
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

function estimateReadTime(length: number): string {
    const avgWordLength = 5; // média de caracteres por palavra
  const wordsPerMinute = 250;

  const words = length / avgWordLength;
  const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  times.value.est = totalSeconds

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${String(minutes).padStart(2, '0')} minuto${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${String(seconds).padStart(2, '0')} segundo${seconds !== 1 ? 's' : ''}`);

  return parts.join(' e ');
}

const handleGetComments = async () => {
  isLoading.value = true;

  if(!wUser) return
  const comments = await getComments(wUser.trim(), id); // já filtra por user se quiser
  
  comments.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  await getParagraphs();


  data.value = comments;

  if (comments.length > 0) {
    firstAndLastComments.value.first = comments[0];
    firstAndLastComments.value.last = comments[comments.length - 1];
  } else {
    firstAndLastComments.value.first = null;
    firstAndLastComments.value.last = null;
  }

  window.scrollTo({ top: 0 });
  isLoading.value = false;
}

function timeOfRead(): string {
  const first = firstAndLastComments.value.first;
  const last = firstAndLastComments.value.last;

  if (!first || !last) return 'Leitura não iniciada';

  const firstDate = new Date(first.created);
  const lastDate = new Date(last.created);

  const diffMs = lastDate.getTime() - firstDate.getTime();
  if (diffMs < 0) return 'Tempo inválido';

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  times.value.wast = totalSeconds

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);

  return parts.join(' e ');
}

watch(() => firstAndLastComments.value, (val) => {
  const first = val.first;
  const last = val.last;

  if (!first || !last) {
    times.value.wast = 0;
    return;
  }

  const firstDate = new Date(first.created);
  const lastDate = new Date(last.created);
  const diffMs = lastDate.getTime() - firstDate.getTime();
  if (diffMs < 0) {
    times.value.wast = 0;
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  times.value.wast = totalSeconds;
}, { deep: true });


watch([times, data],() => {
  const handleReadingApproved = () => {
    const est = times.value.est
    const wast = times.value.wast
    
    if(data.value.length === 0) {
      msgReadingPending.value = 'nenhum comentário encontrado.'
      return
    } else if (data.value.length < 6) {
      msgReadingPending.value = 'comentários insuficientes.'
      return
    } else if(wast < est * 0.75) {
      msgReadingPending.value = 'Tempo muito abaixo do estimado.'
      return
    } else if (!goodDivision.value) {
      msgReadingPending.value = 'comentários mal distribuido.'
      return
    }

    msgReadingPending.value = ''
    readingApproved.value = true
  }

  handleReadingApproved()  
}, {deep: true})

onMounted(async () => {
  const getAllCaps = JSON.parse(localStorage.getItem('capsNavigate'))
  await handleGetComments()
  allCaps.value = getAllCaps
});

</script>


<template>
  <div
    class="flex flex-col items-center min-w-full justify-center mt-4 lg:mt-10"
  >
    <header
      class="w-full"
    >
      <div
        class="flex flex-col bg-white sm:mx-4 my-1 py-4 px-2 rounded-xl shadow-lg"
      > 
        <div
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0 w-full"
        >
          
          <div
            class="px-4"
          >
            <h3 class="font-semibold text-violet-800 text-sm">Detalhes do capítulo</h3>
          
            <div
              class="flex flex-col items-start gap-1.5 mt-2"
            >
              <div
                class="flex flex-wrap items-center justify-start font-semibold text-indigo-800 text-xs"
              >
                <Lucide
                  icon="UserCircle"
                  class="mr-1 w-4 h-4"
                />
                User: <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ wUser }}</span>
              </div>
              <div
                class="flex items-center justify-start flex-wrap sm font-semibold text-indigo-800 text-xs text-wrap"
              >
                <Lucide
                  icon="FileText"
                  class="mr-1 w-4 h-4"
                />
                Capítulo: <span class="font-bold text-fuchsia-600 ml-0.5 text-xs text-wrap">{{ title }}</span>
              </div>
              
              <div
                class="flex flex-wrap items-center justify-start font-semibold text-indigo-800 text-xs"
              >
                <Lucide
                  icon="BookOpenText"
                  class="mr-1 w-4 h-4"
                />
                Livro: <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ bookName }}</span>
            </div>

              <span
                class="flex items-center justify-start font-semibold text-indigo-800 text-xs"
              >
                <Lucide
                  icon="AlignLeft"
                  class="mr-1 w-4 h-4"
                />
                Parágrafos: <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ qtdParagraph }}</span>
              </span> 

              <span
                class="flex items-center justify-start font-semibold text-indigo-800 text-xs"
              >
                <Lucide
                  icon="MessageSquareMore"
                  class="mr-1 w-4 h-4"
                />
                Comentários: 
                <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ data.length }}</span>
              </span>
              
              <span
                class="flex items-center justify-start font-semibold text-indigo-800 text-xs"
              >
                <Lucide
                  icon="Clock"
                  class="mr-1 w-4 h-4"
                />
                  Tempo estimado: 
                <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ estimateReadTime(+length) }}</span>
              </span>

              <span
                class="flex items-center justify-start font-semibold text-xs mt-2"                
                :class="{
                    'text-green-600': readingApproved,
                    'text-red-700' : !readingApproved
                  }"
              >
                <Lucide
                  :icon="readingApproved ? 'CheckCheck' : 'X'"
                  class="mr-1 w-4 h-4"
                  :class="{
                    'text-green-600': readingApproved,
                    'text-red-700' : !readingApproved
                  }"
                />
                  Leitura {{ readingApproved ? 'aprovada' : 'não aprovada:' }} {{ msgReadingPending }}
                
              </span>
            </div>
          </div>

          
          <div
            class="w-full px-4 sm:px-0"
          >
            <h3 class="font-semibold text-violet-800 text-sm mt-4 sm:mt-0">Distribuição dos comentários:</h3>
            <ul class="text-sm text-gray-800 mt-2 ">
              <li v-for="(count, label) in paragraphStats" :key="label" class="text-indigo-800">
                {{ label }}: <span class="font-bold text-pink-600">{{ count }}</span> comentário{{ count > 0 ? 's' : '' }}
              </li>
            </ul>

            
              <div
                class="flex flex-wrap items-center justify-start font-semibold text-indigo-800 text-xs mt-2"
              >
                <Lucide
                  icon="Timer"
                  class="mr-1 w-4 h-4"
                />
                  Leitura feita em: <span class="font-bold text-fuchsia-600 ml-0.5 text-xs">{{ timeOfRead() }}</span>
              </div>
          </div>

        </div>

       <div
        class="flex align-center justify-between lg:pr-4"
       >
          <span
            @click="goBack"
            class="flex items-center justify-start ml-4 mt-6 text-xs text-pink-600 cursor-pointer gap-1"
          >
            <Lucide
              icon="ArrowLeft"
              class="w-4 h-4"
            />
            Todos capítulos
          </span>
          <span
            v-if="allCaps.length > 0"
            @click="goNext()"
            class="flex items-center justify-start ml-4 mt-6 text-xs text-pink-600 cursor-pointer gap-1"
          >
            Próximo capítulo
            <Lucide
              icon="ArrowRight"
              class="w-4 h-4"
            />
          </span>
       </div>
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
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 mt-4 sm:p-4 min-w-full"
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
