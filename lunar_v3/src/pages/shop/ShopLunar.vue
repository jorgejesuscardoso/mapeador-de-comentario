<script setup lang="ts">
import Lucide from '@/base/lucide/Lucide.vue'
import { ref, computed } from "vue"
import { ShopItems } from './ShopItems'

interface Service {
  id: string
  name: string
  description: string
  obs: string
  price: { 
    pl: number; 
    rl: number 
  }
  icon: string
}

interface CartItem {
  service: Service
  qty: number
}

const showCart = ref(false)

// produtos (supondo ShopItems já exporta array de Service)
const services = ref<Service[]>(ShopItems)

// carrinho agora com qty por item
const cart = ref<CartItem[]>([])

// moeda selecionada pelo usuário: 'pl' (pontos) ou 'rl' (reais)
const selectedCurrency = ref<'pl'|'rl'>('pl')

// HELPERS
const formatBRL = (v: number) => {
  // formata em reais com símbolo
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}
const formatPL = (v: number) => `${v} PL`

function formatPriceForDisplay(priceObj: Service['price'], currency: 'pl'|'rl') {
  return currency === 'pl' ? formatPL(priceObj.pl) : formatBRL(priceObj.rl)
}

// ADD / REMOVE / TOGGLE
function addToCart(service: Service, qty = 1) {
  const idx = cart.value.findIndex(i => i.service.id === service.id)
  if (idx === -1) {
    cart.value.push({ service, qty })
  } else {
    cart.value[idx].qty += qty
  }
}

function removeFromCart(id: string) {
  cart.value = cart.value.filter(s => s.service.id !== id)
}

function updateQty(id: string, qty: number) {
  const idx = cart.value.findIndex(i => i.service.id === id)
  if (idx === -1) return
  if (qty <= 0) {
    removeFromCart(id)
  } else {
    cart.value[idx].qty = qty
  }
}

function toggleCart(service: Service) {
  const exists = cart.value.some(s => s.service.id === service.id)
  if (exists) removeFromCart(service.id)
  else addToCart(service, 1)
}

function clearCart() {
  cart.value = []
}

// COMPUTEDS para totais (reativos)
const totalPL = computed(() => cart.value.reduce((sum, c) => sum + c.service.price.pl * c.qty, 0))
const totalRL = computed(() => cart.value.reduce((sum, c) => sum + c.service.price.rl * c.qty, 0))

const cartTotalFormatted = computed(() => {
  return selectedCurrency.value === 'pl' ? formatPL(totalPL.value) : formatBRL(totalRL.value)
})

// utilitário: retorna preço (string) para produto conforme moeda selecionada
function productPrice(service: Service) {
  return formatPriceForDisplay(service.price, selectedCurrency.value)
}

// checkout simple validation
function finalizeOrder() {
  if (!cart.value.length) {
    alert('Carrinho vazio — não tem o que finalizar.')
    return
  }
  // aqui você decide: se selectedCurrency === 'pl' -> pagar com pontos, senão gateway R$
  // Exemplo simples:
  if (selectedCurrency.value === 'pl') {
    alert(`Finalizando pedido em PONTOS — total ${cartTotalFormatted.value}`)
  } else {
    alert(`Redirecionando para pagamento em REAIS — total ${cartTotalFormatted.value}`)
  }
}

