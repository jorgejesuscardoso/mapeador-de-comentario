<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Mail, Lock } from 'lucide-vue-next'
import { Login } from '@/API/UserApi'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const modalIsLogged = ref(false)

const submit = async () => {
  try {
    error.value = ''
    loading.value = true

    const data = await Login(email.value, password.value)

    // Aqui só entra se o login for OK
    if (!data.token) {
      error.value = "Dados inválidos!"
      return
    }

    localStorage.setItem('user', JSON.stringify(data))
    router.back()

  } catch (e: any) {
    // Mostra a mensagem do throw new Error(...)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() =>{
  const getUser = localStorage.getItem('user')
  const parse = JSON.parse(getUser)


  if(parse) {
    modalIsLogged.value = true

    setTimeout(() =>{
      router.push('/')
    }, 5000)
    return
  }
})

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fuchsia-200 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5">
      <h2 class="text-2xl font-bold text-center text-fuchsia-600 mb-6">Login</h2>
      
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

      <p 
        v-if="1+2 != 3"
        class="text-center text-sm text-gray-500"
      >
        Esqueceu a senha?
        <RouterLink to="#" class="text-blue-500 underline">Recuperar</RouterLink>
      </p>
      
      <p class="text-center text-sm text-gray-500">
        Não possue uma conta?
        <RouterLink to="/register" class="text-blue-500 underline">Registrar</RouterLink>
      </p>
      <p class="text-center text-base text-gray-500">
        <RouterLink to="/" class="text-blue-500">Inicio</RouterLink>
      </p>
    </div>

     <!-- MODAL: Já está logado -->
    <div
      v-if="modalIsLogged"
      class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg p-6 w-80 text-center space-y-4">
        <h3 class="text-xl font-semibold text-fuchsia-700">Você já está logado!</h3>
        <p class="text-sm text-gray-600">Redirecionando para a página inicial...</p>
        <button
          class="mt-2 w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl"
          @click="router.push('/')"
        >
          Ir para Início
        </button>
      </div>
    </div>
  </div>
</template>
