<script setup lang="ts">
import SearchInput from '../Inputs.vue/SearchInput.vue';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Lucide from '../lucide/Lucide.vue';
import SearchFilter from './SearchFilter.vue';

const search = ref('');
const showFilterMenu = ref(false);
const filterMenuRef = ref<HTMLElement | null>(null);
const filterMenuRef2 = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: 'search:books', value: string): void;
  (e: 'filters:sort', value: string): void;
  (e: 'filters:genre', value: string): void;
  (e: 'filters:style', value: string): void;
  (e: 'clear'): void;  
}>();

const props = defineProps<{
  total: number
}>();

watch(search, (val) => {
  emit('search:books', val);
});

const handleSortFilter = (filter: string) => emit('filters:sort', filter);
const handleGenreFilter = (genre: string) => emit('filters:genre', genre);
const handelStyleFilter = (style: string) => emit('filters:style', style)
const handleClearFilter = () => emit('clear');

// Detecta clique fora
function handleClickOutside(event: MouseEvent) {
  if ((filterMenuRef.value && filterMenuRef2) && (!filterMenuRef.value.contains(event.target as Node) && !filterMenuRef2.value.contains(event.target as Node))) {
    showFilterMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>


<template>
  <div class="flex items-center justify-between gap-3">
    <div class="w-11/12 mt-3 mb-1">
      <SearchInput
        v-model="search"
        placeholder="Busque por gênero, nome do autor ou livro!"
      />
    </div>
    <div    
      ref="filterMenuRef2"
      class="flex items-center justify-end mr-2 cursor-pointer"
      @click="showFilterMenu = !showFilterMenu"
    >
      <Lucide 
        icon="ListFilterPlus"
        class="text-violet-800"
      />
    </div>
  </div>  
	<span
    class="text-xs text-indigo-700"
  >
    Obras encontradas: {{ props.total }}
  </span>

  <!-- Filtros com animação -->
  <transition name="fade-slide">
    <div
      v-show="showFilterMenu"
      ref="filterMenuRef"
      class="absolute z-50"
    >
      <SearchFilter    
        @filter="handleSortFilter"
        @genre="handleGenreFilter"
        @clear="handleClearFilter"
        @style="handelStyleFilter"
      />
    </div>
  </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

</style>
