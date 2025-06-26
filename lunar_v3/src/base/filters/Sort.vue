<script setup lang="ts">
import SearchInput from '../Inputs.vue/SearchInput.vue';
import { ref, watch } from 'vue';
import Lucide from '../lucide/Lucide.vue';
import SearchFilter from './SearchFilter.vue';

const search = ref('');
const showFilterMenu = ref(false)

const emit = defineEmits<{
  (e: 'search:books', value: string): void;
  (e: 'filters:sort', value: string): void;
  (e: 'filters:genre', value: string): void;
  (e: 'clear'): void;  
}>();

// Emite sempre que o valor do input mudar
watch(search, (val) => {
  emit('search:books', val);
});

const handleSortFilter = (filter: string) => {
  emit('filters:sort', filter);
};

const handleGenreFilter = (genre: string) => {
  emit('filters:genre', genre);
};

const handleClearFilter = () => {
  emit('clear');
};

</script>

<template>
  <div
    class="flex items-center justify-between gap-3"
  >
    <div class="w-11/12 my-3">
      <SearchInput
        v-model="search"
        placeholder="Busque por nome do autor ou livro!"
      />
    </div>

    <div
      class="flex items-center justify-end mr-2 cursor-pointer"
      @click="showFilterMenu = !showFilterMenu"
    >
      <Lucide 
        icon="ListFilterPlus"
        class="text-violet-800"
      />
    </div>

  </div>

  <!-- filtros -->
  <div
    v-if="showFilterMenu"
  >
    <SearchFilter    
      @filter="handleSortFilter"
      @genre="handleGenreFilter"
      @clear="handleClearFilter"
    />
  </div>
  
</template> 
