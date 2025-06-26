<script setup lang="ts">
import AllbooksCard from '@/base/cards/AllbooksCard.vue';
import { ref, watch } from 'vue';
import Header from '@/base/header/Header.vue';
import Sort from '@/base/filters/Sort.vue';

const totalBooks = ref(0);

</script>

<template>	
	<div
		class="mt-6 p-4"
	>
		<Header>
			Obras dos Membros Lunar: <span>({{ totalBooks }} obra{{ totalBooks === 1 ? '' : 's' }} encontradas)</span>
		</Header>


		<div
			class=""
		>
			<AllbooksCard
				@update-length="totalBooks = $event"
			/>
		</div>
	</div>
</template>
