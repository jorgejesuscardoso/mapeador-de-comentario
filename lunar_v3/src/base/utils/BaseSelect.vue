<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  label: string;
  options: string[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: string) => {
  emit('update:modelValue', option);
  isOpen.value = false;
};

const selectedOption = computed(() => {
  return props.modelValue || null;
});
</script>

<template>
  <div class="relative w-full" @v-click-outside="isOpen = false">
    <label class="text-sm text-purple-300 block mb-1">
      {{ selectedOption ? label + ' selecionado' : label }}
    </label>

    <button
      type="button"
      @click="toggleDropdown"
      class="w-full bg-black/40 border border-purple-400 text-white px-4 py-2 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-600"
    >
      <span>{{ selectedOption || 'Selecione...' }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full bg-black border border-purple-500 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        class="px-4 py-2 hover:bg-purple-600 hover:text-white cursor-pointer text-white"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>
