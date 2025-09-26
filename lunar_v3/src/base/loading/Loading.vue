<script setup lang="ts">
import Lucide from '../lucide/Lucide.vue';

const props = defineProps<{
  isLoading: boolean
}>()

</script>

<template>
  <div v-if="props.isLoading" class="flex flex-col items-center justify-center lg:-translate-x-32 -translate-y-8 text-center text-purple-700 animate-pulse fixed z-10 lg:w-screen w-full h-screen">
      <div class="bg-fuchsia-100/60 p-4 rounded-xl shadow w-11/12 max-w-md border border-purple-300">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Lucide icon="Loader2" class="w-5 h-5 animate-spin text-purple-600" />
          <span class="text-base font-medium"><slot name="title"/></span>
        </div>
        <p class="text-sm text-gray-600"><slot name="description"/></p>
      </div>
    </div> 
</template>