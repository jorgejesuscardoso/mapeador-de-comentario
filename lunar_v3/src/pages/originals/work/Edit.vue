<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { getBookLunarById, updateBook } from '@/API/OriginalLunarApi'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { subgenres, genres } from './genres'
import Switch from '@/base/utils/Switch.vue'
import { createBook } from '@/API/OriginalLunarApi'
import { nextTick } from 'vue'

// Estado
const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string
const book = ref<Book>({
  id: '',
  name: '',
  author: '',
  cover: '',
  sinopse: '',
  target: '',
  type: '',
  tags: [],
  genre: '',
  subgenre: '',
  mature: false,
})

const initialValues = ref()

interface Book {
  id: string
  author: string
  name: string
  cover: string
  sinopse: string
  tags: string[]
  type: string
  target: string
  subgenre: string
  genre: string
  mature: boolean
}
const noHasImgModal = ref(false)
const info = ref(false)
const saving = ref(false)
const coverFile = ref<File | null>(null)
const user = ref()

// Schema de validação com Yup
const schema = yup.object({
  name: yup.string(),
  sinopse: yup.string().min(30, 'A sinopse deve ter pelo menos 30 caracteres'),
  genre: yup.string(),
  subgenre: yup.string(),
  target: yup.string(),
  tags: yup.string(),
  type: yup.string(),
  mature: yup.boolean(),
})

// Formulário
const { handleSubmit, errors, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
  id: '',
  name: '',
  author: '',
  cover: '',
  sinopse: '',
  target: '',
  type: '',
  tags: [],
  genre: '',
  subgenre: '',
  mature: false,
}
})

const { value: name } = useField<string>('name')
const { value: sinopse } = useField<string>('sinopse')
const { value: genre } = useField<string>('genre')
const { value: subgenre } = useField<string>('subgenre')
const { value: target } = useField<string>('target')
const { value: tags } = useField<string>('tags')
const { value: mature } = useField<boolean>('mature')
const { value: type } = useField<string>('type')

// Estado da capa
const coverPreview = ref<string | null>(null)
const uploading = ref(false)

function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// Submissão
const onSubmit = handleSubmit(async (values) => {
  uploading.value = true
  saving.value = true
  try {
    const formData = new FormData()

    // adiciona os campos normais
    formData.append('author', user.value)
    formData.append('name', values.name)
    formData.append('sinopse', values.sinopse)
    formData.append('genre', values.genre)
    formData.append('subgenre', values.subgenre)
    formData.append('target', values.target)
    formData.append('type', values.type)
    formData.append('mature', String(values.mature || false))
    
    const tagsArray = Array.isArray(values.tags)
      ? values.tags
      : (values.tags as string).split(',').map(t => t.trim()).filter(Boolean)

    tagsArray.forEach(tag => formData.append('tags[]', tag))

    // adiciona o arquivo da capa, se existir
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    let interval = 2000
    if(!coverFile.value && !coverPreview.value) {
      noHasImgModal.value = true
      interval = 5000
    }
    // chamada para API — precisa aceitar multipart/form-data

    const response = await updateBook(formData, bookId)
    if(response.status !== 200) {
      toast.error("Falha na modificação do livro, tente novamente mais tarde!")
      return
    }
    toast.success('Livro modificado com sucesso!')
    
    saving.value = false
    setTimeout(() => {
      noHasImgModal.value = false
      router.push(`/v1/origins/user/${user.value}`)
    }, interval);
  } catch (e) {
    toast.error('Erro ao modificar o livro!')
    saving.value = false
  } finally {
    uploading.value = false
    saving.value = false
  }
})

const open = ref(false)
const selectedLabel = ref('')

function selectGenre(g) {
  genre.value = g.value
  selectedLabel.value = g.label
  open.value = false
}

const opensub = ref(false)
const selectedLabelSub = ref('')

function selectSubGenre(g) {
  subgenre.value = g.value
  selectedLabelSub.value = g.label
  opensub.value = false
}

const loading = ref(true)

// API
async function fetchBook() {
  try {
    loading.value = true
    const res = await getBookLunarById(bookId)
    if (res.status === 200 && res.data) {
      const work = {
        author: res.data.author,
        cover: res.data.cover,
        genre: res.data.genre,
        subgenre: res.data.subgenre,
        id: res.data.id,
        mature: res.data.mature,
        name: res.data.name,
        sinopse: res.data.sinopse,
        type: res.data.type,
        target: res.data.target,
      } as Book
      
      coverPreview.value = res.data.cover;
      
      const s = res.data.tags
      work.tags = Array.isArray(res.data.tags) && res.data.tags.join(', ')
      tagList.value = res.data.tags
      book.value = work
      resetForm({ values: work })
    } else {
      toast.error('Erro ao carregar o livro ou capítulos')
    }
  } catch (err) {
    console.error(err)
    toast.error('Erro ao carregar dados do livro')
  } finally {
    loading.value = false
  }
}

