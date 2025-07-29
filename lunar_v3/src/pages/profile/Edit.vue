<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { toast } from '@/base/utils/toast'
import { updateUser } from '@/API/UserApi'

// Schema de validação
const schema = yup.object({
  username: yup.string().min(3, 'Mínimo 3 caracteres'),

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
})



// Form
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: username } = useField('username')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')

// Simulando atualização
const isSaving = ref(false)

const submitForm = handleSubmit(async (values) => {
  const userSotre = localStorage.getItem('user')
  const parsed = JSON.parse(userSotre)
  
  if(parsed && !parsed.user) return

  isSaving.value = true
  
  console.log('Atualizando com:', values)
  
  const response = await updateUser(parsed.user, values)
  console.log('response',response)
  isSaving.value = false
  toast.success('Dados alterados com sucesso!')
})
</script>

<template>
  <div class="bg-[rgb(0,0,0,0.7)] p-6 rounded-2xl shadow-md w-full max-w-md text-white space-y-4 mx-auto mt-6 border border-purple-500">
    <h2 class="text-lg font-bold text-purple-400 flex items-center gap-2">
      <Lucide icon="Settings" class="w-5 h-5" />
      Editar Perfil
    </h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Username -->
      <div class="flex flex-col gap-1">
        <label for="username" class="text-sm text-purple-300">Novo Usuário</label>
        <input
          v-model="username"
          type="text"
          id="username"
          class="bg-black/40 border border-purple-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <span class="text-xs text-red-400">{{ errors.username }}</span>
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
</template>
