<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch, onMounted } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/FilterBar.vue';
import Lucide from '@/base/lucide/Lucide.vue';

const totalBooks = ref(0);

onMounted(() => {
	window.scrollTo({top: 0})
})

</script>

<template>	
	<div
		class="mt-5 lg:mt-1.5 relative w-screen flex items-center justify-center"
	>
		<Header>
		</Header>


		<div
			class="lg:mt-10 pb-6 w-full px-1 lg:px-0"
		>
			<AllbooksCard
				@update-length="totalBooks = $event"
			/>
		</div>
		
	</div>
</template>
