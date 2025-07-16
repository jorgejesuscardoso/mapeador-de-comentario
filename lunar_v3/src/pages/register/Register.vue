<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { Mail, Lock, User, Calendar } from 'lucide-vue-next'
import { Register, TRegister } from '@/API/UserApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const userWattpad = ref('')
const password = ref('')
const confirmPassword = ref('')
const nome = ref('')
const idade = ref<number | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)


const submit = async () => {
  try {
    error.value = ''
    loading.value = true

    const payload = {
      user: userWattpad.value.trim(),
      password: password.value.trim(),
      name: nome.value.trim(),
      age: idade.value,
      role:'member'
    } as TRegister

    const data = await Register(payload)

    if (data.message !== "Usuário criado com sucesso!") {
      error.value = data.message || 'Erro no registro!'
      loading.value = false
      return
    }

    loading.value = false
    success.value = true
    setTimeout(() =>{
            router.push('/login') 
    }, 5000)
  } catch (e) {
    error.value = 'Erro no servidor!'
    loading.value = false
  }
}

const isFormValid = computed(() => {
  return (
    userWattpad.value &&
    password.value &&
    confirmPassword.value &&
    nome.value &&
    idade.value &&
    password.value === confirmPassword.value
  )
})

onMounted(() =>{
  const getUser = localStorage.getItem('user')
  const parse = JSON.parse(getUser)
  const hasToken = parse?.token ? true : false

  if(hasToken) {   
      router.push('/')
    return
  }
})

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fuchsia-200 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-3">
      <h2 class="text-2xl font-bold text-center text-purple-600">Registrar Conta</h2>

      <span v-if="error" class="text-red-600 text-sm text-center">{{ error }}</span>
      <span v-if="success" class="text-green-600 text-sm text-center">Usuário criado com sucesso! Redirecionando...</span>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="relative">
          <Mail class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="userWattpad"
            type="text"
            placeholder="User Wattpad sem @"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none"
            required
          />
        </div>

        <div class="relative">
          <Lock class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none"
            required
          />
        </div>
        
        <!-- Campo Confirmar Senha -->
        <div class="relative">
          <Lock class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Repita a Senha"
            :class="[
              'w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none',
              confirmPassword && confirmPassword !== password ? 'border-red-500' : ''
            ]"
            required
          />
        </div>

        <!-- Mensagem de erro mais clara -->
        <span
          v-if="confirmPassword && confirmPassword !== password"
          class="text-red-600 text-sm block text-center"
        >
          As senhas informadas são diferentes. Verifique e tente novamente.
        </span>

        <div class="relative">
          <User class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="nome"
            type="text"
            placeholder="Nome"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none"
            required
          />
        </div>

        <div class="relative">
          <Calendar class="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            v-model="idade"
            type="number"
            min="1"
            placeholder="Idade"
            class="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none"
            required
          />
        </div>

        <!-- Botão de envio com controle de validação -->
        <button
          :disabled="loading || !isFormValid"
          class="w-full py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-xl transition duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <RouterLink to="/login" class="text-blue-500 underline">Entrar</RouterLink>
      </p>

      <p class="text-center text-base text-gray-500">
        <RouterLink to="/" class="text-blue-500">Voltar para o Início</RouterLink>
      </p>
    </div>
  </div>
</template>
