<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue"
import { toast } from "@/base/utils/toast"
import { useRouter } from "vue-router"
import Lucide from "@/base/lucide/Lucide.vue"
import axios from "axios"
import { getUserById } from "@/API/UserApi"
import { formatDate } from "@/base/utils/FormatDate"
import { ShopUpdate } from "@/API/ShopLunar"

interface Order {
  id: string
  date: string
  total: string
  service: string
  qtd: number
  checked?: boolean
}

const orders = ref<Order[]>([])
const orderToDelet = ref()
const loading = ref(false)
const router = useRouter()
const showConfirmDeletModal = ref(false)

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
    orders.value = response.orders || []
  } catch (err) {
    toast.error("Erro ao buscar seus pedidos!")
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleDeletOrder = async () => {
  console.log('deletando o pedido: ', orderToDelet.value.service)
  const getUser = JSON.parse(localStorage.getItem('user'))
  if(!getUser || !getUser.user) {
    toast.error("Você não está logado! Efetue login para poder remover um pedido.")
    return router.push('/login')
  }

  try{
    const removeOrder = orders.value.filter((s) => s.service !== orderToDelet.value.service)

    const setUser = {
      orders: removeOrder,
      user: getUser.user
    }
    const response = await ShopUpdate(setUser)
    if(response.status !== 200) {
      toast.error('Erro ao tentar deletar o pedido! Tente novamente em alguns minutos.')
      return
    }

    toast.success("Pedido removido com sucesso!")
    orders.value = orders.value.filter(o => o.service !== orderToDelet.value.service)
    showConfirmDeletModal.value = false
  } catch(err) {
    console.error(err)
  }
}


const handleConfirmDelet = (order: any) => {
  orderToDelet.value = order
  showConfirmDeletModal.value = !showConfirmDeletModal.value
}

// total geral de todos os pedidos
const totalAllOrders = computed(() => {
  if (loading.value) return 0

  return orders.value.reduce((sum, order) => {
    const cleaned = order.total.replace(/[^\d,.-]/g, '').replace(',', '.')
    const value = parseFloat(cleaned) || 0
    return sum + value
  }, 0)
})


const formatCurrency = (value: number) => {
  if(loading.value) return null
  if(orders.value.some((s) => s.total.includes('Pontos Lunar'))) {
    return `${value} PL`
  }
  return null
}

onMounted(fetchOrders)
</script>

<template>
  <div class="lg:w-[85vw] bg-[rgba(0,0,0,0.75)] text-white rounded-lg p-6 shadow-lg w-full min-h-screen">
    <h1 class="text-2xl font-bold mb-4 flex items-center justify-between gap-2">
      <p
        class="flex items-center"
      >
        <Lucide icon="Package" /> 
        Meus Pedidos
      </p>
      <span v-if="!loading" class="font-bold text-green-400 text-lg">
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
        class="bg-purple-900/40 p-4 rounded-lg shadow border border-purple-700 relative"
      >
        <div
          v-if="!order.checked"
          class="absolute top-0.5 right-0.5"
          @click="handleConfirmDelet(order)"
        >
          <Lucide 
            icon="X"
            class="h-4 w-4 text-red-400"
          />
        </div>
        <span
          v-else          
          class="absolute top-0.5 right-0.5 text-sm rounded-full"
        >
          <Lucide
            icon="CheckCircle"
            class="text-green-400 bg-green-800 w-4 h-4 rounded-full"
          />
        </span>
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

    <!-- Modal confirme delete -->
    <div
      v-if="showConfirmDeletModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
    >
      <div class="bg-purple-950 text-white rounded-lg p-6 max-w-md w-full shadow-lg border border-purple-700">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Lucide icon="AlertTriangle" class="w-6 h-6 text-yellow-400" />
          Confirmar remoção
        </h2>

        <p class="mb-4 text-sm text-gray-300">
          ⚠️ Os pedidos exibidos sem ✅ ainda não foram atendidos.
          Você pode removê-los da fila. <br /><br />
          Pedidos já atendidos <strong>não podem ser removidos</strong>.
        </p>

        <div class="bg-purple-900/40 p-3 rounded-md border border-purple-700 mb-4">
          <p class="text-sm"><strong>Serviço:</strong> {{ orderToDelet?.service }}</p>
          <p class="text-sm"><strong>Qtd:</strong> {{ orderToDelet?.qtd }}</p>
          <p class="text-sm"><strong>Total:</strong> {{ orderToDelet?.total }}</p>
        </div>

        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
            @click="showConfirmDeletModal = false"
          >
            Cancelar
          </button>

          <button
            class="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="orderToDelet?.checked"
            @click="handleDeletOrder"
          >
            Remover
          </button>
        </div>
      </div>
    </div>



    <!-- footer só aparece se houver pedidos -->
    <footer v-if="orders.length > 0 && !loading" class="mt-6 p-4 bg-purple-800 rounded-lg flex justify-between items-center">
      <span class="font-bold text-white text-lg">Total geral:</span>
      <span class="font-bold text-green-400 text-lg">
        {{ formatCurrency(totalAllOrders) ?? totalAllOrders.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
      </span>
    </footer>
  </div>
</template>

