<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref, watch } from 'vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { getUserById, updateUser } from '@/API/UserApi'
import { useRouter } from 'vue-router'
import Select from '@/base/utils/Select.vue'

const router = useRouter()

// Schema de validação
const schema = yup.object({
  username: yup.string().nullable(),
  phone: yup
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value))
  .matches(/^\(?\d{2}\)?\s?\d{1}\s?\d{4}-?\d{4}$/, {
    message: 'Telefone inválido',
    excludeEmptyString: true
  }),

  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .when('password', {
      is: (val: string | null) => val?.length > 0,
      then: (schema) =>
        schema
          .required('Confirme sua senha')
          .oneOf([yup.ref('password')], 'As senhas não coincidem'),
      otherwise: (schema) => schema.notRequired(),
    }),

    selectedObraId: yup.string().nullable(),
    isPoesia: yup.boolean().nullable(),
    
    workHasLongPart: yup.boolean().nullable(),
    howPartIsLong: yup.string().nullable(),
    workHasHot: yup.boolean().nullable(),
    workHasTrigger: yup.boolean().nullable(),
    howTriggers: yup.string().nullable(),
    userReadHot: yup.boolean().nullable(),
    userHasTrigger: yup.string().nullable(),
})

// Form
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    selectedObraId: null,
    isPoesia: false,
    workHasLongPart: false,
    howPartIsLong: '',
    workHasHot: false,
    workHasTrigger: false,
    howTriggers: '',
    userReadHot: false,
    userHasTrigger: '',
  },
})

const { value: username } = useField('username')
const { value: phone } = useField('phone')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')
const { value: selectedObraId } = useField<string>('selectedObraId')
const { value: isPoesia } = useField<boolean>('isPoesia')

const { value: workHasLongPart } = useField<boolean>('workHasLongPart')
const { value: howPartIsLong } = useField<string>('howPartIsLong')
const { value: workHasHot } = useField<boolean>('workHasHot')
const { value: workHasTrigger } = useField<boolean>('workHasTrigger')
const { value: howTriggers } = useField<string>('howTriggers')
const { value: userReadHot } = useField<boolean>('userReadHot')
const { value: userHasTrigger } = useField<string>('userHasTrigger')


// Simulando atualização
const isSaving = ref(false)
const isLoading = ref(true)
const books = ref()

const submitForm = handleSubmit(async (values) => {
  const userStore = localStorage.getItem('user')
  let parsed = null
  try {
    parsed = JSON.parse(userStore)
  } catch {
    toast.error('Erro ao recuperar dados do usuário.')
    return
  }

  if (!parsed?.user) return

  // Verifica se preencheu parte da seção opcional
  const answeredOptional =
    values.username ||
    values.selectedObraId  ||
    values.workHasHot ||
    values.workHasTrigger ||
    values.howTriggers ||
    values.howPartIsLong ||
    values.userHasTrigger

  // Se nada foi preenchido, só envia se senha ou telefone foram alterados
  if (!answeredOptional && !values.password && !values.phone) {
    toast.warning('Nenhuma alteração foi feita.')
    return
  }

  isSaving.value = true

  try {
    const response = await updateUser(parsed.user, values)
    toast.success('Dados alterados com sucesso!')
    router.push('/profile')
    console.log('response', response)
  } catch (error) {
    console.error('Erro ao atualizar:', error)
    toast.error('Ocorreu um erro ao salvar. Tente novamente.')
  } finally {
    isSaving.value = false
  }
})


