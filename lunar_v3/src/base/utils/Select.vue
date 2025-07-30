<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  books: Array,
  modelValue: String,
  errors: Object
});


const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectBook = (book) => {
  emit('update:modelValue', book.book_id);
  isOpen.value = false;
};

const selectedBookName = computed(() => {
  const book = props.books?.find((b) => b.book_id === props.modelValue);
  return book?.book_name || null;
});

const labelText = computed(() => {
  const book = props.books?.find((b) => b.book_id === props.modelValue);
  return book ? 'Obra selecionada' : 'Selecione uma obra';
});
</script>


<template>
  <div class="relative w-full" @v-click-outside="isOpen = false">
    <label class="text-sm text-purple-300 block mb-1">
      {{ labelText }}
    </label>

    <button
      type="button"
      @click="toggleDropdown"
      class="w-full bg-black/40 border border-purple-400 text-white px-4 py-2 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-600"
    >
      <span>{{ selectedBookName || 'Selecione...' }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full bg-black border border-purple-500 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="book in books"
        :key="book.book_id"
        @click="selectBook(book)"
        class="px-4 py-2 hover:bg-purple-600 hover:text-white cursor-pointer text-white"
      >
        {{ book.book_name }}
      </li>
    </ul>

    <span class="text-xs text-red-400 mt-1 block">{{ errors.selectedObraId }}</span>
  </div>
</template>
