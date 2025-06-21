<script setup lang="ts">
import { ref, provide } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Lucide from '../lucide/Lucide.vue'

const route = useRoute();

const isLogged = ref(true)
const isAdmin = ref(true)

const handleToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
</script>

<template>
	<div
		class="min-h-screen min-w-screen bg-fuchsia-300"
	>
		<header class="w-full bg-slate-900 text-gray-50 overflow-hidden p-1">
			<div class="whitespace-nowrap text-center">
				<h1 class="inline-block px-4 text-lg">
					Seja muito bem vindo ao Projeto Lunar
				</h1>
				<span>
					-
				</span>
				<h1 class="inline-block px-4 text-lg">
					Onde a lua ilumina os livros
				</h1>
			</div>
		</header>


		<div
			class="grid grid-cols-[9fr_34fr]"
		>
			<div
				class="w-11/12 h-full mt-1"
			>
				<nav
					class="rounded-2xl bg-white p-4 h-[90vh]"
				>
					<ul
						class="flex flex-col w-full gap-1 text-gray-700 text-sm font-semibold"
					>
						<li>
							<RouterLink 
								to="/"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
								:class="{
									'bg-gray-300 text-black': route.path === '/',
									'hover:bg-gray-100': route.path !== '/'
								}"
							>
								<Lucide
										icon="Home"
										size="16"
								/>
								Home
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to="/bot"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
								:class="{
									'bg-gray-300 text-black': route.path === '/bot',
									'hover:bg-gray-100': route.path !== '/bot'
								}"
							>
								<Lucide
										icon="Bot"
										size="20"

								/>
								Robozinho
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive"
								:class="{
									'bg-gray-300 text-black': route.path === '/members',
									'hover:bg-gray-100': route.path !== '/members'
								}"
							>
								<Lucide
										icon="Users"
										size="20"
								/>
								Membros
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive"
								:class="{
									'bg-gray-300 text-black': route.path === '/subs',
									'hover:bg-gray-100': route.path !== '/subs'
								}"
							>
								<Lucide
										icon="List"
										size="20"
								/>
								Subs
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive"
								:class="{
									'bg-gray-300 text-black': route.path === '/shop',
									'hover:bg-gray-100': route.path !== '/shop'
								}"
							>
								<Lucide
										icon="Store"
										size="20"
								/>
								Lojinha Lunar
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive"
								:class="{
									'bg-gray-300 text-black': route.path === '/profile',
									'hover:bg-gray-100': route.path !== '/profile'
								}"
							>
								<Lucide
										icon="CircleUserRound"
										size="20"
								/>
								Perfil
							</RouterLink>
						</li>
					</ul>
				</nav>
			</div>

			<main
				class="min-h-full"
			>
				<router-view />
			</main>

		</div>
	</div>
</template>
