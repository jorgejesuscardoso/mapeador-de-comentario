<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch, onMounted } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/FilterBar.vue';
import Lucide from '@/base/lucide/Lucide.vue';

const totalBooks = ref(0);

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
			class="lg:mt-10 pb-6 w-full"
		>
			<AllbooksCard
				@update-length="totalBooks = $event"
			/>
		</div>
		<div
			class="fixed bottom-16 right-2 "
		>
			<button
				class="bg-fuchsia-400 rounded-full p-1"
			
			>
				<Lucide
					icon="ChevronUp"
					class="w-7 h-7 text-white"
					@click="scrollToTop"
				/>
			</button>
		</div>
	</div>
</template>
