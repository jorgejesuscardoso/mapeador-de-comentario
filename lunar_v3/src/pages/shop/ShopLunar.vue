<script setup lang="ts">
import Lucide from '@/base/lucide/Lucide.vue'
import { ref } from "vue"

interface Service {
  id: string
  name: string
  description: string
  price: number
  icon: string
}

const services = ref<Service[]>([
  {
    id: "lunar",
    name: "🌙 Leitura Lunar",
    description: "Leitura de capítulo extra.",
    price: 0,
    icon: "Moon"
  },
  {
    id: "jornada",
    name: "🚀 Jornada Mística",
    description: "Leitura da obra completa, do prólogo ao fim.",
    price: 0,
    icon: "BookOpen"
  },
  {
    id: "chuva",
    name: "✨ Chuva de Estrelas",
    description: "Votos em todos os capítulos publicados.",
    price: 0,
    icon: "Star"
  },
  {
    id: "revisao",
    name: "🔎 Revisão",
    description: "Correção ortográfica e gramatical básica.",
    price: 0,
    icon: "Search"
  },
  {
    id: "critica",
    name: "📖 Leitura Crítica",
    description: "Análise profunda dos pontos fortes e fracos.",
    price: 0,
    icon: "ClipboardList"
  },
  {
    id: "aesthetic",
    name: "🎨 Aesthetic",
    description: "Estilo visual para divulgar sua obra nas redes.",
    price: 0,
    icon: "Palette"
  },
  {
    id: "divisoria",
    name: "⚡ Divisória",
    description: "Criação de divisórias para capítulos.",
    price: 0,
    icon: "Layout"
  },
  {
    id: "capa",
    name: "📕 Capa",
    description: "Design exclusivo de capa para sua história.",
    price: 0,
    icon: "Image"
  },
  {
    id: "arte",
    name: "🖌️ Arte Ilustrada",
    description: "Ilustração original de personagens ou cenas.",
    price: 0,
    icon: "Brush"
  }
])

const cart = ref<Service[]>([])

function addToCart(service: Service) {
  cart.value.push(service)
}

function removeFromCart(id: string) {
  cart.value = cart.value.filter(s => s.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-950/80 to-black/90 text-white p-6 mt-2 lg:mt-10">
    <h1 class="text-3xl font-bold text-center mb-6">Lojinha Lunar <span class="text-xs text-gray-400">(Fase de testes)</span></h1>

    <div    
      class="flex items-center justify-center rounded-full h-10 w-10 fixed lg:top-12 lg:right-3 right-1 top-16 bg-purple-600 z-10"
    >
      <div
        class="relative"
      >
        <span
          class="flex text-xs items-center justify-center min-w-4 min-h-4 absolute -top-3 -right-1 bg-white rounded-full text-red-600"
        >
          {{ cart.length }}
        </span>
        <Lucide icon="ShoppingCart" class="w-6 h-6" />
      </div>
    </div>


    <!-- Serviços -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-black/40 p-4 rounded-xl shadow-lg border border-purple-600 hover:scale-[1.02] transition"
      >
        <h2 class="text-lg font-semibold mb-1">{{ service.name }}</h2>
        <p class="text-sm text-gray-300 mb-3">{{ service.description }}</p>
        <p class="text-purple-400 font-bold mb-3">PL {{ service.price }},00</p>
        <button
          class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-sm font-semibold"
          @click="addToCart(service)"
        >
          Adicionar
        </button>
      </div>
    </div>

    <!-- Carrinho -->
    <div v-if="cart.length" class="mt-10 bg-black/50 p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-bold mb-4">🛒 Carrinho</h2>
      <ul class="space-y-2">
        <li
          v-for="(item, i) in cart"
          :key="i"
          class="flex justify-between items-center bg-purple-900/40 px-3 py-2 rounded-lg"
        >
          <span>{{ item.name }} - R$ {{ item.price }},00</span>
          <button class="text-red-400 text-xs" @click="removeFromCart(item.id)">Remover</button>
        </li>
      </ul>
      <div class="mt-4 font-bold text-right">
        Total: R$ {{ cart.reduce((sum, s) => sum + s.price, 0) }},00
      </div>
      <button
        class="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold w-full"
      >
        Finalizar Pedido
      </button>
    </div>
  </div>
</template>
