<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router'
import { RegisterBook } from '@/API/BookApi'

const nomeLivro = ref('')
const linkLivro = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

const submit = async () => {
  try {
    error.value = ''
    success.value = false
    loading.value = true

    const storedUser = localStorage.getItem('user')
    const parsed = storedUser ? JSON.parse(storedUser) : null

    if (!parsed?.user) {
      error.value = 'Usuário não autenticado!'
      loading.value = false
      return
    }

    const payload = {
      user: parsed.user,
      bookName: nomeLivro.value,
      bookUrl: linkLivro.value
    }

    const response = await RegisterBook(payload) // ajuste a rota conforme seu backend
    if(response.error) return error.value = response.error

    success.value = true
    nomeLivro.value = ''
    linkLivro.value = ''
  } catch (e) {
    error.value = e.message || 'Erro ao registrar'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-w-full flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
      <h2 class="text-xl font-semibold text-center text-indigo-600">Enviar Livro</h2>

      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm text-center">
        Livro enviado com sucesso!
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-600">Nome do Livro</label>
          <input
            v-model="nomeLivro"
            type="text"
            placeholder="Ex: O Guardião de Feras"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-600">Link do Livro</label>
          <input
            v-model="linkLivro"
            type="url"
            placeholder="https://www.wattpad.com/story/..."
            class="w-full border rounded-lg px-3 py-2 focus:outline-none"
            required
          />
        </div>

        <button
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Enviando...' : 'Enviar Livro' }}
        </button>
      </form>
    </div>
  </div>
</template>
