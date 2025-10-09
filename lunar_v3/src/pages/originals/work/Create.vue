<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toast } from '@/base/utils/toast'
import Lucide from '@/base/lucide/Lucide.vue'
import { subgenres, genres } from './genres'
import Switch from '@/base/utils/Switch.vue'
import { useRouter } from 'vue-router'
import { createBook } from '@/API/OriginalLunarApi'
import Select from '@/base/utils/Select.vue'

const info = ref(false)
const saving = ref(false)
const router = useRouter()
const coverFile = ref<File | null>(null)
const user = ref()
// Schema de validação com Yup
const schema = yup.object({
  name: yup.string().required('O título é obrigatório'),
  sinopse: yup.string().required('A sinopse é obrigatória').min(30, 'A sinopse deve ter pelo menos 30 caracteres'),
  genre: yup.string().required('O gênero é obrigatório'),
  subgenre: yup.string().required('O subgênero é obrigatório'),
  target: yup.string().required('O público alvo é obrigatório'),
  tags: yup.string().required('Adicione pelo menos uma tag'),
  type: yup.string().required(),
  mature: yup.boolean().default(false),
  terms: yup.boolean().oneOf([true], 'Você deve aceitar os termos para continuar'),
  chaptersLimit: yup.boolean().oneOf([true], 'Você deve aceitar o limite de capítulos para continuar')
})

// Formulário
const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    sinopse: '',
    genre: '',
    subgenre: '',
    target: '',
    tags: '',
    type: 'novel',
    mature: false,
    terms: false,
    chaptersLimit: false
  }
})

const { value: name } = useField<string>('name')
const { value: sinopse } = useField<string>('sinopse')
const { value: genre } = useField<string>('genre')
const { value: subgenre } = useField<string>('subgenre')
const { value: target } = useField<string>('target')
const { value: tags } = useField<string>('tags')
const { value: mature } = useField<boolean>('mature')
const { value: type } = useField<string>('type', 'novel')
const { value: terms } = useField<boolean>('terms')
const { value: chaptersLimit } = useField<boolean>('chaptersLimit')

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
    
    values.tags.split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .forEach(tag => formData.append('tags[]', tag))

    // adiciona o arquivo da capa, se existir
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    // chamada para API — precisa aceitar multipart/form-data

    const response = await createBook(formData)
    if(response.status !== 200) {
      toast.error("Falha na criação do livro, tente novamente mais tarde!")
      return
    }
    toast.success('Livro criado com sucesso!')
    console.log('response', response)
    saving.value = false
    setTimeout(() => {
      router.push(`/v1/origins/user/${user.value}`)
    }, 2000);
  } catch (e) {
    toast.error('Erro ao criar o livro!')
    saving.value = false
  } finally {
    uploading.value = false
    saving.value = false
  }
})

