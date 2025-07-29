<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Lucide from '../lucide/Lucide.vue'

interface userData {
	role: string
	token: string,	
}

const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);

const isLogged = ref(false)
const isAdmin = ref(false)

const menuRef = ref<HTMLElement | null>(null);
const menuRef2 = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if ((menuOpen.value && menuRef.value && menuRef2.value) && (!menuRef2.value.contains(event.target as Node) && !menuRef.value.contains(event.target as Node))) {
    menuOpen.value = false;
  }
};

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

const handleLogout = () => {
	if(isLogged){
		localStorage.removeItem('user')
		window.location.reload()
	} else {
		return
	}
}

onMounted(() => {
	const storage = JSON.parse(localStorage.getItem('user')) as userData;
	
	if (storage) {
		isLogged.value = true

		if(storage.role === 'admin' || storage.role === 'superadmin'){
			isAdmin.value = true
		}
	}
  document.addEventListener('click', handleClickOutside);
	window.scrollTo({top: 0})
	console.log('é adm',isAdmin.value, 'está logado',isLogged.value)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

provide('isAdmin', isAdmin)
</script>

<template>
	<div
		class="min-h-screen min-w-screen bg-fuchsia-200"
	>
		<header class="hidden lg:block w-full text-gray-50 overflow-hidden p-1 fixed z-10 searchFilterBg">
			<div class="whitespace-nowrap text-center">
				<h1 class="inline-block px-4 text-lg">
					🌙✨ Seja muito bem-vindo ao Projeto Lunar ✨🌙
				</h1>
			</div>
		</header>


		<div
			class="flex items-center justify-end searchFilterBg2"
		>
			<div
				class="hidden lg:flex w-3/12 h-full mt-1 fixed top-10 left-0"
			>
				<nav
					class="rounded-2xl p-4 min-w-52 h-[90vh] bg-[rgba(0,0,0,0.8)]"
				>
					<ul
						class="flex flex-col w-full gap-1 text-violet-400 text-sm font-semibold"
					>
						<li>
							<RouterLink 
								to="/"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-xs"
								:class="{
									'bg-violet-100/10': route.path === '/',
									'hover:bg-gray-100 hover:text-violet-800': route.path !== '/'
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
									to="/houses"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 
										'bg-violet-100/10': route.path === '/houses',
										'hover:bg-gray-100 hover:text-violet-800': route.path !== '/houses'
									}"
									
								>
									<Lucide icon="Moon" size="14" />
									Casas lunar
								</RouterLink>
							</li>
						<li>
							<RouterLink 
								to="/members"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-xs"
								:class="{
									'bg-violet-100/10': route.path === '/members',
									'hover:bg-gray-100 hover:text-violet-800': route.path !== '/members'
								}"
							>
								<Lucide
										icon="Users"
										size="14"
								/>
								Membros
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive  text-xs"
								:class="{
									'bg-violet-100/10': route.path === '/subs',
									'hover:bg-gray-100 hover:text-violet-800': route.path !== '/subs'
								}"
							>
								<Lucide
										icon="List"
										size="14"
								/>
								Subs
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to=""
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive  text-xs"
								:class="{
									'bg-violet-100/10': route.path === '/shop',
									'hover:bg-gray-100 hover:text-violet-800': route.path !== '/shop'
								}"
							>
								<Lucide
										icon="Store"
										size="14"
								/>
								Lojinha Lunar
							</RouterLink>
						</li>
						<li>
							<RouterLink 
								to="/profile"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-xs"
								:class="{
									'bg-violet-100/10': route.path === '/profile',
									'hover:bg-gray-100 hover:text-violet-800': route.path !== '/profile'
								}"
							>
								<Lucide
										icon="CircleUserRound"
										size="14"
								/>
								Perfil
							</RouterLink>
						</li>

						
							<li>
								<RouterLink 
									v-if="!isLogged"
									to="/register"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
								>
									<Lucide icon="FileInput" size="14" />
									Registro
								</RouterLink>
							</li>

						
						<li
							@click="handleLogout "
						>
							<RouterLink 
								:to="!isLogged ? '/login': ''"
								class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-xs"
								:class="{
									'hover:bg-green-100 text-green-800': !isLogged,
									'hover:bg-red-100 text-red-800': isLogged
								}"								
							>
								<Lucide
										:icon="isLogged ? 'LogOut': 'LogIn'"
										size="14"
								/>
								{{ isLogged ? 'Sair' : 'Login' }}
							</RouterLink>
						</li>
					</ul>
				</nav>
			</div>

			<!-- Mobile Nav -->
			<div class="lg:hidden w-full searchFilterBg text-white fixed top-0 left-0 z-20"
				:class="{'border-b-2 border-fuchsia-300': menuOpen, 'border-0':!menuOpen}"
			>
				<div class="flex items-center justify-between p-4 bg-[rgb(0,0,0,0.3)]">
					<h1 
						class="text-base font-semibold whitespace-nowrap"
						@click="router.push('/')"
					>
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
						class="bg-white text-violet-300 searchFilterBg2"
					>
						<ul class="flex flex-col gap-2 font-semibold text-sm p-4 bg-[rgb(0,0,0,0.3)]">
							<li>
								<RouterLink 
									to="/"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/' }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="Home" size="16" />
									Home
								</RouterLink>
							</li>
							<li 
								@click.stop="menuOpen = false" 
							>
								<RouterLink 
									to="/houses"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/houses' }"
									
								>
									<Lucide icon="Moon" size="14" />
									Casas lunar
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to="/members"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/members' }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="Users" size="14" />
									Membros
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/subs' }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="List" size="14" />
									Subs
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/shop' }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="Store" size="14" />
									Lojinha Lunar
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									to="/profile"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/profile' ||  route.path === `/profile/*` }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="CircleUserRound" size="14" />
									Perfil
								</RouterLink>
							</li>

							
							<li>
								<RouterLink 
									v-if="!isLogged"
									to="/register"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
								>
									<Lucide icon="FileInput" size="14" />
									Registro
								</RouterLink>
							</li>
							
							<li
								@click="handleLogout"
							>
								<RouterLink 
									:to="!isLogged ? '/login': ''"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-xs"
									:class="{
										'hover:bg-green-100 text-green-400': !isLogged,
										'hover:bg-red-100 text-red-400': isLogged
									}"
								>
									<Lucide
											:icon="isLogged ? 'LogOut': 'LogIn'"
											size="14"
									/>
									{{ isLogged ? 'Sair' : 'Login' }}
								</RouterLink>
							</li>
						</ul>
					</nav>
				</transition>
			</div>

			<main
				class="flex w-full min-h-screen items-center justify-center lg:w-10/12 z-0 mt-12 lg:mt-0"
			>
				<router-view />
			</main>

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