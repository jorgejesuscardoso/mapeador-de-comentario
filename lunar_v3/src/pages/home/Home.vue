<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/FilterBar.vue';
import Lucide from '@/base/lucide/Lucide.vue';

const totalBooks = ref(0);

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

</script>

<template>	
	<div
		class="lg:mt-1.5 lg:p-4 relative"
	>
		<Header>
		</Header>


		<div
			class="pb-6"
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
