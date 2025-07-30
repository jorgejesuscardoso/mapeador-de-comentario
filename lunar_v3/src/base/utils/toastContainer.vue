<script setup lang="ts">
import { useToasts } from '@/base/utils/toast'
import Lucide from '@/base/lucide/Lucide.vue'

const toasts = useToasts()
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-enter-active {
  transition: all 0.4s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-active {
  transition: all 0.4s ease;
}
</style>

<template>
  <div class="fixed top-16 lg:top-6 right-4 z-50">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="justify-center min-w-60 w-fit px-3 h-14 rounded-xl shadow-lg text-white text-xl font-minimun flex items-center"
        :class="t.type === 'success' ? 'bg-green-600/70' : t.type === 'warning' ? 'bg-orange-600/70' :'bg-red-600/70'"
      >
        <Lucide :icon="t.type === 'success' ? 'CheckCircle2' : 'XCircle'" class="w-5 h-5 text-white mr-2" />
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
