<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Mail, Lock } from 'lucide-vue-next'
import { Login } from '@/API/UserApi'
import { useRouter } from 'vue-router';

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const submit = async () => {
 try {
   error.value = ''
  loading.value = true

  const data = await Login(email.value, password.value)

  if(!data.token) {
    error.value = "Dados inválidos!"
    loading.value = false
    return
  }
 
  localStorage.setItem('user', JSON.stringify(data))
  loading.value = false
  router.push('/')
 } catch (e) {
  loading.value = false
 }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fuchsia-200 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-3">
      <h2 class="text-2xl font-bold text-center text-fuchsia-600">Entrar na Conta</h2>
      
      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="relative">
          <Mail class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="email"
            type="text"
            placeholder="User Wattpad"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-0"
            required
          />
        </div>

        <div class="relative">
          <Lock class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          :disabled="loading"
          class="w-full py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-xl transition duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500">
        Esqueceu a senha?
        <RouterLink to="#" class="text-blue-500 underline">Recuperar</RouterLink>
      </p>
      
      <p class="text-center text-sm text-gray-500">
        Não possue uma conta?
        <RouterLink to="#" class="text-blue-500 underline">Registrar</RouterLink>
      </p>
      <p class="text-center text-base text-gray-500">
        <RouterLink to="/" class="text-blue-500">Inicio</RouterLink>
      </p>
    </div>
  </div>
</template>
