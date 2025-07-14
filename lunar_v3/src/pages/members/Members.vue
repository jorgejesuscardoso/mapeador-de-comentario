
<script setup lang="ts">
import { getUser } from '@/API/UserApi'
import { ref, onMounted, watch } from 'vue'

const data = ref([])

onMounted(async () => {
  const member = await getUser()
  data.value = member
  console.log(data)
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
    <div
      v-for="member in data"
      :key="member.user"
      class="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center space-y-3 border border-purple-100"
    >
      <img
        v-if="member.house?.thumb"
        :src="`/houses_flags/${member.house?.thumb}`"
        alt="Casa"
        class="w-20 h-32 object-fit rounded-b-full rounded-t-md"
      />
      <div
        v-else
        class="w-20 h-32 flex items-center justify-center text-center bg-gray-100 text-purple-600 text-xs rounded-b-full rounded-t-md shadow px-2"
      >
        Ainda não faz parte<br>de uma casa Lunar.
      </div>
      <h2 class="text-lg font-bold text-purple-800">{{ member.name }}</h2>
      <p class="text-sm text-gray-500">@{{ member.user }}</p>
      <p class="text-xs text-gray-600">🎭 {{ member.subrole || 'Sem subfunção' }}</p>
      <div class="text-sm">
        <p class="font-medium text-purple-700">🏰 Casa: <span class="font-semibold">{{ member.house?.name }}</span></p>
        <p class="text-gray-700">🎂 Idade: {{ member.age }}</p>
        <p class="text-gray-700">💠 Tier Points: {{ member.tierPoints }}</p>
        <p class="text-gray-700">🛡️ Cargo: {{ member.role }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
</style>
