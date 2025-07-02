<script setup lang="ts">
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 24
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  class: {
  type: [String, Object, Array],
  default: ''
  }
});

const iconComponent = computed(() => {
  const icon = icons[props.icon];
  if (!icon) {
    console.warn(`Ícone '${props.icon}' não encontrado.`);
  }
  return icon;
});
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    stroke="currentColor"
    class="align-middle"
    :class="props.class"
  />
</template>
