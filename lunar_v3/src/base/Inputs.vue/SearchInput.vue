<script setup lang="ts">
import { ref } from 'vue';
import Lucide from '../lucide/Lucide.vue';

const props = defineProps<{
  placeholder?: string
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

// Evento de input
const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="relative">
    <input 
      type="text"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="onInput"
      class="w-full bg-transparent border border-violet-500 rounded-lg pl-8 py-1 focus:outline-none focus:ring-0 text-violet-700 placeholder-violet-500"
    />
    <Lucide
      icon="Search"
      class="w-4 h-4 absolute top-1/2 left-2 transform -translate-y-1/2 text-violet-500"
    />
  </div>
</template>
