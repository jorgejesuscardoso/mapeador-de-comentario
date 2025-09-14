<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const emit = defineEmits(["close"])
</script>

<template>
  <div class="w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/65">
    <div
      class="bg-black/85 text-white p-6 rounded-2xl shadow-2xl max-w-md w-[90%] relative border border-fuchsia-500/40"
    >
      <!-- Botão de fechar -->
      <button
        class="absolute top-3 right-3 text-gray-300 hover:text-white transition"
        @click="emit('close')"
      >
        ✕
      </button>

      <!-- Cabeçalho -->
      <h2 class="text-lg font-bold text-center text-fuchsia-400">
        Olá! 👋
      </h2>
      
      <h3 class="text-sm font-bold text-center text-purple-400 my-3">
        ⚠️ Leia com atenção! ⚠️ 
      </h3>

      <!-- Mensagem -->
      <p class="text-sm text-center text-gray-300 mb-5 leading-relaxed">
        Caso você esqueça sua senha e precise recuperá-la, é necessário ter um número de 
        <span class="text-green-400 font-semibold">WhatsApp</span> cadastrado no seu perfil. 
        <br />
        Sem esse número, não será possível enviar o código de confirmação.
      </p>
      <p class="text-sm text-center text-gray-300 leading-relaxed">
        Aproveite e cadastre agora, é rapido e custa nada!
      </p>
      <button      
       @click="router.push('/profile/edit')"
       class="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition duration-200 mb-5"
      >
        Cadastrar WhatsApp
      </button>
      <!-- CTA -->
      <div class="flex justify-center">
        <button
          @click="emit('close')"
          class="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white font-medium"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>
