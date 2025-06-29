<script setup lang="ts">
import { ref, watch } from 'vue';
import Lucide from '../lucide/Lucide.vue';

const emit = defineEmits<{
  (e: 'filter', filter: string): void;
  (e: 'genre', genre: string): void;  
  (e: 'style', style: string): void;
  (e: 'clear'): void;
}>();


const filters = [
  { label: 'Mais votados', icon: 'ThumbsUp', value: 'votes_desc' },
  { label: 'Menos votados', icon: 'ThumbsDown', value: 'votes_asc' },
  { label: 'Mais comentados', icon: 'MessageSquare', value: 'comments_desc' },
  { label: 'Menos comentados', icon: 'MessageCircleOff', value: 'comments_asc' },
  { label: 'Mais views', icon: 'Eye', value: 'views_desc' },
  { label: 'Menos views', icon: 'EyeOff', value: 'views_asc' },
];

const clearFilters = { label: 'Limpar Filtros', icon: 'Trash2', value: 'clear' }

const genres = [
  'Fantasia', 'Romance', 'Mistério', 'Ação', 'Aventura', 'Drama', 'Comédia', 
  'DarkRomance', 'Terror', 'Gore', 'Slice of Life', 'Histórico', 'Ficção Científica', 'Sobrenatural', 'Thriller',
  'Apocalipse', 'Magia', 'Espiritual', 'Cultivo', 'Reencarnação',
  'Isekai', 'LGBT', 'Psicológico', 'Policial', 'Steampunk', 'Mitologia', 'Cyberpunk', 'Tragédia', 'Escolar', 'Distopia'
];

const styles = [
  'Novel','Light Novel','Web Novel','Prosa', 'Conto', 'Crônica', 'Poesia', 'Cartas', 'Diário', 'Narrativa Fragmentada', 'One-shot'
];

const selectedGenre = ref('');
const selectedFilter = ref('');
const selectedStyle = ref('');

const handleClearFilter = () => {
  selectedFilter.value = '';
  selectedGenre.value = '';
  selectedStyle.value = '';
  emit('clear');
};

</script>

<template>
  <div class="w-full bg-white rounded-xl shadow p-4 border border-violet-200 mt-4">
    <!--Limpar filtros-->
    <div
      class="absolute top-4 right-4"
    >
      <button
        @click="handleClearFilter"
        :class="[
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all',
          selectedFilter === clearFilters.value ? 'bg-violet-500 text-white' : 'hover:bg-violet-100 text-violet-800',
        ]"
      >
        <Lucide :icon="clearFilters.icon" class="w-4 h-4" />
        <span>{{ clearFilters.label }}</span>
      </button>
    </div>
    <!-- Filtros principais -->
    <div class="grid grid-cols-[auto_auto] grid-rows-3 gap-2 mb-4 w-10/12 pr-8">
    <button
      v-for="f in filters"
      :key="f.value"
      @click="() => { selectedFilter = f.value; emit('filter', f.value); }"
      :class="[ 
        'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all',
        selectedFilter === f.value ? 'bg-violet-500 text-white' : 'hover:bg-violet-100 text-violet-800'
      ]"
    >
    <Lucide :icon="f.icon" class="w-4 h-4" />
    <span>{{ f.label }}</span>
  </button>
</div>

    <!-- Gêneros -->
    <div>
      <h4 class="text-xs font-semibold text-violet-600 mb-2">Filtrar por Gênero</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="genre in genres"
          :key="genre"
          @click="() => { selectedGenre = genre; emit('genre', genre); }"
          :class="[
            'px-3 py-1 text-sm rounded-full border transition-all',
            selectedGenre === genre
              ? 'bg-violet-500 text-white border-violet-500'
              : 'bg-white text-violet-800 hover:bg-violet-100 border-violet-200',
          ]"
        >
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Estilo de Escrita -->
    <div class="mt-8">
      <h4 class="text-xs font-semibold text-violet-600 mb-2">Filtrar por Estilo de Escrita</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="style in styles"
          :key="style"
          @click="() => { selectedStyle = style; emit('style', style); }"
          :class="[
            'px-3 py-1 text-sm rounded-full border transition-all',
            selectedStyle === style
              ? 'bg-violet-500 text-white border-violet-500'
              : 'bg-white text-violet-800 hover:bg-violet-100 border-violet-200',
          ]"
        >
          {{ style }}
        </button>
      </div>
    </div>

  </div>
</template>
