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

const storage = ref(JSON.parse(localStorage.getItem('user') || null) as userData | null);

const showPremiumButton = !(storage?.value?.licenses?.includes('premium'));


const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
const notification = ref(0)
const showNotification = ref(false)
const showNotification2 = ref(false)
const showWriteMenuNav = ref(false)
const userLocalData = ref(null)

const isLogged = ref(false)
const isAdmin = ref(false)
const isBeta = ref(false)
const isPremium = ref(false)
const isCiner = ref(false)
const isDev = ref(false)

const showWriteMenu = ref(false)

const menuRef = ref<HTMLElement | null>(null);
const menuRef2 = ref<HTMLElement | null>(null);
const refNotification = ref<HTMLElement | null>(null);
const refNotification2 = ref<HTMLElement | null>(null);
const refShowWriteMenu = ref<HTMLElement | null>(null);
const refShowWriteMenu2 = ref<HTMLElement | null>(null);
const refShowWriteMenuNav = ref<HTMLElement | null>(null);
const refShowWriteMenuNav2 = ref<HTMLElement | null>(null);

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
			showWriteMenu.value &&
			refShowWriteMenu.value &&
			refShowWriteMenu2.value &&
			!refShowWriteMenu.value.contains(target) &&
			!refShowWriteMenu2.value.contains(target)
		) {
			showWriteMenu.value = false;
		}

		// Fecha menu de escrita se clicar fora
		if (
			showWriteMenuNav.value &&
			refShowWriteMenuNav.value &&
			refShowWriteMenuNav2.value &&
			!refShowWriteMenuNav.value.contains(target) &&
			!refShowWriteMenuNav2.value.contains(target)
		) {
			showWriteMenuNav.value = false;
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
	router.push('/v1/mywork/list')
}

