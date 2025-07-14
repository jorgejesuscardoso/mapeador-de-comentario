<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router'
import { RegisterBook } from '@/API/BookApi'
import Lucide from '@/base/lucide/Lucide.vue'

const nomeLivro = ref('')
const linkLivro = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const showForm = ref(false)

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
  <div 
    class="min-w-full flex items-center justify-center border px-4 rounded-xl"
    :class="{
       'bg-fuchsia-500 py-1': !showForm,
       'bg-fuchsia-500/90 py-4': showForm
    }"
  >
    <div class="w-full w-md space-y-4">
      <h2 
        class="flex justify-between font-semibold text-start text-white -700  cursor-pointer"
        @click="showForm = !showForm"
        :class="{
          'border-b border-fuchsia-400' : showForm,
          '' : !showForm
        }"
      >
      <p
        class="flex items-center justify-center gap-1"
        :class="{
          'text-base' : showForm,
          'text-sm' : !showForm
        }"
      >
        <Lucide 
          icon="BookOpenText"
          class="h-4 w-4"
       />
       Enviar Livro
      </p>
       <Lucide 
          :icon="!showForm ? 'ChevronDown' : 'ChevronUp'"
       />
      </h2>

      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      <div v-if="success" class="text-green-600 bg-white text-sm font-semibold text-center">
        <p>Livro enviado com sucesso! Pode demorar até 1hr para aparecer na biblioteca!</p>
      </div>

      <form 
        v-if="showForm"
        @submit.prevent="submit" class="space-y-4"
      >
        <div
          class="w-full"
        >
          <label class="block mb-1 text-sm font-semibold text-white">Nome do Livro</label>
          <input
            v-model="nomeLivro"
            type="text"
            placeholder="Ex: As crônicas de Narnia"
            class="w-full border rounded px-3 py-1 focus:outline-none placeholder:text-pink-500"
            required
          />
        </div>

        <div
          class="w-full"
        >
          <label class="block mb-1 text-sm font-semibold text-white">Link do Livro</label>
          <input
            v-model="linkLivro"
            type="url"
            placeholder="https://www.wattpad.com/story/..."
            class="w-full border rounded px-3 py-1 focus:outline-none placeholder:text-pink-500"
            required
          />
        </div>

        <button
          :disabled="loading"
          class="flex items-center justify-center text-sm mx-auto gap-2 w-full lg:w-32 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-xl transition disabled:opacity-50"
        >
          <Lucide 
            icon="Send"
            class="w-4 h-4"
          />
          {{ loading ? 'Enviando...' : 'Enviar Livro' }}
        </button>
      </form>
    </div>
  </div>
</template>
