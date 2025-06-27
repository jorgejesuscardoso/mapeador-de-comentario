<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/Sort.vue';
import Lucide from '@/base/lucide/Lucide.vue';

const totalBooks = ref(0);

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

</script>

<template>	
	<div
		class="mt-6 p-4 relative"
	>
		<Header>
		</Header>


		<div
			class=""
		>
			<AllbooksCard
				@update-length="totalBooks = $event"
			/>
		</div>
		<div
			class="fixed bottom-4 right-2 "
		>
			<button
				class="bg-purple-300 rounded-full p-1"
			
			>
				<Lucide
					icon="ChevronUp"
					class="w-8 h-8 text-gray-700"
					@click="scrollToTop"
				/>
			</button>
		</div>
	</div>
</template>
