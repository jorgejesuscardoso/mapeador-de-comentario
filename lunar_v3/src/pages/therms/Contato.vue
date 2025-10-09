

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)

const sendMessage = async () => {
  loading.value = true
  success.value = false
  error.value = false

  try {
    // Aqui tu pode integrar com EmailJS, Zapier, Formspree, etc.
    await new Promise(resolve => setTimeout(resolve, 1500)) // simula envio

    success.value = true
    form.value = { name: '', email: '', message: '' }
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen w-full text-gray-200 flex flex-col justify-center items-center p-6">
    <div class="w-1/2">
      <h1 class="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
        Entre em Contato
      </h1>

      <p class="text-center text-sm text-gray-300 mb-10">
        Tem alguma dúvida, sugestão ou quer fazer parte do Projeto Lunar?
        Envie uma mensagem, ficaremos felizes em te responder.
      </p>

      <form @submit.prevent="sendMessage" class="bg-[#111] rounded-lg shadow-lg p-5 space-y-4 border border-gray-800">
        <div>
          <label for="name" class="block mb-2 text-sm font-medium">Nome</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            class="w-full p-2 rounded bg-[#1b1b1b] border border-gray-700 focus:ring-0 focus:ring-fuchsia-600 outline-none"
          />
        </div>

        <div>
          <label for="email" class="block mb-2 text-sm font-medium">E-mail</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            class="w-full p-2 rounded bg-[#1b1b1b] border border-gray-700 focus:ring-0 focus:ring-fuchsia-600 outline-none"
          />
        </div>

        <div>
          <label for="message" class="block mb-2 text-sm font-medium">Mensagem</label>
          <textarea
            v-model="form.message"
            id="message"
            rows="5"
            required
            class="w-full p-3 rounded bg-[#1b1b1b] border border-gray-700 focus:ring-0 focus:ring-fuchsia-600 outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full py-3 rounded bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 font-semibold transition-all"
          :disabled="loading"
        >
          {{ loading ? 'Enviando...' : 'Enviar Mensagem' }}
        </button>
      </form>

      <p v-if="success" class="text-green-400 text-center mt-6">Mensagem enviada com sucesso!</p>
      <p v-if="error" class="text-red-400 text-center mt-6">Erro ao enviar. Tente novamente mais tarde.</p>

      <div class="mt-12 text-center text-gray-400 text-sm">
        <p>Ou se preferir, envie um e-mail direto para:</p>
        <a href="mailto:contato@projetolunar.com.br" class="text-fuchsia-500 hover:underline">
          contato@projetolunar.com.br
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
