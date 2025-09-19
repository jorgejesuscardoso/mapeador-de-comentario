<script setup lang="ts">
import Lucide from '@/base/lucide/Lucide.vue'
import { ref, computed, inject, onMounted, watch } from "vue"
import { ShopItems } from './ShopItems'
import { toast } from '@/base/utils/toast'
import { ShopRequest } from '@/API/ShopLunar'
import { useRouter } from 'vue-router'

const route = useRouter()
const isAdmin = inject<boolean>('isAdmin')
const isLogged = ref(false)

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
    localStorage.setItem('cart', JSON.stringify(cart.value))
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
const finalizeOrder = async () => {
  const isUser = localStorage.getItem("user") || null
  const hasTest = localStorage.getItem("test") || null
  const userParsed = isUser ? JSON.parse(isUser) : ''
  if (!cart.value.length) {
    toast.error('Carrinho vazio — não tem o que finalizar.')
    return
  }
  if(!userParsed) {
    toast.error('É nécessário estar logado para efetuar uma compra! ')
    return
  } else if(hasTest) {
    toast.warning('Você já fez esse teste! Muito Obrigado!!')
    return
  }

  const getUser = JSON.parse(localStorage.getItem('user'))

  // aqui você decide: se selectedCurrency === 'pl' -> pagar com pontos, senão gateway R$
  // Exemplo simples:
  
  const data = {
    user: getUser.user,
    wtp: getUser.whatsappNumber,
    date: new Date().toLocaleString('pt-br'),
    total_order: cartTotalFormatted.value
  }
  if (selectedCurrency.value === 'pl') {
    toast.success(`Finalizando pedido — total ${cartTotalFormatted.value}`)
    const order = cart.value.map((s) => {
      return {
        service: s.service.name,
        qtd: s.qty,
        total: s.service.price.pl * s.qty + " Pontos Lunar"
      }
    })
    const payload = {
      ...data, orders: order
    }
    const response = await ShopRequest(payload)
    if(response.status !== 200) {
      toast.error('Erro durante a criação do seu pedido! Verifique seus dados e tenta novamente!')
      return
    } 
    toast.success('Pedido criado com sucesso! Administração entrará em contato com você em breve.')
    setTimeout(() => {    
      toast.success('Redirecionando!')
      cart.value = []
      showCart.value = false
      localStorage.removeItem('cart')
    }, 2000)

    setTimeout(() => {      
      route.push('/profile/orders')
    }, 3000)
  } else {
    toast.success(`Finalizando pedido — total ${cartTotalFormatted.value}`)
    const order = cart.value.map((s) => {
      return {
        service: s.service.name,
        qtd: s.qty,
        total: s.service.price.rl * s.qty + " Reais"
      }
    })
    const payload = {
      ...data, orders: order
    }
    const response = await ShopRequest(payload)
    if(response.status !== 200) {
      toast.error('Erro durante a criação do seu pedido! Verifique seus dados e tenta novamente!')
      return
    } 
    toast.success('Pedido criado com sucesso! Administração entrará em contato com você em breve.')
    setTimeout(() => {    
      toast.success('Redirecionando!')
      cart.value = []
      showCart.value = false
      localStorage.setItem('test', 'true')
    }, 5000)

    setTimeout(() => {      
      route.push('/profile/orders')
    }, 7000)
  }
}

onMounted(() => {
  const stored = localStorage.getItem("cart")
  if (stored) {
    try {
      cart.value = JSON.parse(stored)
    } catch (e) {
      console.error("Erro ao parsear cart do localStorage", e)
    }
  }
})

// sempre salvar quando mudar
watch(cart, (newVal) => {
  localStorage.setItem("cart", JSON.stringify(newVal))
}, { deep: true })
</script>

