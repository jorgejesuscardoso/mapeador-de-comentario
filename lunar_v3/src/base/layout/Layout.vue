<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Lucide from '../lucide/Lucide.vue'
import NotificationsContainer from '../notification/NotificationsContainer.vue';
import { getSales } from '@/API/ShopLunar';
import { toast } from '../utils/toast';
import { getUserById, getUserWtpd } from '@/API/UserApi';

interface userData {
	user: string
	role: string
	token: string,
	licenses: string[]
}

const storage = JSON.parse(localStorage.getItem('user') || null) as userData | null;

const showPremiumButton = !(storage?.licenses?.includes('premium'));


const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
const notification = ref(0)
const showNotification = ref(false)
const showNotification2 = ref(false)
const userLocalData = ref(null)

const isLogged = ref(false)
const isAdmin = ref(false)
const isBeta = ref(false)
const isPremium = ref(false)
const isCiner = ref(false)
const isDev = ref(false)

const menuRef = ref<HTMLElement | null>(null);
const menuRef2 = ref<HTMLElement | null>(null);
const refNotification = ref<HTMLElement | null>(null);
const refNotification2 = ref<HTMLElement | null>(null);
const refNotification3 = ref<HTMLElement | null>(null);
const refNotification4 = ref<HTMLElement | null>(null);

const getWtpData = ref()
	
watch(getWtpData,(val) => {
	if(val) {
		userLocalData.value = val
	}
}, {immediate: true })

const handleClickOutside = (event: MouseEvent) => {
	try{
		const target = event.target as Node;

		// Fecha menu se clicar fora
		if (
			menuOpen.value &&
			menuRef.value &&
			menuRef2.value &&
			!menuRef.value.contains(target) &&
			!menuRef2.value.contains(target)
		) {
			menuOpen.value = false;
			}

		// Fecha notificações se clicar fora
		if (
		showNotification.value &&
		refNotification.value &&
		refNotification2.value &&
		!refNotification.value.contains(target) &&
		!refNotification2.value.contains(target)
		) {
		showNotification.value = false;
		}

		// Fecha notificações se clicar fora
		if (
			showNotification2.value &&
			refNotification3.value &&
			refNotification4.value &&
			!refNotification3.value.contains(target) &&
			!refNotification4.value.contains(target)
		) {
			showNotification2.value = false;
		}
	} catch(err) {
		console.error(err)
	}
};

const handlewrite = () => {
  if (!isBeta.value) {
    toast.info('🚧 Esta função está em Beta! Somente testadores têm acesso no momento.')
		return
  }
	router.push('/mywork/write')
}

const handleGetPrmium = () => {
	toast.info('Em breve!')
}

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

const handleLogout = () => {
	if(isLogged){
		localStorage.removeItem('user')
		localStorage.removeItem('zapModal')
		window.location.reload()
	} else {
		return
	}
}

const isOriginalOrMyWork = computed(() => {
  return route.path === '/originals-lunar' || route.path.startsWith('/mywork')
})

onMounted(async () => {
	
	if (storage) {
		isLogged.value = true

		if(storage.role === 'admin' || storage.role === 'superadmin'){
			isAdmin.value = true
		}
		if(storage.licenses && storage.licenses.some((s) => s === 'beta_tester')) {
			isBeta.value = true
		}
	}

	if(!storage) return;
	const response = await getUserWtpd(storage.user)
	getWtpData.value = response

  document.addEventListener('click', handleClickOutside);
	window.scrollTo({top: 0})

	if(isAdmin){
		const response = await getSales()
		if(response.status === 200) {
			notification.value = 1		
		}
	}
	 // Carrega GA4
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-36V74JCT4B'
  document.head.appendChild(script)

  script.onload = () => {
    // Inicializa gtag
    (window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) { (window as any).dataLayer.push(args) }
    (window as any).gtag = gtag
    gtag('js', new Date())
    gtag('config', 'G-36V74JCT4B')
  }

  // Dispara page_view ao mudar de rota
  watch(
    () => router.currentRoute.value.fullPath,
    (path) => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', { page_path: path })
      }
    },
    { immediate: true }
  )
	
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

provide('isAdmin', isAdmin)
provide('isBeta', isBeta)
provide('isPremium',isPremium)
provide('isDev', isDev)
provide('isCiner', isCiner)
</script>

