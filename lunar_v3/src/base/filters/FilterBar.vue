<script setup lang="ts">
import SearchInput from '../Inputs.vue/SearchInput.vue';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Lucide from '../lucide/Lucide.vue';
import SearchFilter from './SearchFilter.vue';

const search = ref('');
const showFilterMenu = ref(false);
const filterMenuRef = ref<HTMLElement | null>(null);
const filterMenuRef2 = ref<HTMLElement | null>(null);
const activeFilters = ref([])

const selectedSortFilter = ref('');
const selectedGenre = ref('');
const selectedStyle = ref('');

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
const filters = [
  { label: 'Mais votados', value: 'votes_desc' },
  { label: 'Menos votados', value: 'votes_asc' },
  { label: 'Mais comentados', value: 'comments_desc' },
  { label: 'Menos comentados', value: 'comments_asc' },
  { label: 'Mais views', value: 'views_desc' },
  { label: 'Menos views', value: 'views_asc' },
];

function updateActiveFilter(type: 'sort' | 'genre' | 'style', value: string) {
  const index = activeFilters.value.findIndex(f => f.type === type);
  if (index !== -1) {
    activeFilters.value[index].value = value;
  } else {
    activeFilters.value.push({ type, value });
  }
}

function removeFilter(index: number) {
  const removed = activeFilters.value.splice(index, 1)[0];
  if (removed) {
    switch (removed.type) {
      case 'sort':
        emit('filters:sort', '');
        selectedSortFilter.value = ''
        break;
      case 'genre':
        emit('filters:genre', '');
        selectedGenre.value = ''
        break;
      case 'style':
        emit('filters:style', '');
        selectedStyle.value = ''
        break;
    }
  }
}

const handleSortFilter = (filter: string) => {
  emit('filters:sort', filter);
  updateActiveFilter('sort', filter);
};

const handleGenreFilter = (genre: string) => {
  emit('filters:genre', genre);
  updateActiveFilter('genre', genre);
};

const handelStyleFilter = (style: string) => {
  emit('filters:style', style);
  updateActiveFilter('style', style);
};
const handleClearFilter = () => {
  selectedSortFilter.value = '';
  selectedGenre.value = '';
  selectedStyle.value = '';
  activeFilters.value = [];
  emit('clear');
};

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

function getFilterLabel(filter: any): string {
  if (filter.type === 'genre') {
    return `${filter.value}`;
  }

  if (filter.type === 'style') {
    return `${filter.value}`;
  }

  if (filter.type === 'sort') {
    const match = filters.find(f => f.value === filter.value);
    return `${match ? match.label : filter.value}`;
  }

  return `${filter.type}: ${filter.value}`;
}
</script>


<template>
  <div class="flex flex-col items-between justify-start gap-3">
    <div 
      ref="filterMenuRef2"
      class="flex flex-col text-xs text-indigo-700 "
    >
      <div
        class="flex items-center justify-between gap-3"
      >
        <div
          class="flex items-center justify-center gap-1 cursor-pointer"
          @click="showFilterMenu = !showFilterMenu"
        >
          <Lucide
            icon="FilterX"
            class="w-3 h-3"
          />
          Filtros ativos: 
        </div>
        <template v-if="activeFilters.length === 0">
          Nenhum
        </template>
        <div    
          class="flex items-center justify-start cursor-pointer"
          @click="showFilterMenu = !showFilterMenu"
        >
          <Lucide 
            icon="ListFilterPlus"
            class="text-violet-800 w-5 h-5"
          />
        </div>
      </div>
      <div
        class="my-2"
      >        
        <template v-if="activeFilters.length">
          <span 
            v-for="(filter, index) in activeFilters" 
            :key="index"
            class="ml-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs cursor-pointer hover:bg-indigo-200 transition"
            @click="removeFilter(index)"
          >
            {{ getFilterLabel(filter) }}
          </span>
        </template>
      </div>
    </div>
    <div
      class="flex items-center justify-between"
    >
      <div class="w-full  mb-4">
        <SearchInput
          v-model="search"
          placeholder="Busque por gênero, nome do autor ou livro!"
        />
      </div>      
    </div>
  </div>  
	<span
    class="flex item items-center justify-start gap-1 text-xs text-indigo-700"
  >
    <Lucide
      icon="BookOpenText"
      class="w-3 h-3"
    />
    Obras encontradas: {{ props.total }}
  </span>

  <!-- Filtros com animação -->
  <transition name="fade-slide">
    <div
      v-show="showFilterMenu"
      ref="filterMenuRef"
      class="absolute z-50 w-full left-0"
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