<template>
  <div class="lg:w-11/12 bg-gradient-to-b h-[92vh] lg:rounded-xl from-purple-950/80 to-black/90 text-white lg:px-6 px-3 pt-3 relative">
    <h1 class="text-3xl font-bold mb-3">Lojinha Lunar <span class="text-xs text-gray-400">(Fase de testes)</span></h1>

    <div
      class="flex justify-center items-center rounded-full h-8 w-8 p-1 bg-purple-500/50 absolute top-6 right-6 cursor-pointer"
      @click="showCart = true"
    >
      <span
        v-if="cart.length > 0"
        class="flex items-center justify-center font-semibold absolute top-0 lg:top-0.5 right-0 bg-white text-green-700 rounded-full w-4 lg:w-3 h-4 lg:h-3 text-xs lg:text-[10px]"
      >
        {{ cart.length }}
      </span>
      <Lucide
        icon="ShoppingCart"
        :stroke-width="2"
      />
    </div>

    <!-- Toggle de moeda -->
    <div class="flex flex-col justify-center gap-2 mb-3 px-1">
      <p
        class="text-sm text-gray-300"
      >
        Escolha como deseja pagar.
      </p>
      <div
        class="flex w-full justify-between lg:justify-start lg:gap-4 items-center text-sm"
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
      class="lg:grid xl:grid-cols-4 lg:grid-cols-3 lg:gap-x-2 max-h-[71vh] 2xl:max-h-[77vh] overflow-y-auto overflow-x-hidden pb-20"
    >
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-black/40 lg:p-4 p-3 rounded-xl shadow-lg border border-purple-600 hover:scale-[1.02] transition relative flex flex-col justify-between lg:gap-1 gap-2 mb-2"
      >
        <Lucide
          :icon="service.icon"
          class="absolute top-2 right-2"
        />
        <div
          class="flex flex-col justify-between items-start h-full mb-3"
        >
          <div>
            <h2 class="text-lg font-semibold lg:mb-1 mb-2">{{ service.name }}</h2>
            <p class="text-sm text-gray-300 lg:mb-2">{{ service.description }}</p>
          </div>

          <!-- observações -->
          <p v-if="service.obs" class="text-xs text-gray-400 italic mb-3">
            {{ service.obs }}
          </p>

          <!-- preços -->
          <div class="lg:mb-1 mb-3">
            <p class="text-purple-400 font-bold">{{ productPrice(service) }}</p>
            <p class="text-xs text-gray-400">
              ou {{ selectedCurrency === 'pl' ? formatBRL(service.price.rl) : formatPL(service.price.pl) }}
            </p>
          </div>
        </div>

        <!-- botão sempre no fim -->
        <button
          class="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-semibold mt-auto"
          @click="toggleCart(service)"
        >
          {{ cart.some(s => s.service.id === service.id) ? 'Remover do carrinho' : 'Adicionar ao carrinho' }}
        </button>
      </div>
    </div>

    <!-- Carrinho -->
    <div 
      v-if="showCart"
      class="fixed inset-0 lg:inset-auto lg:top-0 lg:right-2 lg:w-10/12 w-full lg:mt-10 mt-11 max-h-screen lg:max-h-[90vh] z-30 bg-black/90 pb-3 shadow-lg flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-purple-800">
        <h2 class="text-xl font-bold">
          🛒 Carrinho
          <span
            class="text-gray-300 text-xs font-thin"
          >
           ({{ cart.length }} itens)
          </span>
        </h2>
        <button @click="showCart = false" class="text-gray-300 hover:text-white">
          <Lucide icon="X" />
        </button>
      </div>
      <div 
        v-if="cart.length <= 0"
        class="flex flex-col items-center justify-center text-center text-gray-300 py-12"
      >
        <Lucide icon="ShoppingCart" class="w-12 h-12 text-purple-400 mb-3" />
        <p class="text-lg font-semibold">Seu carrinho está vazio!</p>
        <p class="text-sm text-gray-500">Adicione alguns serviços para continuar 🚀</p>
      </div>

      <!-- Conteúdo scrollável -->
      <div class="flex overflow-y-auto p-4 h-[90%]">
        <ul class="space-y-2">
          <li
            v-for="(item, i) in cart"
            :key="item.service.id"
            class="flex justify-between items-center bg-purple-900/40 px-3 py-2 rounded-lg"
          >
            <div class="flex flex-col">
              <span class="font-semibold">{{ item.service.name }}</span>
              <span class="text-xs text-gray-300">{{ formatPriceForDisplay(item.service.price, selectedCurrency) }}</span>
              <span class="text-xs text-gray-500">
                Subtotal: <strong>
                  {{ selectedCurrency === 'pl' 
                    ? `${item.service.price.pl * item.qty} PL` 
                    : formatBRL(item.service.price.rl * item.qty) }}
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
      </div>

      <!-- Rodapé fixo -->
      <div class="px-4 pt-2 border-t border-purple-800">
        <div class="flex items-center justify-between font-bold text-right">
          
          <button @click="clearCart" class="p-2 rounded-lg font-bold text-xs bg-red-700 ">
            Limpar Carrinho
          </button>
          <!-- <button 
            @click="finalizeOrder" 
            class="p-2 rounded-lg font-bold text-xs  text-white"
            :class="{
              'bg-gray-300': !isAdmin,
              'bg-green-600': isAdmin
            }"
            :disabled="!isAdmin"
          > -->

          <button 
            @click="finalizeOrder" 
            class="p-2 rounded-lg font-bold text-xs  text-white bg-green-600"
          >
            Finalizar pedido
          </button>

          <p
            class="text-sm"
          >
            Total: 
            <span 
              class="ml-2"
              :class="{
                'text-[#16A34A]': cartTotalFormatted.includes('R$'),
                'text-purple-500': !cartTotalFormatted.includes('R$')
              }"
            >
              {{ cartTotalFormatted }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