const handlePermission = () => {
	if(!isBeta.value) return toast.error("Acesso antecipado apenas para testadores beta!")
	router.push('/v1/origins/work/create')
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

const isRouteOrigins = computed(() => {
  return route.path.startsWith('/v1/origins')
})

onMounted(async () => {
	
	if (storage?.value) {
		isLogged.value = true

		if(storage?.value?.role === 'admin' || storage?.value?.role === 'superadmin'){
			isAdmin.value = true
		}
		if(storage?.value?.licenses && storage?.value?.licenses.some((s) => s === 'beta_tester')) {
			isBeta.value = true
		}
	}

	if(!storage?.value) return;
	const response = await getUserWtpd(storage?.value?.user)
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
		<div
			:class="{
				'hidden': route.path === '/v1/origins/mywork/write' || route.path === '/v1/origins/work/create'
			}"
		>
			<header 
				class="hidden lg:block w-full text-gray-50 overflow-hidden fixed z-40 "
				:class="{
					'searchFilterBg2': !isRouteOrigins,
					'bg-white border border-b-purple-200': isRouteOrigins
				}"
			>
				<div 
					class="flex items-center justify-between whitespace-nowrap text-center p-1 h-14 "
					:class="{
						'': isRouteOrigins,
						'bg-[rgba(0,0,0,0.7)]': !isRouteOrigins,				}"
				>
					<h1 
						class="flex items-center gap-2 font-serif font-bold text-xl italic cursor-pointer select-none relative"
						:class="{
							'text-purple-700': isRouteOrigins,
							'text-white': !isRouteOrigins
						}"
						@click="router.push(isRouteOrigins ? '/v1/origins' : '/')"
					>
						<!-- Ícone principal -->
						<Lucide
							:icon="isRouteOrigins ? 'Stars' : 'MoonStar'"
							class="transition-all duration-300"
							:class="{
								'h-3 w-3 text-purple-700 absolute left-0 top-0': isRouteOrigins,
								'h-7 w-7 text-yellow-400': !isRouteOrigins
							}"
							:stroke-width="1.5"
						/>

						<!-- Texto -->
						<span
							:class="{
								'ml-3': isRouteOrigins
							}"
						>
							{{ isRouteOrigins ? 'Luna Origins' : 'Projeto Lunar' }}
						</span>
						<Lucide
							v-if="isRouteOrigins"
							icon="Stars"
							class="transition-all duration-300 h-3 w-3 text-purple-700 absolute right-36 bottom-0"
							:stroke-width="1.5"
						/>
						<!-- Botão switch -->
						<button
							class="ml-5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
							:class="{ 
								'bg-purple-100 text-purple-700 hover:bg-purple-200': !isRouteOrigins,
								'bg-gray-900 text-white hover:bg-gray-700': isRouteOrigins
							}"
							@click.stop="router.push(isRouteOrigins ? '/' : '/v1/origins')"
						>
							{{ isRouteOrigins ? 'Biblioteca Lunar' : 'Luna Origins' }}
						</button>
					</h1>

					<!-- Ações -->
					<div class="flex items-center pr-4 h-full gap-4">

						<!-- Escrever -->
						<div
							v-if="isRouteOrigins"
							ref="refShowWriteMenu2"
							class="flex items-center justify-center h-full cursor-pointer px-2"
							@click="showWriteMenu = !showWriteMenu"
						>
							<p
								class="flex items-center justify-center gap-1 px-4 py-1.5 rounded-md font-bold font-mono"
								:class="{
									'text-black border-gray-500': isRouteOrigins,
									'text-white': !isRouteOrigins,							}"
							>
								<Lucide icon="PencilLine" class="h-4 w-4 mr-2" />
								<Lucide :icon="showWriteMenu ? 'ChevronUp' : 'ChevronDown'" class="h-4 w-4" />
							</p>
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
								:src="userLocalData?.avatar"
								alt="Foto de perfil"
								class="h-10 w-10 rounded-full"
							>
						</div>
						<Lucide
							v-else
							icon="UserCircle"
							class="h-10 w-10"
							:class="{
								'text-purple-500': isRouteOrigins
							}"
							:stroke-width="0.7"
						/>
					</div>
				</div>
			</header>
		</div>	
		
		<div 
			ref="refShowWriteMenu"
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
					class=" h-full mt-1 fixed top-16 left-0 z-50"
					:class="{
						'hidden': route.path === '/v1/origins/mywork/write' || route.path === '/v1/origins/work/create',
						'hidden lg:flex': route.path !== '/v1/origins/mywork/write' && route.path !== '/v1/origins/work/create'
					}"
				>
					<nav
						class="rounded-2xl p-4 min-w-44 h-[50vh]"
						:class="{
							'bg-[rgba(0,0,0,0.8)]': !isRouteOrigins,
							'bg-white': isRouteOrigins
						}"
					>
						<ul
							class="flex flex-col w-full gap-1 text-violet-400 font-semibold text-[11px]"
						>
							<li>
								<RouterLink 
									:to="isRouteOrigins ? '/v1/origins' : '/'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-700':  isRouteOrigins,
										'hover:bg-gray-100 hover:text-violet-800': route.path !== '/' && !isRouteOrigins,									}"
								>
									<Lucide
											icon="Home"
											size="16"
									/>
									Home
								</RouterLink>
							</li>
							<li
								v-if="!isRouteOrigins"
							>
								<RouterLink 
									to="/shop"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/shop',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-700':  isRouteOrigins,
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
									:to="isRouteOrigins ? `/v1/origins/user/${storage?.user}` || '' : '/profile'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 rounded-md transition"
									:class="{
										'bg-violet-100/10': route.path === '/profile',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-700':  isRouteOrigins,
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
										:class="{'hover:bg-gray-300 hover:text-gray-800 text-gray-700':  isRouteOrigins}"
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

								<li
									v-if="!isRouteOrigins"
								>
									<RouterLink 
										to="/profile/orders"
										class="flex items-center gap-2 px-2 py-1 rounded-md":class="{
										'bg-violet-100/10': route.path === '/profile/orders',
										'hover:bg-gray-300 hover:text-gray-800 text-gray-700':  isRouteOrigins,
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
						class="flex items-center gap-2 font-serif font-bold text-xl italic cursor-pointer select-none relative"
						:class="{
							'text-purple-400': isRouteOrigins,
							'text-white': !isRouteOrigins
						}"
						@click="router.push(isRouteOrigins ? '/v1/origins' : '/')"
					>
						<!-- Ícone principal -->
						<Lucide
							:icon="isRouteOrigins ? 'Stars' : 'MoonStar'"
							class="transition-all duration-300"
							:class="{
								'h-3 w-3 text-white absolute left-0 top-0': isRouteOrigins,
								'h-5 w-5 text-yellow-400': !isRouteOrigins
							}"
							:stroke-width="1.5"
						/>

						<!-- Texto -->
						<span
							class="text-xs"
							:class="{
								'ml-3': isRouteOrigins
							}"
						>
							{{ isRouteOrigins ? 'Luna Origins' : 'Projeto Lunar' }}
						</span>
						<Lucide
							v-if="isRouteOrigins"
							icon="Stars"
							class="transition-all duration-300 h-3 w-3 text-white absolute right-24 bottom-0"
							:stroke-width="1.5"
						/>
						<!-- Botão switch -->
						<button
							class="ml-5 px-2 py-0.5 rounded-md text-xs font-semibold transition-all duration-200 bg-purple-800/70 border border-purple-600 text-purple-200"							
							@click.stop="router.push(isRouteOrigins ? '/' : '/v1/origins')"
						>
							{{ isRouteOrigins ? 'Biblioteca' : 'Origins' }}
						</button>
					</h1>

					<div
						class="flex items-center justify-between w-4/12"
					>
						<!-- Escrever -->
						<div
							v-if="isRouteOrigins"
							ref="refShowWriteMenuNav2"
							class="flex items-center justify-center h-full cursor-pointer px-2"
							@click="showWriteMenuNav = !showWriteMenuNav"
						>
							<p
								class="flex items-center justify-center gap-1py-1.5 rounded-md font-bold font-mono"
							>
								<Lucide icon="PencilLine" class="h-4 w-4 mr-2" />
								<Lucide :icon="showWriteMenuNav ? 'ChevronUp' : 'ChevronDown'" class="h-4 w-4" />
							</p>
						</div>
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
							class="mx-3"
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
									:to="isRouteOrigins ? '/v1/origins' : '/'"
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
									:to="isRouteOrigins ? `/v1/origins/user/${storage?.user}` || '' : '/profile'"
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
				class="flex bg-red-90i0 items-start justify-center relative"
				:class="{
					'w-full': isRouteOrigins,
					'lg:w-[87vw] w-full min-h-screen pt-14 lg:mt-4': !isRouteOrigins
				}"
			>
				<!-- Menu flutuante --> 
				<transition name="fade"> 
					<div 
						ref="refShowWriteMenu"
						v-if="showWriteMenu" 
						class="fixed top-14 w-52 bg-white shadow-lg text-gray-800 rounded-b-xl overflow-hidden border z-50 py-2"
						:class="{
							'right-0': storage?.licenses?.includes('premium'),
							'right-10': !storage?.licenses?.includes('premium')
						}"
					> 
						<ul
							class="text-sm font-mono font-bold"
						> 
							<li
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer" 
								@click="handlePermission"
							>
							<Lucide 
									icon="PencilLine" 
									class="h-4 w-4 text-gray-800" 
								/>
								Criar nova história 
							</li> 
							<li
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
								@click="router.push(`/v1/origins/mywork/list`)"
							> 
								<Lucide 
									icon="BookOpenText" 
									class="h-4 w-4 text-gray-600" 
								/> 
									Minhas histórias
							</li>
							<li 
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer border-t"
							>
								<Lucide 
									icon="Trophy" 
									class="h-4 w-4 text-yellow-600"
								/> 
								Lunar Contest 
							</li> 
						</ul> 
					</div> 
				</transition>

				<!-- Menu flutuante Nav -->
				 <transition name="fade"> 
					<div 
						ref="refShowWriteMenuNav"
						v-if="showWriteMenuNav" 
						class="fixed top-14 w-52 bg-white shadow-lg text-gray-800 rounded-b-xl overflow-hidden border z-50 py-2"
					> 
						<ul
							class="text-sm font-mono font-bold"
						> 
							<li
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer" 
								@click="handlePermission"
							>
							<Lucide 
									icon="PencilLine" 
									class="h-4 w-4 text-gray-800" 
								/>
								Criar nova história 
							</li> 
							<li
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
								@click="router.push('/v1/origins/mywork/list')"
							> 
								<Lucide 
									icon="BookOpenText" 
									class="h-4 w-4 text-gray-600" 
								/> 
									Minhas histórias
							</li>
							<li 
								class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer border-t"
							>
								<Lucide 
									icon="Trophy" 
									class="h-4 w-4 text-yellow-600"
								/> 
								Lunar Contest 
							</li> 
						</ul> 
					</div> 
				</transition>
				<router-view />
			</main>

			<div
				class="fixed bottom-10 right-2 z-10"
			>
				<button
					class="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full p-1"
				
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