// opcional: persistência local (se quiser)
// localStorage.setItem('cart', JSON.stringify(cart.value)), etc.
// e carregar no onMounted
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-950/80 to-black/90 text-white p-6 mt-2 lg:mt-10 pb-16">
    <h1 class="text-3xl font-bold text-center mb-6">Lojinha Lunar <span class="text-xs text-gray-400">(Fase de testes)</span></h1>

    <!-- Toggle de moeda -->
    <div class="flex flex-col justify-center gap-4 mb-6">
      <p
        class="text-sm text-gray-300"
      >
        Escolha como deseja pagar.
      </p>
      <div
        class="flex w-full justify-between items-center"
      >
        <button
          @click="selectedCurrency = 'pl'"
          :class="['px-4 py-1 rounded-lg font-bold', selectedCurrency === 'pl' ? 'bg-green-600' : 'bg-purple-500 text-white']"
        >
          Pontos Lunar (PL)
        </button>
        <button
          @click="selectedCurrency = 'rl'"
          :class="['px-4 py-1 rounded-lg font-bold', selectedCurrency === 'rl' ? 'bg-green-600' : 'bg-purple-500 text-white']"
        >
          Pix (R$)
        </button>
      </div>
    </div>

    <!-- Serviços -->
    <div
      v-for="service in services"
      :key="service.id"
      class="bg-black/40 p-4 rounded-xl shadow-lg border border-purple-600 hover:scale-[1.02] transition relative flex flex-col justify-between"
    >
      <Lucide
        :icon="service.icon"
        class="absolute top-2 right-2"
      />
      <div>
        <h2 class="text-lg font-semibold mb-1">{{ service.name }}</h2>
        <p class="text-sm text-gray-300 mb-3">{{ service.description }}</p>

        <!-- preços -->
        <div class="mb-3">
          <p class="text-purple-400 font-bold">{{ productPrice(service) }}</p>
          <p class="text-xs text-gray-400">
            ou {{ selectedCurrency === 'pl' ? formatBRL(service.price.rl) : formatPL(service.price.pl) }}
          </p>
        </div>

        <!-- observações -->
        <p v-if="service.obs" class="text-xs text-gray-400 italic mb-3">
          {{ service.obs }}
        </p>
      </div>

      <!-- botão sempre no fim -->
      <button
        class="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-semibold mt-auto"
        @click="toggleCart(service)"
      >
        {{ cart.some(s => s.service.id === service.id) ? 'Remover do carrinho' : 'Adicionar ao carrinho' }}
      </button>
    </div>

    <!-- Carrinho -->
    <div 
      v-if="showCart"
      class="mt-10 bg-black/90 p-6 rounded-xl shadow-lg fixed lg:top-0 lg:right-2 lg:w-10/12 w-full inset-0 lg:inset-auto lg:h-screen z-30 overflow-auto"
    >
      <h2 class="text-xl font-bold mb-4">🛒 Carrinho</h2>
      <ul class="space-y-2">
        <li
          v-for="(item, i) in cart"
          :key="item.service.id"
          class="flex justify-between items-center bg-purple-900/40 px-3 py-2 rounded-lg"
        >
          <div class="flex flex-col">
            <span class="font-semibold">{{ item.service.name }}</span>
            <span class="text-xs text-gray-300">{{ formatPriceForDisplay(item.service.price, selectedCurrency) }}</span>
            <span class="text-xs text-gray-500">Subtotal: 
              <strong>
                {{ selectedCurrency === 'pl' ? `${item.service.price.pl * item.qty} PL` : formatBRL(item.service.price.rl * item.qty) }}
              </strong>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button class="px-2 py-1 bg-gray-700 rounded" @click="updateQty(item.service.id, item.qty - 1)">-</button>
            <span class="px-2">{{ item.qty }}</span>
            <button class="px-2 py-1 bg-gray-700 rounded" @click="updateQty(item.service.id, item.qty + 1)">+</button>
            <button class="text-red-400 text-xs ml-2" @click="removeFromCart(item.service.id)">Remover</button>
          </div>
        </li>
      </ul>

      <div class="mt-4 font-bold text-right">
        Total: <span class="ml-2">{{ cartTotalFormatted }}</span>
      </div>

      <div class="flex gap-2 mt-4">
        <button @click="clearCart" class="p-2 rounded-lg font-bold text-xs text-red-700 bg-purple-300">Limpar Carrinho</button>
        <button @click="showCart = false" class="p-2 rounded-lg font-bold text-xs text-gray-800 bg-gray-200">Continuar comprando</button>
        <button @click="finalizeOrder" class="ml-auto p-2 rounded-lg font-bold text-xs bg-green-600">Finalizar pedido</button>
      </div>
    </div>

    <!-- Rodapé fixo -->
    <footer 
      v-if="cart.length && !showCart"
      class="fixed bottom-0 left-0 w-full bg-purple-950/90 text-white shadow-xl p-4 flex justify-between items-center z-20"
    >
      <div class="flex gap-2">
        <button 
          @click="clearCart"
          class="p-2 rounded-lg font-bold text-xs text-red-700 bg-purple-300"
        >
          Limpar Carrinho
        </button>        
        <button 
          @click="showCart = true"
          class="p-2 rounded-lg font-bold text-xs text-green-700 bg-green-300"
        >
          Finalizar pedido
        </button>
      </div>
      <span class="text-sm font-semibold flex">
        Total: <p class="ml-2 font-bold">{{ cartTotalFormatted }}</p>
      </span>
    </footer>
  </div>
</template>
