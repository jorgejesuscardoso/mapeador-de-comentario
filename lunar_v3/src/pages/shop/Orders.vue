<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { toast } from "@/base/utils/toast"
import { useRouter } from "vue-router"
import Lucide from "@/base/lucide/Lucide.vue"
import axios from "axios"
import { getUserById } from "@/API/UserApi"
import { formatDate } from "@/base/utils/FormatDate"

interface Order {
  id: string
  date: string
  total: string
  service: string
  qtd: number
}

const orders = ref<Order[]>([])
const loading = ref(false)
const router = useRouter()

const fetchOrders = async () => {
  try {
    loading.value = true
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.user) {
      toast.error("Usuário não encontrado. Faça login novamente.")
      router.push("/login")
      return
    }
    const response = await getUserById(user.user)
    console.log(response)
    orders.value = response.orders
  } catch (err) {
    toast.error("Erro ao buscar seus pedidos!")
    console.error(err)
  } finally {
    loading.value = false
  }
}

// total geral de todos os pedidos
const totalAllOrders = computed(() => {
  return orders.value.reduce((sum, order) => {
    // remove tudo que não seja dígito ou ponto/virgula
    const cleaned = order.total.replace(/[^\d,.-]/g, '').replace(',', '.')
    const value = parseFloat(cleaned) || 0
    return sum + value
  }, 0)
})

const formatCurrency = (value: number) => {
  if(orders.value.some((s) => s.total.includes('Pontos Lunar'))) {
    return `${value} PL`
  }
  return null
}

onMounted(fetchOrders)
</script>

<template>
  <div class="bg-gradient-to-b from-purple-950/80 to-black/90 text-white rounded-lg p-6 shadow-lg w-full min-h-screen">
    <h1 class="text-2xl font-bold mb-4 flex items-center justify-between gap-2">
      <p
        class="flex items-center"
      >
        <Lucide icon="Package" /> 
        Meus Pedidos
      </p>
      <span class="font-bold text-green-400 text-lg">
        {{ formatCurrency(totalAllOrders) ?? totalAllOrders.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
      </span>
    </h1>
    <!-- loading -->
    <div v-if="loading" class="text-gray-200">Carregando seus pedidos...</div>

    <!-- vazio -->
    <div v-else-if="orders.length === 0" class="text-gray-200">
      Você ainda não fez nenhum pedido 🚀
    </div>

    <!-- pedidos -->
    <div v-else class="space-y-4">
      <div
        v-for="(order,i) in orders"
        :key="i"
        class="bg-purple-900/40 p-4 rounded-lg shadow border border-purple-700"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs text-gray-300">
            <Lucide icon="Calendar" class="inline-block w-4 h-4 mr-1" />
            {{ formatDate(order.date) }}
          </span>
          <span class="font-bold text-green-400 text-xs">Total: {{ order.total }}</span>
        </div>

        <ul class="space-y-1 text-sm">
          <li
            class="flex justify-between border-b border-purple-700/50 pb-1"
          >
            <span>{{ order.service }} (x{{ order.qtd }})</span>
            <span class="text-gray-300">{{ order.total }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- footer só aparece se houver pedidos -->
    <footer v-if="orders.length > 0" class="mt-6 p-4 bg-purple-800 rounded-lg flex justify-between items-center">
      <span class="font-bold text-white text-lg">Total geral:</span>
      <span class="font-bold text-green-400 text-lg">
        {{ formatCurrency(totalAllOrders) ?? totalAllOrders.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
      </span>
    </footer>
  </div>
</template>