<template>
	<div
		class="min-h-screen min-w-screen bg-fuchsia-200"
	>
		<header 
			class="hidden lg:block w-full text-gray-50 overflow-hidden fixed z-50 "
			:class="{
				'searchFilterBg2': !isOriginalOrMyWork,
				'bg-white border border-b-purple-200': isOriginalOrMyWork
			}"
		>
			<div 
				class="flex items-center justify-between whitespace-nowrap text-center p-1 h-14 "
				:class="{
					'': isOriginalOrMyWork,
					'bg-[rgba(0,0,0,0.7)]': !isOriginalOrMyWork,				}"
			>
				<h1 
					class="flex items-center justify-start gap-1 font-serif px-4 text-start w-[20vw] font-bold text-xl italic cursor-pointer"
					:class="{
						'text-purple-700': isOriginalOrMyWork,
						'text-white': !isOriginalOrMyWork
					}"
					@click="router.push('/')"
				>
					Projeto Lunar
					<Lucide
						icon="MoonStar"
						class="h-8 w-8"
						:stroke-width="1"
					/>
				</h1>
				<!-- Ações -->
				<div class="flex items-center pr-4 h-full gap-4">

					<!-- Escrever -->
					<div
						class="flex items-center justify-center h-full cursor-pointer"
						@click="handlewrite"
					>
						<button
							class="flex items-center justify-center gap-1 border px-2 py-1.5 rounded-md text-[10px] font-bold font-serif"
							:class="{
								'text-purple-700 border-purple-500': isOriginalOrMyWork,
								'text-white': !isOriginalOrMyWork,							}"
						>
							Escrever
							<Lucide icon="PencilLine" class="h-4 w-4" />
						</button>
					</div>

					<!-- CTA Premium -->
					<div
						v-if="showPremiumButton"
					>
						<button
							@click="handleGetPrmium" 
							class="bg-gradient-to-r from-fuchsia-500 to-purple-700 hover:from-fuchsia-600 hover:to-purple-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
						>
							<Lucide icon="Star" class="w-4 h-4 text-white" />
							Premium
						</button>
					</div>

					<!-- Usuário -->
					<div v-if="userLocalData && isLogged">
						<img 
							:src="userLocalData.avatar"
							alt="Foto de perfil"
							class="h-10 w-10 rounded-full"
						>
					</div>
					<Lucide
						v-else
						icon="UserCircle"
						class="h-10 w-10"
						:class="{
							'text-purple-500': isOriginalOrMyWork
						}"
						:stroke-width="0.7"
					/>
				</div>
			</div>
		</header>

		
		<div 
			ref="refNotification3"
			v-if="showNotification2" 
			class="hidden lg:flex z-50"
		>
			<NotificationsContainer 
				
			/>
		</div>

		<div
			class="flex items-center justify-end searchFilterBg2 "
		>
			<div
				class="flex bg-[rgba(0,0,0,0.6)] w-full items-center justify-end"
			>

				<div
					class=" h-full mt-1 fixed top-14 left-0 z-50"
					:class="{
						'hidden': route.path === '/mywork/write',
						'hidden lg:flex': route.path !== '/mywork/write'
					}"
				>
					<nav
						class="rounded-2xl p-4 min-w-44 h-[50vh]"
						:class="{
							'bg-[rgba(0,0,0,0.8)]': !isOriginalOrMyWork,						}"
					>
						<ul
							class="flex flex-col w-full gap-1 text-violet-400 font-semibold text-[11px]"
						>
							<li>
								<RouterLink 
									to="/"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
										'hover:bg-gray-100 hover:text-violet-800': route.path !== '/' && !isOriginalOrMyWork,									}"
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
									to="/originals-lunar"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
									:class="{ 
											'bg-gray-900/10 text-gray-800': isOriginalOrMyWork,
											'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
											'hover:bg-gray-100 hover:text-violet-800': route.path !== '/books-lunar',
										}"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="BookOpen" size="16" />
									Originais Lunar
								</RouterLink>
							</li>

								<!-- <li>
									<RouterLink 
										to="/houses"
										class="flex items-center gap-2 px-2 py-1 rounded-md"
										:class="{ 
											'bg-violet-100/10': route.path === '/houses',
											'hover:bg-gray-100 hover:text-violet-800': route.path !== '/houses'
										}"
										
									>
										<Lucide icon="Moon" size="14" />
										Casas lunar
									</RouterLink>
								</li> -->
							<li>
								<RouterLink 
									to="/members"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/members',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
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
							<!-- <li>
								<RouterLink 
									to=""
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition text-inactive"
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
							</li> -->
							<li>
								<RouterLink 
									to="/shop"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/shop',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
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
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/profile',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
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
										class="flex items-center gap-2 px-2 py-1 rounded-md"
									>
										<Lucide icon="FileInput" size="14" />
										Registro
									</RouterLink>
								</li>

								<li>
									<RouterLink 
										to="#"
										class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive line-through"
									>
										<Lucide icon="Bell" size="14" />
										Notificações
									</RouterLink>
								</li>

								<li>
									<RouterLink 
										to="/profile/orders"
										class="flex items-center gap-2 px-2 py-1 rounded-md":class="{
										'bg-violet-100/10': route.path === '/profile/orders',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-600':  route.path === '/originals-lunar',
										'hover:bg-gray-100 hover:text-violet-800': route.path !== '/profile/orders'
									}"
									>
										<Lucide icon="Package" size="14" />
										Meus pedidos
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
											'hover:bg-red-100 text-red-600': isLogged
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
				<div 
					v-if="showNotification" 
					ref="refNotification" 
				>
					<NotificationsContainer 
						
					/>
				</div>
				<div class="flex items-center justify-between p-4 bg-[rgb(0,0,0,0.3)]">
					<h1 
						class="flex items-center justify-start gap-1 text-base font-semibold whitespace-nowrap"
						@click="router.push('/')"
					>
						Projeto Lunar
						<Lucide
							icon="MoonStar"
						/>
					</h1>

					<div
						class="flex items-center justify-between w-4/12"
					>
						<!-- Escrever -->
						<button
							class="flex items-center justify-center boroder rounded-md text-white font-bold font-serif"
							@click="handlewrite"
						>
							<Lucide 
								icon="PencilLine"
								size="24"
							/>
						</button>
						<!-- Notificações -->
						<button 
							ref="refNotification2"
							@click="showNotification = !showNotification, menuOpen = false" 
							aria-label="Abrir Notificações"
							class="relative"
						>
							<Lucide icon="Bell" size="24" />
							<span
								v-if="notification > 0"
								class="flex items-center justify-center bg-white text-red-700 text-xs font-semibold rounded-full h-4 w-4 absolute -top-1 -right-1"
							>
								{{ notification }}
							</span>
						</button>
						<!-- Menu flutuante -->
						<button 
							ref="menuRef2"
							@click.stop="menuOpen = !menuOpen, showNotification = false" 
							aria-label="Abrir menu"
						>
							<Lucide :icon="menuOpen ? 'X' : 'Menu'" size="24" />
						</button>
					</div>
				</div>

				<transition name="fade">
					<nav
  					ref="menuRef"
						v-show="menuOpen"
						class="bg-white text-violet-300 searchFilterBg2"
					>
						<ul class="grid grid-cols-2 font-semibold text-sm p-4 bg-[rgb(0,0,0,0.3)]">
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
							<li>
								<RouterLink 
									to="/originals-lunar"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs text-"
									:class="{ 
											'bg-violet-100/10': isOriginalOrMyWork,
										}"
									>
									<Lucide icon="BookOpen" size="16" />
									Originais Lunar
								</RouterLink>
							</li>
							<!-- <li 
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
							</li> -->
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
							<!-- <li>
								<RouterLink 
									to=""
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive text-xs"
									:class="{ 'bg-violet-100/10': route.path === '/subs' }"
									@click.stop="menuOpen = false" 
								>
									<Lucide icon="List" size="14" />
									Subs
								</RouterLink>
							</li> -->
							<li>
								<RouterLink 
									to="/shop"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
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

							
							<li
								v-if="!isLogged"
							>
								<RouterLink 
									to="/register"
									class="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
								>
									<Lucide icon="FileInput" size="14" />
									Registro
								</RouterLink>
							</li>

							

							<li>
								<RouterLink 
									to="#"									
									class="flex items-center gap-2 px-2 py-1 rounded-md text-inactive"
								>
									<Lucide icon="Bell" size="14" />
									Notificações
								</RouterLink>
							</li>

							<li>
								<RouterLink 
									to="/profile/orders"
									:class="{ 'bg-violet-100/10': route.path === '/profile/orders' }"									
									class="flex items-center gap-2 px-2 py-1 rounded-md"
								>
									<Lucide icon="Package" size="14" />
									Meus pedidos
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
				class="flex bg-red-90i0 items-start justify-center z-0"
				:class="{
					'w-full': route.path === '/mywork/write',
					'lg:w-[87vw] w-full min-h-screen pt-14 lg:mt-4': route.path !== '/mywork/write'
				}"
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