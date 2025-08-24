<script setup lang="ts">
import { ref, computed, watch } from "vue"

const props = defineProps<{
  options: string[]    // lista de nomes
  placeholder?: string // texto placeholder
  modelValue: string   // valor selecionado
}>()

const emit = defineEmits(["update:modelValue", "select"])

// estado interno
const search = ref("")
const isOpen = ref(false)

// lista filtrada
const filtered = computed(() => {
  if (!search.value) return props.options
  return props.options.filter(o =>
    o.toLowerCase().includes(search.value.toLowerCase())
  )
})

// quando selecionar
const selectOption = (option: string) => {
  emit("update:modelValue", option)
  emit("select", option) // evento extra caso precise
  search.value = ""
  isOpen.value = false
}
</script>

<template>
  <div class="relative w-full">
    <!-- Input de busca -->
    <input
      v-model="search"
      :placeholder="placeholder || 'Pesquisar usuário...'"
      @focus="isOpen = true"
      class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 
             focus:border-purple-500 outline-none"
    />

    <!-- Dropdown -->
    <ul
      v-if="isOpen && filtered.length"
      class="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded shadow-lg max-h-40 overflow-y-auto"
    >
      <li
        v-for="(option, index) in filtered"
        :key="index"
        @click="selectOption(option)"
        class="px-3 py-2 cursor-pointer hover:bg-purple-600 hover:text-white"
      >
        {{ option }}
      </li>
    </ul>

    <!-- Sem resultados -->
    <div
      v-if="isOpen && !filtered.length"
      class="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-400 text-sm italic"
    >
      Nenhum usuário encontrado
    </div>
  </div>
</template>