watch(book, (val) =>{
  initialValues.value = val
}, {immediate: true})

const tagList = ref<string[]>([])
const tagInput = ref<HTMLInputElement | null>(null)

function handleTagInput(e: KeyboardEvent) {
  const input = e.target as HTMLInputElement
  if (e.key === ',' || e.key === 'Enter') {
    e.preventDefault()
    const newTag = input.value.replace(',', '').trim()
    if (newTag && !tagList.value.includes(newTag)) {
      tagList.value.push(newTag)
    }
    input.value = ''
    tags.value = tagList.value.join(', ')
    nextTick(() => tagInput.value?.focus())
  }
}

function removeTag(index: number) {
  tagList.value.splice(index, 1)
  tags.value = tagList.value.join(', ')
  nextTick(() => tagInput.value?.focus())
}
// Inicializa

const refGenre = ref<HTMLElement | null>()
const refGenre2 = ref<HTMLElement | null>()
const refSubgenre = ref<HTMLElement | null>()
const refSubgenre2 = ref<HTMLElement | null>()

const handleClickOutside = (event: MouseEvent) => {
	try{
		const target = event.target as Node;

		// Fecha menu se clicar fora
		if (
			open.value &&
			refGenre.value &&
			refGenre2.value &&
			!refGenre.value.contains(target) &&
			!refGenre2.value.contains(target)
		) {
			open.value = false;
			}

		// Fecha notificações se clicar fora
		if (
		opensub.value &&
		refSubgenre.value &&
		refSubgenre2.value &&
		!refSubgenre.value.contains(target) &&
		!refSubgenre2.value.contains(target)
		) {
		opensub.value = false;
		}
  } catch (err){
    console.error(err)
  }
};

