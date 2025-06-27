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
		class="h-[92vh] flex items-center justify-center"
	>
		<h1>Em construção</h1>
	</div>
</template>