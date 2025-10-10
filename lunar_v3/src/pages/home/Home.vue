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
		class="min-w-full relative flex items-center justify-center bg-[rgba(0,0,0,0.75)]"
	>
		<div>
			<AllbooksCard
				@update-length="totalBooks = $event"
			/>
		</div>
		
	</div>
</template>
