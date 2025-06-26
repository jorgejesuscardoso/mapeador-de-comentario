<script setup lang="ts">
import SearchInput from '../Inputs.vue/SearchInput.vue';
import { ref, watch } from 'vue';

const search = ref('');

const emit = defineEmits<{
  (e: 'search:books', value: string): void
}>();

// Emite sempre que o valor do input mudar
watch(search, (val) => {
  emit('search:books', val);
});

</script>

<template>
  <div class="w-full">
    <SearchInput
      v-model="search"
      placeholder="Busque por nome do autor ou livro!"
    />
  </div>
</template>
