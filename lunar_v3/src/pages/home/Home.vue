<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
</script>

<template>	
	<div>
		<header
			class="text-gray-700 font-bold my-3"
		>
			Obras dos membros Lunar:
		</header>
		<div
			class="h-[85vh] overflow-y-auto"
		>
			<AllbooksCard />
		</div>
	</div>
</template>