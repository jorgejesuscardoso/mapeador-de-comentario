<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router'
import { RegisterBook } from '@/API/BookApi'
import Lucide from '@/base/lucide/Lucide.vue'
import BaseSelect from '@/base/utils/BaseSelect.vue'
import { genres } from '@/base/utils/genre'

const nomeLivro = ref('')
const linkLivro = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const showForm = ref(false)
const selectedGenre = ref()

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
    class="min-w-full flex items-center justify-center rounded-xl bg-[rgb(0,0,0,0.8)] "
    :class="{
      'p-4': showForm,
      'py-2 px-4': !showForm
    }"
  >
    <div class="w-full w-md space-y-4">
      <h2 
        class="flex justify-between font-semibold text-start text-white cursor-pointer"
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
      <div v-if="success" class="text-green-600 bg-white text-sm font-semibold text-center px-3 py-2 rounded-md">
        <p>Livro enviado com sucesso! Pode demorar até 1h para aparecer na biblioteca!</p>
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
            class="bg-transparent w-full border border-violet-500 rounded px-3 py-1 focus:outline-none placeholder:text-gray-300 text-white"
            required
          />
        </div>

        <!-- <div>
          <BaseSelect
             label="Selecione um gênero"
            :options="genres"
            v-model="selectedGenre"
          />
        </div> -->

        <div
          class="w-full"
        >
          <label class="block mb-1 text-sm font-semibold text-white">Link do Livro</label>
          <input
            v-model="linkLivro"
            type="url"
            placeholder="https://www.wattpad.com/story/..."
            class="bg-transparent w-full border border-violet-500 rounded px-3 py-1 focus:outline-none placeholder:text-gray-300 text-white"
            required
          />
        </div>

        <button
          :disabled="loading"
          class="flex items-center justify-center text-sm mx-auto gap-2 w-full lg:w-32 border border-violet-500 hover:bg-pink-700 text-white font-medium py-2 rounded-xl transition disabled:opacity-50"
        >
          <Lucide 
            icon="Send"
            class="w-4 h-4"
          />
          {{ loading ? 'Enviando...' : '' }}
        </button>
      </form>
    </div>
  </div>
</template>
