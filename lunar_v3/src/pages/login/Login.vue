<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Mail, Lock, User } from 'lucide-vue-next'
import { Login, ResetPassword } from '@/API/UserApi' // ⚡ adicione ResetPassword
import { useRouter } from 'vue-router'
import ResetPasswordModal from './ResetPasswordModal.vue'
import RequestPasswordReset from './RequestPasswordReset.vue'

const router = useRouter()
const user = ref('')
const userToReset = ref('') // para reset
const password = ref('')
const loading = ref(false)
const error = ref('')

const modalIsLogged = ref(false)
const modalReset = ref(false) // modal de reset
const resetCode = ref('')
const newPassword = ref('')

// login normal
const submit = async () => {
  try {
    error.value = ''
    loading.value = true

    const data = await Login(user.value.trim(), password.value.trim())

    if (!data.token) {
      error.value = "Dados inválidos!"
      return
    }

    localStorage.setItem('user', JSON.stringify(data))
    router.back()
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// reset de senha
const submitReset = async () => {
  // usa userToReset do modal
  if (!userToReset.value || !resetCode.value || !newPassword.value) {
    error.value = 'Preencha usuário, código e nova senha!'
    return
  }

  try {
    error.value = ''
    loading.value = true
    await ResetPassword(userToReset.value.trim(), resetCode.value.trim(), newPassword.value.trim())
    alert('Senha redefinida com sucesso!')
    
    // reset dos campos
    modalReset.value = false
    resetCode.value = ''
    newPassword.value = ''
    userToReset.value = ''

  } catch (err: any) {
    error.value = err.message || 'Erro ao redefinir senha!'
  } finally {
    loading.value = false
  }
}

// checa se já tá logado
onMounted(() => {
  const getUser = localStorage.getItem('user')
  const parse = getUser ? JSON.parse(getUser) : null
  if (parse) modalIsLogged.value = true
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center searchFilterBg p-4">
    <div class="bg-[rgb(0,0,0,0.7)] p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5">
      <h2 class="text-2xl font-bold text-center text-fuchsia-400 mb-6">Login</h2>

      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="relative">
          <User class="absolute top-3.5 left-3 h-5 w-5 text-gray-100" />
          <input v-model="user" type="text" placeholder="User Wattpad" class="w-full pl-10 pr-3 py-2 bg-transparent border rounded-xl focus:outline-none text-white" required />
        </div>

        <div class="relative">
          <Lock class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input v-model="password" type="password" placeholder="Senha" class="w-full pl-10 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <button :disabled="loading" class="w-full py-2 bg-[rgb(0,0,0,0.6)] hover:bg-purple-700 text-white rounded-xl transition duration-200 disabled:opacity-50">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Botão de reset -->
      <p class="text-center text-sm text-fuchsia-300 cursor-pointer" @click="modalReset = true">
        Esqueceu a senha? <span class="text-blue-300 underline">Recuperar</span>
      </p>

      <p class="text-center text-sm text-fuchsia-200"> Não possue uma conta? <RouterLink to="/register" class="text-indigo-400 font-semibold underline">Registrar</RouterLink> </p> <p class="text-center text-base text-gray-500"> <RouterLink to="/" class="text-indigo-400 font-semibold">Inicio</RouterLink> </p>
    </div>

    <!-- Modal: Já logado -->
    <div v-if="modalIsLogged" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-80 text-center space-y-4">
        <h3 class="text-xl font-semibold text-fuchsia-700">Você já está logado!</h3>
        <p class="text-sm text-gray-600">Redirecionando para a página inicial...</p>
        <button class="mt-2 w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl" @click="router.push('/')">Ir para Início</button>
      </div>
    </div>

    <!-- Modal: Reset de senha -->
    <div
      v-if="modalReset"
      class="absolute inset-0 bg-[rgb(0,0,0,0.8)] flex items-center justify-center z-50"
    >
      <RequestPasswordReset @close="modalReset = false" />
    </div>

  </div>
</template>
