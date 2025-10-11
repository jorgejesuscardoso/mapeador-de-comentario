<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Lucide from '../lucide/Lucide.vue'
import NotificationsContainer from '../notification/NotificationsContainer.vue';
import { getSales } from '@/API/ShopLunar';
import { toast } from '../utils/toast';
import { getUserById, getUserWtpd } from '@/API/UserApi';
import FooterLunar from '../footer/FooterLunar.vue';

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

const showNavMenu = ref(false)

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
const refNavPc = ref<HTMLElement | null>(null);
const refNavPc2 = ref<HTMLElement | null>(null);
const refShowWriteMenu = ref<HTMLElement | null>(null);
const refShowWriteMenu2 = ref<HTMLElement | null>(null);
const refShowWriteMenuNav = ref<HTMLElement | null>(null);
const refShowWriteMenuNav2 = ref<HTMLElement | null>(null);
const darkMode = ref(false)

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
		showNavMenu.value &&
		refNavPc.value &&
		refNavPc2.value &&
		!refNavPc.value.contains(target) &&
		!refNavPc2.value.contains(target)
		) {
		showNavMenu.value = false;
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
		if(storage?.value?.licenses && storage?.value?.licenses.some((s) => s === 'premium')) {
			isPremium.value = true
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
			notification.value = 0		
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

watch(
  () => route.fullPath,
  () => {
    showWriteMenu.value = false
    showWriteMenuNav.value = false
    menuOpen.value = false
    showNotification.value = false
    showNotification2.value = false
		showNavMenu.value = false
		scrollToTop()
  }
)

provide('isAdmin', isAdmin)
provide('isBeta', isBeta)
provide('isPremium',isPremium)
provide('isDev', isDev)
provide('isCiner', isCiner)


const STORAGE_KEY = 'pl-theme' // "dark" | "light" | "system"
const theme = ref<'dark'|'light'|'system'>('system')
const isDark = ref(false)

// Aplica a classe `dark` no document.documentElement
function applyThemeValue(value: 'dark'|'light') {
  const el = document.documentElement
  if (value === 'dark') el.classList.add('dark')
  else el.classList.remove('dark')
  isDark.value = value === 'dark'
}

// Lê preferência do sistema
function preferedSystemIsDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Carrega estado (prioridade: localStorage > system)
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY) as 'dark'|'light'|'system' | null
  theme.value = saved || 'system'

  if (theme.value === 'system') {
    applyThemeValue(preferedSystemIsDark() ? 'dark' : 'light')
  } else {
    applyThemeValue(theme.value)
  }

  // Escuta mudanças do sistema caso o usuário escolha "system"
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme.value === 'system') applyThemeValue(e.matches ? 'dark' : 'light')
    })
  }
})

function toggle() {
  // ciclo: light -> dark -> system -> light (opcional, aqui só alterna light/dark)
  const next = isDark.value ? 'light' : 'dark'
  theme.value = next
  localStorage.setItem(STORAGE_KEY, next)
  applyThemeValue(next)
}
</script>