onMounted(async () => {  
  const userStore = localStorage.getItem('user')
  const parsed = JSON.parse(userStore)
  if(!userStore) return router.push('/login')
  const data = await getUserById(parsed.user)

  if(data) {
    books.value = data.books
  }
  console.log(books.value)
  isLoading.value = false
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-start w-full p-2 mt-6 min-h-screen"
  >
    <div
      class="w-full"
    >
      <h2
        class="text-lg font-bold text-purple-400 flex items-center gap-2"
        @click="router.back()"
      >
        <Lucide icon="ArrowLeft" class="w-6 h-6" />
      </h2>
    </div>
    <div class="bg-[rgb(0,0,0,0.7)] p-6 rounded-2xl shadow-md w-full max-w-md text-white space-y-4 mx-auto mt-6 border border-purple-500">
      <h2 class="text-lg font-bold text-purple-400 flex items-center gap-2">
        <Lucide icon="Settings" class="w-5 h-5" />
        Editar Perfil
      </h2>

      <div v-if="isLoading" class="space-y-4">
        <div class="h-6 w-32 skeleton"></div> <!-- título -->
        <div class="h-10 w-full skeleton"></div> <!-- username -->
        <div class="h-10 w-full skeleton"></div> <!-- phone -->
        <div class="h-10 w-full skeleton"></div> <!-- password -->
        <div class="h-10 w-full skeleton"></div> <!-- confirm password -->
        <div class="h-10 w-full skeleton"></div> <!-- botão -->

        
        <div class="h-6 w-32 skeleton"></div> <!-- título -->
        <div class="h-10 w-full skeleton"></div> <!-- username -->
        <div class="h-10 w-full skeleton"></div> <!-- phone -->
        <div class="h-10 w-full skeleton"></div> <!-- password -->
        <div class="h-10 w-full skeleton"></div> <!-- confirm password -->
        <div class="h-10 w-full skeleton"></div> <!-- botão -->

        
        <div class="h-6 w-32 skeleton"></div> <!-- título -->
        <div class="h-10 w-full skeleton"></div> <!-- username -->
        <div class="h-10 w-full skeleton"></div> <!-- phone -->
        <div class="h-10 w-full skeleton"></div> <!-- password -->
        <div class="h-10 w-full skeleton"></div> <!-- confirm password -->
        <div class="h-10 w-full skeleton"></div> <!-- botão -->
      </div>

      <form
        v-else
        @submit.prevent="submitForm"
        class="space-y-4"
      >
        <!-- Username -->
        <div class="flex flex-col gap-1">
          <label for="username" class="text-sm text-purple-300">Usuário</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <span class="text-xs text-red-400">{{ errors.username }}</span>
        </div>

        <!-- Username -->
        <div class="flex flex-col gap-1">
          <label for="phone" class="text-sm text-purple-300">Telefone <strong class="text-xs">(Whatsapp)</strong></label>
          <input
            v-model="phone"
            v-mask="'(##) # ####-####'"
            type="text"
            id="phone"
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="(11) 9 1234-5678"
          />
          <span class="text-xs text-red-400">{{ errors.phone }}</span>
        </div>

        <!-- Senha -->
        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm text-purple-300">Nova Senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <span class="text-xs text-red-400">{{ errors.password }}</span>
        </div>

        <!-- Confirme Senha -->
        <div class="flex flex-col gap-1">
          <label for="confirmPassword" class="text-sm text-purple-300">Confirme a Senha</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <span class="text-xs text-red-400">{{ errors.confirmPassword }}</span>
        </div>




        <!-- Separador -->
        <div class="border-t border-purple-500 pt-4 mt-8 space-y-4">
          <h3 class="text-purple-300 font-semibold">Sobre a obra que vai entrar na grade de leitura</h3>

          <!-- Obra selecionada -->
          <div class="flex flex-col gap-1">
            <Select
              v-model="selectedObraId"
              :books="books"
              :errors="errors"
            />
            <span class="text-xs text-red-400">{{ errors.selectedObraId }}</span>
          </div>


          <!-- Poesia? -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="isPoesia" />
            É poesia?
          </label>

          <!-- Capitulos longos? -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="workHasLongPart" />
            Tem capítulos com mais de 4k palavras?
          </label>

          <div v-if="workHasLongPart" class="flex flex-col gap-1">
            <label class="text-sm">Quais? (separe por vírgula)</label>
            <textarea v-model="howPartIsLong" 
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          </div>

          <!-- Tem hot? -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="workHasHot" />
            Tem cenas hot, na sua obra?
          </label>

          <!-- Tem gatilho? -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="workHasTrigger" />
             Tem gatilhos? (separe por vírgula)
          </label>

          <div v-if="workHasTrigger" class="flex flex-col gap-1">
            <label class="text-sm">Quais?</label>
            <textarea 
            v-model="howTriggers" 
            class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          </div>

          <!-- Vai ler hot? -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="userReadHot" />
            Você ler hot?
          </label>

          <!-- Tem gatilhos? -->
          <div class="flex flex-col gap-1">
            <label class="text-sm">Você possui gatilhos? (opcional descrever)</label>
            <textarea
              v-model="userHasTrigger"
              class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>


        <!-- Botão -->
        <button
          type="submit"
          :disabled="isSaving"
          class="mt-2 w-full py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 transition-all shadow-lg disabled:opacity-50"
        >
          <Lucide
            icon="Save"
            class="w-4 h-4 inline mr-1 -mt-1"
          />
          {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background-color: rgba(255, 255, 255, 0.1); /* ou #ccc no light mode */
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -150px;
  }
  100% {
    left: 100%;
  }
}
</style>