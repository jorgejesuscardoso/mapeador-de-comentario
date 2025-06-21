<script setup lang="ts">
import CommentsCard from '@/base/cards/CommentsCard.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.query.id as string;
const wUser = route.query.user as string;
const title = route.query.title as string;

  console.log(title)
</script>

<template>
	<div
		class="h-[92vh] overflow-y-auto"
	>
		<CommentsCard 
      :propId="id"
      :propUser="wUser"
      :propTitle="title"
    />
	</div>
</template>

<style>
/* WebKit browsers (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: 6px;       /* largura da barra vertical */
  height: 6px;      /* altura da barra horizontal */
}

::-webkit-scrollbar-track {
  background: transparent;  /* fundo da track */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4); /* cor do polegar */
  border-radius: 3px;
  border: 1.5px solid transparent; /* espaço interno para suavizar */
  background-clip: content-box;
  transition: background-color 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 100, 100, 0.7);
}

/* Firefox */
* {
  scrollbar-width: thin;           /* deixa a barra fina */
  scrollbar-color: rgba(100,100,100,0.4) transparent; /* polegar + track */
}

/* Opcional: estilizar track no Firefox via pseudo-elementos (menos suportado) */

</style>