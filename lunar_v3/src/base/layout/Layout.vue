<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Lucide from '../lucide/Lucide.vue'

const route = useRoute();

const menuOpen = ref(false);

const isLogged = ref(true)
const isAdmin = ref(false)

const menuRef = ref<HTMLElement | null>(null);
const menuRef2 = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if ((menuOpen.value && menuRef.value && menuRef2.value) && (!menuRef2.value.contains(event.target as Node) && !menuRef.value.contains(event.target as Node))) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
	<div
		class="min-h-screen min-w-screen bg-fuchsia-200"
	>
		<header class="hidden lg:block w-full bg-slate-900 text-gray-50 overflow-hidden p-1 fixed z-10">
			<div class="whitespace-nowrap text-center">
				<h1 class="inline-block px-4 text-lg">
					🌙✨ Seja muito bem-vindo ao Projeto Lunar ✨🌙
				</h1>
				<span>
					-
				</span>
				<h1 class="inline-block px-4 text-lg">
					📚 Onde a lua ilumina os livros 🌌📖
				</h1>
			</div>
		</header>


		<div
			class="flex items-center justify-end"
		>
			<div
				class="hidden lg:flex w-2/12 h-full mt-1 fixed top-10 left-0"
			>
				<nav
					class="rounded-2xl bg-white p-4 h-[90vh]"
				>
					<ul
						class="flex flex-col w-full gap-1 text-violet-700 text-sm font-semibold"
					>
						<li>
							<RouterLink 
								to="/"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
								:class="{
									'bg-violet-200 text-violet-800': route.path === '/',
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
						<li
							v-if="isAdmin"
						>
							<RouterLink 
								to="/bot"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
								:class="{
									'bg-violet-200 text-violet-800': route.path === '/bot',
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
									'bg-violet-200 text-violet-800': route.path === '/members',
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
									'bg-violet-200 text-violet-800': route.path === '/subs',
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
									'bg-violet-200 text-violet-800': route.path === '/shop',
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
									'bg-violet-200 text-violet-800': route.path === '/profile',
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

			<!-- Mobile Nav -->
			<div class="lg:hidden w-full bg-slate-900 text-white fixed top-0 left-0 z-20 border-b-2 border-fuchsia-300">
				<div class="flex items-center justify-between p-4">
					<h1 class="text-base font-semibold whitespace-nowrap">
						Projeto Lunar
					</h1>
					<button 
						ref="menuRef2"
						@click.stop="menuOpen = !menuOpen" 
						aria-label="Abrir menu"
					>
						<Lucide :icon="menuOpen ? 'X' : 'Menu'" size="24" />
					</button>
				</div>

				<transition name="fade">
					<nav
  					ref="menuRef"
						v-show="menuOpen"
						class="bg-white text-violet-800 p-4"
					>
						<ul class="flex flex-col gap-2 font-semibold text-sm">
							<li>
								<RouterLink 
									to="/"
									class="flex items-center gap-2 px-2 py-1 rounded-md"
									:class="{ 'bg-violet-200': route.path === '/' }"
								>
									<Lucide icon="Home" size="16" />
									Home
								</RouterLink>
							</li>
							<li v-if="isAdmin">
								<RouterLink 
									to="/bot"
									class="flex items-center gap-2 px-2 py-1 rounded-md"
									:class="{ 'bg-violet-200': route.path === '/bot' }"
								>
									<Lucide icon="Bot" size="20" />
									Robozinho
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive"
									:class="{ 'bg-violet-200': route.path === '/members' }"
								>
									<Lucide icon="Users" size="20" />
									Membros
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive"
									:class="{ 'bg-violet-200': route.path === '/subs' }"
								>
									<Lucide icon="List" size="20" />
									Subs
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive"
									:class="{ 'bg-violet-200': route.path === '/shop' }"
								>
									<Lucide icon="Store" size="20" />
									Lojinha Lunar
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive"
									:class="{ 'bg-violet-200': route.path === '/profile' }"
								>
									<Lucide icon="CircleUserRound" size="20" />
									Perfil
								</RouterLink>
							</li>
						</ul>
					</nav>
				</transition>
			</div>

			<main
				class="flex w-full items-center justify-center lg:w-10/12 z-0 px-4 lg:p-0 mt-12 lg:mt-0"
			>
				<router-view />
			</main>

		</div>
	</div>
</template>



<style>
/* WebKit browsers (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: 0px;       /* largura da barra vertical */
  height: 0px;      /* altura da barra horizontal */
}

::-webkit-scrollbar-track {
  background: transparent;  /* fundo da track */
  border-radius: 0px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4); /* cor do polegar */
  border-radius: 3px;
  border: 1.5px solid transparent; /* espaço interno para suavizar */
  background-clip: content-box;
  transition: background-color 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 100, 100, 0.7);
}

/* Firefox */
* {
  scrollbar-width: thin;           /* deixa a barra fina */
  scrollbar-color: rgba(100,100,100,0.4) transparent; /* polegar + track */
}

</style>