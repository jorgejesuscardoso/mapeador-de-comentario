<script setup lang="ts">
import { ref, inject } from "vue"
import Lucide from "@/base/lucide/Lucide.vue"

const isAdmin = inject('isAdmin')

interface Notification {
  id: number
  message: string
  time: string
  read: boolean
}

const notifications = ref<Notification[]>([  
  { id: 1, message: "NOTIFICAÇÔES DE TESTES! Só adms estão vendo isso!", time: "1 milhão de anos atrás", read: false },
  { id: 1, message: "Novo pedido recebido!", time: "2 min atrás", read: false },
  { id: 2, message: "Pagamento confirmado 💸", time: "10 min atrás", read: true },
  { id: 3, message: "Cliente deixou um feedback ⭐⭐⭐⭐⭐", time: "1h atrás", read: false },
])

const markAsRead = (id: number) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.read = true
}

const clearAll = () => {
  notifications.value = []
}
</script>

<template>
  <div
    class="absolute top-14 right-0 bg-white dark:bg-slate-900 shadow-lg rounded-lg w-72 overflow-hidden border border-slate-300 dark:border-slate-700"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <Lucide icon="Bell" class="w-4 h-4" />
        Notificações <span class="text-xs font-thin text-gray-400">(fase de teste)</span>
      </h3>
      <button
        @click="clearAll"
        class="text-xs text-red-500 hover:underline"
        v-if="notifications.length"
      >
        Limpar tudo
      </button>
    </div>

    <!-- Lista -->
    <ul v-if="notifications.length && isAdmin" class="max-h-60 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
      <li
        v-for="n in notifications"
        :key="n.id"
        class="p-3 flex flex-col cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        @click="markAsRead(n.id)"
      >
        <span
          :class="[
            'text-sm',
            n.read ? 'text-slate-500' : 'font-medium text-slate-800 dark:text-slate-100'
          ]"
        >
          {{ n.message }}
        </span>
        <span class="text-xs text-slate-400 mt-1">{{ n.time }}</span>
      </li>
    </ul>

    <!-- Vazio -->
    <div v-else class="p-4 text-center text-sm text-slate-500">
      Nenhuma notificação 📭
    </div>
  </div>
</template>