onMounted(async () => {
  const getUser = JSON.parse(localStorage.getItem('user')) || {}
  if(!getUser || !getUser.token || !getUser.user) return router.push('/v1/origins')
  user.value = getUser.user

  document.addEventListener('click', handleClickOutside);
  fetchBook()
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col items-end justify-center w-full dark:bg-black bg-white min-h-screen pb-10">
    <div
      class="flex items-start justify-end mt-16 w-full"
    >
      <div
        class="flex items-center text-sm gap-1 dark:text-gray-200 lg:w-[85vw] w-full ml-4 md:mt-0 md:ml-0 mt-2"
      >
        <span
          class="flex items-center cursor-pointer"
          @click="router.push('/v1/origins/user/JcBushido')"
        >
          <Lucide
            icon="ArrowLeft"
            class="w-4 h-4"
          />
          Voltar
        </span>
      </div>
    </div>
    <div
      v-if="noHasImgModal"
      class="flex items-center justify-center bg-black/40 fixed inset-0 z-50"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-6 w-[400px] flex flex-col justify-between"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-3">Capa não detectada</h2>
          <p class="text-gray-700 leading-relaxed">
            Nenhum envio de capa foi detectado, e a capa atual foi removida.  
            As alterações serão salvas <strong>mantendo a capa anterior</strong>.
          </p>
        </div>
      </div>
    </div>
    <form @submit.prevent="onSubmit" 
      class="flex flex-col gap-4 rounded-lg p-2 md:p-4 w-full lg:w-[85vw] mt-14"
    >
      <div
        class="flex flex-col md:flex-row items-center md:items-start justify-center gap-5 md:px-6"
      >
        <!-- Coluna esquerda -->
        <div class="flex flex-col">
          <!-- Upload de capa -->
          <div class="flex flex-col">
            <label class="w-64 min-h-96 flex items-center justify-center md:border dark:bg-[#ffffff10] bg-gray-200 rounded-md cursor-pointer hover:bg-gray-100 relative">
              <span v-if="!coverPreview" class="flex flex-col items-center justify-center text-sm text-gray-500">
                <Lucide
                  icon="FileImage"
                  class="h-14 w-14"
                  :stroke-width="0.5"
                />
                Adicionar capa
              </span>
              <img v-else :src="coverPreview" class="w-full h-full border border-purple-200  object-cover rounded-md"/>
              <input type="file" class="hidden" @change="onCoverChange" accept="image/*"/>
            </label>
          </div>
          <div
            class="flex items-center justify-center mt-4"
          >
            <button
              type="button"
              class="border text-sm px-3 py-1 bg-[#810c0c] dark:border-none rounded text-gray-200 font-normal cursor-pointer"
              @click="coverPreview = ''"
            >
              Remover Capa
            </button>
          </div>
        </div>
        <!-- Info -->
        <div
          v-if="info"
        >
          <h3>
            Adicione uma capa para a história
          </h3>
          <p>
            As histórias com uma imagem na capa são lidas 23 vezes mais do que as que não têm
            Deve estar em formato JPG, GIF ou PNG, com menos de 2MB. Dimensões recomendadas para a capa: 512x800 pixels
          </p>
        </div>

        <!-- Coluna direita -->
        <div class="flex flex-col gap-4 px-3 md:px-10 rounded-xl shadow-2xl bg-white border dark:bg-[#ffffff08] dark:border-none border-gray-200">
          <h1
            class="font-bold border-b border-gray-300 pb-2 my-4 text-lg text-gray-800 dark:text-gray-300 dark:border-[#fff2]"
          >
            Dados do livro
          </h1>
          <!-- Título -->
          <div>
            <label 
              for="title"
              class="font-semibold text-lg text-gray-900 dark:text-gray-400"
            >
              Título:
            </label>
            <input 
              v-model="name"
              type="text" 
              id="title"
              placeholder="História sem título!" 
              class="text-lg border px-3 py-2 rounded-xl w-full text-gray-800 border-gray-300 dark:text-gray-400 dark:bg-white/10 dark:border-none placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-violet-300"/>
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Sinopse -->
          <div
            class=""
          >
            <label 
              for="sinopse"
              class="font-semibold text-lg text-gray-900 dark:text-gray-400"
            >
              Sinopse:
            </label>
            <textarea 
              id="sinopse"
              v-model="sinopse" 
              placeholder="Em um reino repleto de magia..."
              class="border border-gray-300 px-3 py-2 rounded w-full text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-violet-300 min-h-[160px] dark:text-gray-400 dark:bg-white/10 dark:border-none"></textarea>
            <p v-if="errors.sinopse" class="text-red-500 text-sm mt-1">{{ errors.sinopse }}</p>
          </div>
          
          <!-- Gênero -->
          <div>
            <label class="block text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Gênero:</label>
            <div class="relative">
              <div 
                ref="refGenre"
                @click="open = !open" 
                class="border truncate max-h-10 border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:ring-violet-300 focus:outline-none capitalize bg-white shadow-sm hover:border-violet-400 transition dark:text-gray-400 dark:bg-white/10 dark:border-none"
              >
                {{ genre || selectedLabel || 'Selecione o gênero' }}
              </div>

              <ul 
                ref="refGenre2"
                v-if="open" 
                class="absolute z-50 w-full bg-white dark:bg-gray-900 mt-1 max-h-60 overflow-y-auto rounded-xl shadow-lg border border-gray-400"
              >
                <li 
                  v-for="g in genres" 
                  :key="g.value" 
                  @click="selectGenre(g)" 
                  class="dark:bg-black dark:hover:bg-[#ffffff03] dark:text-white pl-2 hover:bg-[#0001] cursor-pointer"
                >
                  {{ g.label }}
                </li>
              </ul>
            </div>
            <p class="text-gray-500 text-xs mt-1">Gênero principal da sua obra.</p>
            <p v-if="errors.genre" class="text-red-500 text-sm mt-1">{{ errors.genre }}</p>
          </div>

          <!-- Subgênero -->
          <div>
            <label class="block text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Subgênero:</label>
            <div class="relative">
              <div 
                ref="refSubgenre"
                @click="opensub = !opensub" 
                class="border truncate max-h-10 border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:ring-violet-300 focus:outline-none bg-white shadow-sm hover:border-violet-400 capitalize transition dark:text-gray-400 dark:bg-white/10 dark:border-none"
              >
                {{ subgenre || selectedLabelSub || 'Selecione o gênero' }}
              </div>

              <ul 
                ref="refSubgenre2"
                v-if="opensub" 
                class="absolute z-50 w-full bg-white dark:bg-gray-900 mt-1 max-h-60 overflow-y-auto rounded-xl shadow-lg border border-gray-400"
              >
                <li 
                  v-for="g in subgenres" 
                  :key="g.value" 
                  @click="selectSubGenre(g)" 
                  class="dark:bg-black dark:hover:bg-[#ffffff03] dark:text-white pl-2 hover:bg-[#0001] cursor-pointer"
                >
                  {{ g.label }}
                </li>
              </ul>
            </div>
            <p class="text-gray-500 text-xs mt-1">Gênero secundário da sua obra.</p>
            <p v-if="errors.subgenre" class="text-red-500 text-sm mt-1">{{ errors.subgenre }}</p>
          </div>



          <!-- Público Alvo -->
          <div>
            <label class="block text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Público Alvo:</label>
            <select v-model="target" class="border border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:outline-none focus:ring-violet-300 dark:text-gray-400 dark:bg-white/10 dark:border-none">
              <option value="" class="dark:bg-black">Selecione o público alvo</option>
              <option value="infantil" class="dark:bg-black">Infantil (0-12 anos)</option>
              <option value="jovem-adulto" class="dark:bg-black">Jovem Adulto (13-17 anos)</option>
              <option value="adulto" class="dark:bg-black">Adulto (18+ anos)</option>
              <option value="todos" class="dark:bg-black">Livre</option>
            </select>
            <p class="text-gray-500 text-xs mt-1">
              Tenha em mente que se escolher um público com menos de 18 anos, o conteúdo da sua obra deve ser adequado a essa faixa etária. O mesmo se aplica para <strong>"Livre"</strong>.
            </p>
            <p v-if="errors.target" class="text-red-500 text-sm mt-1">{{ errors.target }}</p>
          </div>


          <!-- Tipo de obra -->
          <div
            class="mt-2"
          >            
            <label class="block text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Tipo de obra:</label>
            <select v-model="type" class="border border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:outline-none focus:ring-violet-300 dark:text-gray-400 dark:bg-white/10 dark:border-none">
              <option value="novel" class="dark:bg-black">Novel</option>
              <option value="light-novel" class="dark:bg-black">Light Novel</option>
              <option value="poema" class="dark:bg-black">Poema</option>
              <option value="fanfic" class="dark:bg-black">Fanfic</option>
              <option value="conto" class="dark:bg-black">Conto</option>
              <option value="cronica" class="dark:bg-black">Crônica</option>
            </select>
            <p class="text-gray-500 text-xs mt-1">
              Selecione o formato da sua obra: Novel, Light Novel, Poema, Fanfic, Conto ou Crônica.
            </p>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Tags:</label>

            <!-- Área onde aparecem as tags -->
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="(tag, i) in tagList" 
                :key="i" 
                class="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800 transition"
                @click="removeTag(i)"
              >
                {{ tag }}
                <Lucide icon="X" class="h-4 w-4" />
              </span>
            </div>

            <!-- Input de tags -->
            <input 
              ref="tagInput"
              type="text" 
              placeholder="Digite uma tag e pressione vírgula ou Enter"
              @keyup="handleTagInput"
              class="border border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-violet-300 dark:text-gray-400 dark:bg-white/10 dark:border-none"
            />

            <p class="text-gray-500 text-xs mt-1">Facilita encontrar sua obra nas pesquisas.</p>
            <p v-if="errors.tags" class="text-red-500 text-sm mt-1">{{ errors.tags }}</p>
          </div>

          <!-- Switch de conteúdo adulto -->
          <div class="flex flex-col items-start gap-2 border-t pt-3">
            <label class="flex items-center justify-start gap-4 text-gray-900 text-lg font-medium mb-1 dark:text-gray-400">Conteúdo adulto:
              <Switch
                v-model="mature"
                label=""
              />
            </label>
            <p 
              v-if="!mature"
              class="text-gray-500 text-xs mt-1"
            >
              Sua história é apropriada para todos os públicos.
            </p>
            <p
              v-else
              class="text-gray-500 text-xs mt-1"
            >
              A sua história contém representações gráficas de violência, sexualidade, linguagem forte, e/ou outros temas maduros.
            </p>
          </div>

          <!-- Botão Criar -->
          <div class="col-span-full flex justify-center pb-6">
            <button 
              type="button"
              @click="onSubmit" 
              class="px-8 py-2 rounded-md text-white text-sm font-bold shadow-md transition-all duration-300"
              :class="{
                'bg-gray-400 cursor-not-allowed': saving,
                'bg-standard dark:bg-standard-dark': !saving
              }"
              :disabled="saving"
            >
              {{ saving ? 'Salvando' : 'Salvar' }}
            </button>
          </div>      
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
textarea { min-height: 80px; }
</style>