onMounted(() => {
  const getUser = JSON.parse(localStorage.getItem('user')) || {}
  if(!getUser || !getUser.token || !getUser.user) return router.push('/v1/origins')
  user.value = getUser.user
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
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center lg:justify-end w-full bg-white dark:bg-black min-h-screen pb-24">
    <header class="w-full sticky top-0 z-20 bg-white border-b border-violet-200 dark:bg-black dark:border-[#fff2] shadow-md px-2 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <div class="font-bold text-gray-800 text-sm md:text-lg dark:text-gray-300">{{ name || 'História sem título' }}</div>
          <div class="font-semibold text-gray-800 text-xs md:text-sm dark:text-gray-400">Adicione as informações do seu novo livro!</div>
        </div>
        <div v-if="saving" class="flex items-center justify-center text-green-500 gap-1">
          <p class="text-sm">Salvando...</p>
          <Lucide icon="RefreshCw" class="h-5 w-5 animate-spin" :stroke-width="1" />
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-2 ">
        <button 
          @click="onSubmit" 
          class="px-8 py-2 rounded-md text-white text-sm font-bold shadow-md transition-all duration-300"
          :class="{
            'bg-gray-400 cursor-not-allowed': saving,
            'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:bg-standard-dark hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700': !saving
          }"
          :disabled="saving"
        >          
          {{ saving ? 'Criando' : 'Criar' }}
        </button>
        <button  
          @click="router.back()"
          class="px-4 py-2 rounded-md border text-sm dark:text-gray-300 dark:border-[#fff3] dark:hover:text-black":class="{
            'bg-gray-400 cursor-not-allowed text-white': saving,
            'text-gray-600 hover:bg-gray-50': !saving
          }"
        >
          Cancelar
        </button>
      </div>
    </header>

    <form @submit.prevent="onSubmit" 
      class="flex flex-col gap-4 rounded-lg p-2 md:p-4 w-full lg:w-[80vw]"
    >

      <div
        class="flex flex-col md:flex-row items-start justify-center gap-5 md:gap-0 md:px-6"
      >
        <!-- Coluna esquerda -->
        <div class="flex flex-col shadow-xl w-full pb-6 md:pb-0 md:border-0 border-b border-white/20 items-center justify-center">
          <!-- Upload de capa -->
          <div class="flex flex-col ">
            <label class="md:w-64 w-72 min-h-96 flex items-center justify-center border bg-gray-200 dark:bg-[#ffffff10] dark:border-none rounded-md cursor-pointer hover:bg-gray-100">
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
                class="border truncate max-h-10 border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:ring-violet-300 focus:outline-none bg-white shadow-sm hover:border-violet-400 transition dark:text-gray-400 dark:bg-white/10 dark:border-none"
              >
                {{ selectedLabel || 'Selecione o gênero' }}
              </div>

              <ul 
                ref="refGenre2"
                v-if="open" 
                class="absolute z-50 w-full bg-white dark:bg-gray-900 mt-1 max-h-60 overflow-y-auto rounded-xl shadow-lg"
              >
                <li 
                  v-for="g in genres" 
                  :key="g.value" 
                  @click="selectGenre(g)" 
                  class="dark:bg-black dark:text-white pl-2"
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
                class="border truncate max-h-10 border-gray-300 px-3 py-2 rounded-xl w-full text-gray-800 focus:ring-1 focus:ring-violet-300 focus:outline-none bg-white shadow-sm hover:border-violet-400 transition dark:text-gray-400 dark:bg-white/10 dark:border-none"
              >
                {{ selectedLabelSub || 'Selecione o gênero' }}
              </div>

              <ul 
                ref="refSubgenre2"
                v-if="opensub" 
                class="absolute z-50 w-full bg-white dark:bg-gray-900 mt-1 max-h-60 overflow-y-auto rounded-xl shadow-lg"
              >
                <li 
                  v-for="g in subgenres" 
                  :key="g.value" 
                  @click="selectSubGenre(g)" 
                  class="dark:bg-black dark:text-white pl-2"
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

          <!-- Aviso limite capítulos -->
          <div class="col-span-full bg-yellow-50 border p-4 rounded text-sm text-gray-700 dark:bg-[#ffffff15] dark:text-gray-400 dark:border-[#fff3]">
            <p><strong>Aviso:</strong> Seguindo boas práticas e buscando garantir máxima qualidade de leitura, visando um mercado amplo, todas as obras na <strong>Luna Origins</strong> devem ter capítulos médios (máx. 3.000 palavras). Não será possível publicar capítulos acima desse limite.</p>
            <div class="flex items-center mt-3">
              <input id="chaptersLimit" type="checkbox" v-model="chaptersLimit" class="accent-violet-600"/>
              <label for="chaptersLimit" class="ml-2">Entendi e aceito o limite de tamanho por capítulo.</label>
            </div>
            <p v-if="errors.chaptersLimit" class="text-red-500 text-sm mt-1">{{ errors.chaptersLimit }}</p>
          </div>

          <!-- Aviso legal -->
          <div class="col-span-full bg-gray-100 border p-4 rounded text-sm text-gray-700 dark:bg-[#ffffff15] dark:text-gray-400 dark:border-[#fff3]">
            <p><strong>Aviso legal:</strong> Todas as obras publicadas são protegidas pela <strong>Lei nº 9.610/1998</strong>. O plágio é crime e pode gerar sanções civis e penais. A <strong>Luna Origins</strong> não se responsabiliza por violações cometidas por usuários.</p>
            <p class="mt-2">Leia nossas <a href="/diretrizes" class="text-violet-700 underline">Diretrizes</a> para mais informações.</p>

            <div class="flex items-center mt-3">
              <input id="terms" type="checkbox" v-model="terms" class="accent-violet-600"/>
              <label for="terms" class="ml-2">Li, entendi e aceito os termos legais.</label>
            </div>
            <p v-if="errors.terms" class="text-red-500 text-sm mt-1">{{ errors.terms }}</p>
          </div>

          <!-- Botão Criar -->
          <div class="col-span-full flex justify-center pb-6">
            <button 
              @click="onSubmit" 
              class="px-8 py-2 rounded-md text-white text-sm font-bold shadow-md transition-all duration-300"
              :class="{
                'bg-gray-400 cursor-not-allowed': saving,
                'bg-standard dark:bg-standard-dark': !saving
              }"
              :disabled="saving"
            >
              {{ saving ? 'Criando' : 'Criar' }}
            </button>
          </div>      
        </div>
      </div>
    </form>
  </div>
</template>