<template>
	<div
		class="min-h-screen min-w-screen dark:bg-gray-950"
	>
		<div
			:class="{
				'hidden': route.path.startsWith('/v1/origins/mywork/write') || route.path === '/v1/origins/work/create'
			}"
		>
			<header 
				class="hidden lg:block w-full text-gray-50 overflow-hidden fixed z-40 "
				:class="{
					'border-b border-[#fff2]': !isRouteOrigins,
					'dark:bg-gray-950 dark:border-gray-900 bg-white border-b border-purple-200': isRouteOrigins
				}"
			>
				<div 
					class="flex items-center justify-between whitespace-nowrap text-center p-1 h-14 dark:bg-black"
					:class="isRouteOrigins ? 'bg-white' : 'bg-black'"
				>
					<h1 
						class="flex items-center text-purple-700 dark:text-purple-400 gap-2 font-serif font-bold text-xl italic cursor-pointer select-none relative"
					>
						<!-- Texto -->
						<span
							@click="router.push(isRouteOrigins ? '/v1/origins' : '/')"
							class="w-44 text-start"
						>
							Projeto Lunar
						</span>
						
						<!-- Botão switch -->
						<button
							class="flex items-center justify-center ml-5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 text-purple-100 dark:bg-[#ffffff15] bg-black/80 border"
							:class="{
								'border-gray-800': !isRouteOrigins,
								'border-none': isRouteOrigins
							}"					
							@click.stop="router.push(isRouteOrigins ? '/' : '/v1/origins')"
						>
							{{ isRouteOrigins ? 'Biblioteca' : 'Originais' }}
							<Lucide 
								icon="ArrowUpDown"
								class="h-3 w-3 ml-1"
							/>
						</button>

						<!-- Botão switch Modo -->
						<button
							v-if="isRouteOrigins"
							@click="toggle"
							:aria-pressed="isDark"
							aria-label="Alternar modo noturno"
							class="inline-flex items-center gap-3 p-1 rounded-full transition   backdrop-blur-sm text-gray-800 dark:text-white"
							title="Alternar tema"
						>
							<span class="flex items-center justify-center w-6 h-6">
								<Lucide :icon="isDark ? 'Moon' : 'Sun' " class="w-5 h-5" />
							</span>
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
							<button
								class="flex items-center justify-center gap-1 px-4 py-1.5 font-bold font-mono  border-r border-gray-500"
								:class="{
									'text-black dark:text-gray-300': isRouteOrigins,
									'text-white': !isRouteOrigins
								}"
							>
								<Lucide icon="PencilLine" class="h-4 w-4 mr-2" />
								<Lucide 
									:icon="'ChevronDown'" 
									class="h-4 w-4" 
								/>
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
						<div 
							ref="refNavPc"
							v-if="userLocalData && isLogged"
							@click="showNavMenu = !showNavMenu"
							class="flex items-center justify-center h-full cursor-pointer px-2 relative z-10"
						>
							<Lucide 
								icon="EllipsisVertical"
								class="h-4 w-4 dark:text-gray-300 text-gray-700 mr-2"
							/>
							<img 
								:src="userLocalData?.avatar"
								alt="Foto de perfil"
								class="h-10 w-10 rounded-full"
							>
						</div>
						<Lucide
							v-else
							icon="UserCircle cursor-pointer"
							class="h-10 w-10"
							:class="{
								'text-purple-500': isRouteOrigins
							}"
							:stroke-width="0.7"							
							@click="showNavMenu = !showNavMenu"
						/>
					</div>
				</div>
			</header>
		</div>	

		<div
			class="flex items-center justify-end bg-[rgb(0,0,0)]"
		>
			<div
				class="flex w-full items-center justify-end"
			>

				<div
					ref="refNavPc2"
					v-if="showNavMenu && isRouteOrigins"
					class=" h-full fixed top-14 right-1 z-50"
				>
					<nav
						class="rounded-b-md py-2 px-1 min-w-44 h-fit min-h-[30vh] bg-[#ffffff] border-gray-300 dark:bg-black border dark:border-white/10 shadow-xl shadow-black/30"
					>
						<ul
							class="flex flex-col w-full md:gap-1 text-gray-600 dark:text-gray-400 font-semibold text-sm"
						>						
							<li>
								<RouterLink 
									:to="isRouteOrigins ? `/v1/origins/user/${storage?.user}` || '' : '/profile'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
								>
									<Lucide
											icon="CircleUserRound"
											size="18"
									/>
									Perfil
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									:to="isRouteOrigins ? '/v1/origins' : '/'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
								>
									<Lucide
											icon="Home"
											size="18"
									/>
									Home
								</RouterLink>
							</li>
							<li
								v-if="!isRouteOrigins"
							>
								<RouterLink 
									to="/shop"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
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
										v-if="!isLogged"
										to="/register"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
									>
										<Lucide icon="FileInput" size="14" />
										Registro
									</RouterLink>
								</li>

								<!-- Notificação -->
								<li>
									<RouterLink 
										to="#"
										class="flex items-center gap-2 px-2 py-1 text-inactive line-through"
									>
										<Lucide icon="Bell" size="14" />
										Notificações
									</RouterLink>
								</li>
							<!-- ////// -->

								<li
									v-if="!isRouteOrigins"
								>
									<RouterLink 
										to="/profile/orders"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
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
										class="flex w-full border-t border-gray-300 dark:border-gray-800 px-2 py-3 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
									>
										<Lucide
												:icon="isLogged ? 'LogOut': 'LogIn'"
												size="18"
										/>
										{{ isLogged ? 'Sair' : 'Login' }}
									</RouterLink>
								</li>
							
						</ul>
					</nav>
				</div>

				<!-- Nav pc2 -->
				<div
					v-if="!isRouteOrigins"
					class="hidden md:flex h-full fixed top-16 left-1 z-40"
				>
					<nav
						class="rounded-md py-4 px-1 min-w-48 h-fit min-h-[50vh] bg-neutral-950"
					>
						<ul
							class="flex flex-col w-full md:gap-1 text-[#bbb] font-semibold text-sm"
						>						
							<li>
								<RouterLink 
									:to="isRouteOrigins ? `/v1/origins/user/${storage?.user}` || '' : '/profile'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition hover:bg-white/5"
								>
									<Lucide
											icon="CircleUserRound"
											size="18"
									/>
									Perfil
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									:to="isRouteOrigins ? '/v1/origins' : '/'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition hover:bg-white/5"
								>
									<Lucide
											icon="Home"
											size="18"
									/>
									Home
								</RouterLink>
							</li>
							<li
								v-if="!isRouteOrigins"
							>
								<RouterLink 
									to="/shop"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition hover:bg-white/5"
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
										v-if="!isLogged"
										to="/register"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition hover:bg-white/5"
									>
										<Lucide icon="FileInput" size="14" />
										Registro
									</RouterLink>
								</li>								

								<li
									v-if="!isRouteOrigins"
								>
									<RouterLink 
										to="/profile/orders"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition hover:bg-white/5"
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
										class="flex w-full border-t border-gray-300 dark:border-gray-800 px-2 py-3 items-center justify-start gap-2 transition hover:bg-white/5"
									>
										<Lucide
												:icon="isLogged ? 'LogOut': 'LogIn'"
												size="18"
										/>
										{{ isLogged ? 'Sair' : 'Login' }}
									</RouterLink>
								</li>
							
						</ul>
					</nav>
				</div>

			<!-- Mobile Nav -->
			<div class="lg:hidden w-full  text-white fixed top-0 left-0 z-20"
				:class="{
					'hidden': route.path === '/v1/origins/work/create'
				}"
			>
				<div 
					v-if="showNotification" 
					ref="refNavPc" 
				>
					<NotificationsContainer 
						
					/>
				</div>
				<div 
					class="flex items-center justify-between py-4 px-1 bg-[rgb(0,0,0)] border-b border-[#fff3] dark:border-gray-600"
				>
					<h1 
						class="flex items-center text-purple-400 gap-1 font-serif font-bold text-xl italic cursor-pointer select-none relative"						
						@click="router.push(isRouteOrigins ? '/v1/origins' : '/')"
					>						
						<!-- Texto -->
						<span
							class="text-xs"
						>
							Projeto Lunar
						</span>

						<!-- Botão switch -->
						<button
							class="flex items-center justify-center ml-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 text-purple-100 bg-[#ffffff15] border border-gray-950"							
							@click.stop="router.push(isRouteOrigins ? '/' : '/v1/origins')"
						>
							{{ isRouteOrigins ? 'Biblioteca' : 'Originais' }}
							<Lucide 
								icon="ArrowUpDown"
								class="h-3 w-3 ml-1"
							/>
						</button>
					</h1>

					<div
						class="flex items-center justify-between w-5/12"
					>
						<!-- Escrever -->
						<div
							ref="refShowWriteMenuNav2"
							class="flex items-center justify-center h-full cursor-pointer"
							@click="showWriteMenuNav = !showWriteMenuNav"
						>
							<p
								class="flex items-center justify-center gap-1py-1.5 rounded-md font-bold font-mono"
							>
								<Lucide icon="PencilLine" class="h-4 w-4 mr-2" /><Lucide 
									:icon="'ChevronDown'" 
									class="h-3 w-3" 
								/>
							</p>
						</div>

						<!-- Switch theme -->
						<button
							@click="toggle"
							:aria-pressed="isDark"
							aria-label="Alternar modo noturno"
							class="inline-flex items-center gap-3 p-1 rounded-full mx-1 transition backdrop-blur-sm text-gray-50"
							title="Alternar tema"
						>
							<span class="flex items-center justify-center w-6 h-6">
								<Lucide :icon="isDark ? 'Moon' : 'Sun' " class="w-5 h-5" />
							</span>
						</button>
						

						<!-- Menu flutuante -->
						<button 
							ref="menuRef2"
							@click.stop="menuOpen = !menuOpen, showNotification = false, showWriteMenuNav = false" 
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
						v-if="menuOpen"
						class="rounded-b-md py-2 px-1 min-w-44 h-fit bg-[#ffffff] border-gray-50 dark:bg-black border dark:border-white/10 shadow-xl shadow-black/30"
					>
						<ul
							class="grid grid-cols-2 w-full gap-2 md:gap-1 text-gray-600 dark:text-gray-400 font-semibold text-sm pb-2"
						>						
							<li>
								<RouterLink 
									:to="isRouteOrigins ? `/v1/origins/user/${storage?.user}` || '' : '/profile'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
								>
									<Lucide
											icon="CircleUserRound"
											size="18"
									/>
									Perfil
								</RouterLink>
							</li>
							<li>
								<RouterLink 
									:to="isRouteOrigins ? '/v1/origins' : '/'"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
								>
									<Lucide
											icon="Home"
											size="18"
									/>
									Home
								</RouterLink>
							</li>
							<li
								v-if="!isRouteOrigins"
							>
								<RouterLink 
									to="/shop"
									class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
								>
									<Lucide
											icon="Store"
											size="14"
									/>
									Lojinha Lunar
								</RouterLink>
							</li>

							
								<li
									v-if="!isLogged"								
								>
									<RouterLink 
										to="/register"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
									>
										<Lucide icon="FileInput" size="14" />
										Registro
									</RouterLink>
								</li>

								<!-- Notificação -->
								<li>
									<RouterLink 
										to="#"
										class="flex items-center gap-2 px-2 py-1 text-inactive line-through"
									>
										<Lucide icon="Bell" size="14" />
										Notificações
									</RouterLink>
								</li>
							<!-- ////// -->

								<li
									v-if="!isRouteOrigins"
								>
									<RouterLink 
										to="/profile/orders"
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
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
										class="flex w-full px-2 py-1 items-center justify-start gap-2 transition dark:hover:bg-white/5 hover:bg-black/10"
									>
										<Lucide
												:icon="isLogged ? 'LogOut': 'LogIn'"
												size="18"
										/>
										{{ isLogged ? 'Sair' : 'Login' }}
									</RouterLink>
								</li>
							
						</ul>
					</nav>
				</transition>
			</div>

				<div
					class="flex flex-col w-full items-center justify-start"
				>
					<main
						class="flex flex-col items-center justify-start relative w-full min-h-screen"
						:class="{
							'mt-14': route.path !== '/v1/origins/work/create' && !route.path.startsWith('/v1/origins/mywork/write'),
						}"
					>
						<!-- Menu flutuante --> 
							<transition name="fade"> 
								<div 
									ref="refShowWriteMenu"
									v-if="showWriteMenu" 
									class="fixed top-14 w-52 bg-white shadow-lg text-gray-800 rounded-b-xl overflow-hidden border z-50 py-2 dark:bg-black dark:border-[#2227] dark:text-[#ccc]"
									:class="{
										'right-0': storage?.licenses?.includes('premium'),
										'right-10': !storage?.licenses?.includes('premium')
									}"
								> 
									<ul
										class="text-sm font-mono font-bold"
									> 
										<li
											class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer" 
											@click="handlePermission"
										>
										<Lucide 
												icon="PencilLine" 
												class="h-4 w-4 text-gray-800 dark:text-[#ccc]" 
											/>
											Criar nova história 
										</li> 
										<li
											class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
											@click="router.push(`/v1/origins/user/${storage?.user}`)"
										> 
											<Lucide 
												icon="BookOpenText" 
												class="h-4 w-4 text-gray-600 dark:text-[#ccc]" 
											/> 
												Minhas histórias
										</li>
										<li 
											class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer border-t dark:border-[#fff2]"
										>
											<Lucide 
												icon="Trophy" 
												class="h-4 w-4 text-yellow-600 "
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
									class="fixed top-14 w-52 bg-white shadow-lg text-gray-800 rounded-b-xl overflow-hidden border z-50 py-2 dark:bg-black dark:border-[#2227] dark:text-[#ccc]"
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
												class="h-4 w-4" 
											/>
											Criar nova história 
										</li> 
										<li
											class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
											@click="router.push(`/v1/origins/user/${storage?.user}`)"
										> 
											<Lucide 
												icon="BookOpenText" 
												class="h-4 w-4 " 
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
						<FooterLunar />
				</div>
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