<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean,
  label: string,
  id?: string
}>();

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <label :for="id" class="mr-3 text-sm text-white">{{ label }}</label>


    <button
      type="button"
      :id="id"
      @click="toggle"
      class="relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none"
      :class="modelValue ? 'bg-purple-600' : 'bg-gray-600'"
    >
      <span
        class="absolute left-2 top-2 text-xs text-white transition-opacity duration-200"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      >Sim</span>

      <span
        class="absolute right-2 top-2 text-xs text-white transition-opacity duration-200"
        :class="modelValue ? 'opacity-0' : 'opacity-100'"
      >Não</span>

      <div
        class="absolute top-0.5 left-0.5 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300"
        :class="modelValue ? 'translate-x-8' : 'translate-x-0'"
      />
    </button>
  </div>
</template>