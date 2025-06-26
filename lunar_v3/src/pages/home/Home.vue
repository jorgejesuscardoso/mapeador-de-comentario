<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/Sort.vue';

const totalBooks = ref(0);
const search = ref('')


const handleSearch = (s: string) => {
	search.value = s;
};
</script>

<template>	
	<div>
		<Header>
			Obras dos Membros Lunar: <span>({{ totalBooks }} obra{{ totalBooks === 1 ? '' : 's' }})</span>
		</Header>

		<div
			class="w-full flex items-center justify-end py-4"
		>
			<Sort 
				@search:books="handleSearch"
			/>
		</div>

		<div class="h-[85vh] overflow-y-auto border-t-2 border-purple-400 rounded-2xl">
			<AllbooksCard 
				:search="search"
				@update-length="totalBooks = $event"
			/>
		</div>
	</div>
</template>
