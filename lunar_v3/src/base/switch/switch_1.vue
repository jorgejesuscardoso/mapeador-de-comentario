<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps({
  label: { type: String, default: "Adicionar ou Remover" },
  texts: {
    type: Object as () => { add: string; remove: string; none: string },
    default: () => ({ add: "Adicionar", remove: "Remover", none: "Nenhum" })
  },
  buttons: {
    type: Object as () => { save: string; cancel: string },
    default: () => ({ save: "Salvar", cancel: "Cancelar" })
  },
  inputType: { type: String, default: "number" },
  modelValue: { type: [Boolean, null] as unknown as () => boolean | null, default: null },
  disabled: { type: Boolean, default: false } // 🚨 nova prop pra bloquear
});

const emit = defineEmits(["update:modelValue", "save", "cancel", "click"]);

const state = ref<boolean | null>(props.modelValue);

watch(
  () => props.modelValue,
  (val) => { state.value = val; }
);

const toggleSwitch = () => {
  emit("click"); // 🔑 deixa a lógica de permissão fora
  if (props.disabled) return; // 🚨 não mexe se estiver travado

  if (state.value === null) state.value = true;
  else if (state.value === true) state.value = false;
  else state.value = null;

  emit("update:modelValue", state.value);
};

const labelText = computed(() => {
  if (state.value === true) return props.texts.add;
  if (state.value === false) return props.texts.remove;
  return props.texts.none;
});

const labelClass = computed(() => ({
  "text-green-400": state.value === true,
  "text-red-400": state.value === false,
  "text-gray-400": state.value === null
}));
</script>

<template>
  <div>
    <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-4">
      {{ label }}
    </label>

    <div class="flex flex-col items-start gap-3">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none"
          :class="{
            'bg-green-500': state === true,
            'bg-red-500': state === false,
            'bg-gray-600': state === null,
            'opacity-50 cursor-not-allowed': disabled
          }"
          @click="toggleSwitch"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300"
            :class="{
              'translate-x-7': state === true,
              'translate-x-1': state === false,
              'translate-x-3': state === null
            }"
          />
        </button>

        <span class="text-sm font-medium" :class="labelClass">
          {{ labelText }}
        </span>
      </div>
    </div>
  </div>
</template>
