<script setup lang="ts">
import RegisterBook from './component/RegisterBook.vue';
import {ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const store = localStorage.getItem('user')
  const parsed = store ? JSON.parse(store) : null

  if(!parsed) return router.push('/login')
})
</script>

<template>
  <div
    class="flex w-full"
  >

    <main
      class="flex flex-col min-w-full items-center  min-h-screen gap-10"
    >
      <h1
        class="mt-14 text-xl font-semibold text-purple-800"
      >
        Ainda em construção
      </h1>
      <RegisterBook />
    </main>
  </div>
</template>