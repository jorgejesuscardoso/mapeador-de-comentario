<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref } from 'vue';

const totalBooks = ref(0);
</script>

<template>	
	<div>
		<header class="text-gray-700 font-bold my-3">
			Obras dos membros Lunar: ({{ totalBooks }})
		</header>
		<div class="h-[85vh] overflow-y-auto">
			<AllbooksCard @update-length="totalBooks = $event" />
		</div>
	</div>
</template>
