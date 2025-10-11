<script setup lang="ts">
import { getUserById, getUserWtpd, updateTierPoints, updatePromotionalTierPoints, updateUser } from '@/API/UserApi';
import RegisterBook from './component/RegisterBook.vue';
import {ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import BookCard from './component/BookCard.vue';
import Lucide from '@/base/lucide/Lucide.vue';
import { getRoleDisplay } from '@/base/helpers/roleDisplay';
import { getTierInfo, getTierProgressLabel, rankingTiers } from '@/base/gamification/tier';
import { capitalize } from '@/base/helpers/capitalize';
import { formatRankingPosition } from '@/base/utils/houseRankingFormat';
import WarningPassReset from '@/base/modals/warningPassReset.vue';

const router = useRouter();
const userData = ref({
  avatar: '',
  createdAt: '',
  perfilWtpd: '',
  description: '',
  gender: '',
  modifyDate: '',
  name: '',
  numFollowers: 0,
  numFollowing: 0,
  numList: 0,
  numPublished: 0,
  userName: '',
  votesReceived: 0,
  promo: [],
  licenses: [] as string[]
})

const isLoading = ref(false)
const userProp = ref('')
const userLogged = ref()
const isLoadingLibrary = ref(false)
const roleTag = ref() 
const promosActived = ref([])
const tierData = ref()
const warningModal = ref(false)

const showReward = ref(false)

function closeReward() {
  showReward.value = false
  handleUpdate()
}

watch(showReward, (value) => {
  if (value) {
    setTimeout(() => {
      if (showReward.value) closeReward()
    }, 5000)
  }
})

watch(userData, (val) => {
  userProp.value = val.userName
  roleTag.value = getRoleDisplay(userLogged?.value?.role, userLogged?.value?.subrole)
  promosActived.value = val.promo
}, { immediate: true, deep: true }) 

watch(tierData, (val) =>{
  promosActived.value = val?.promo
}, {immediate: true })

const handleUpdate = async () => {
  await updatePromotionalTierPoints(userData.value.userName)
  window.location.reload()
}

const roleMap: Record<string, string> = {
  dev: "Desenvolvedor",
  beta_tester: "Usuário Beta",
  admin: "Administrador",
  premium: "Premium",
  cine: "Cine Lunar"
};

onMounted(async () => {
  isLoading.value = true
  const store = localStorage.getItem('user')
  const parsed = store ? JSON.parse(store) : null
  
  if(!parsed) return router.push('/login')

  const tier = await getUserById(parsed.user)
  const zap  = tier?.whatsappNumber

  const data = await getUserWtpd(parsed.user)
  userLogged.value = parsed

  if(!data) return isLoading.value = false

  if(data){
    userData.value = {
      avatar: data.avatar,
      createdAt: data.createDate,
      description: data.description,
      gender: data.gender,
      modifyDate: data.modifyDate,
      name: data.name,
      numFollowers: data.numFollowers,
      numFollowing: data.numFollowing,
      numList: data.numLists,
      numPublished: data.numStoriesPublished,
      perfilWtpd: data.deeplink,
      userName: data.username,
      votesReceived: data.votesReceived,
      promo: data.promo,
      licenses: tier.licenses
    }
  }

  tierData.value = tier
  isLoading.value = false

  const zapModalShowed = JSON.parse(localStorage.getItem('zapModal') || 'null')

  if(!zap) {
    const now = new Date().getTime()
    
    if(!zapModalShowed || (now - zapModalShowed.showIn) >= (10 * 60 * 1000)) {
      // abre modal
      warningModal.value = true
      // salva hora atual
      localStorage.setItem('zapModal', JSON.stringify({ showIn: now }))
    }
  }
})

</script>

<template>
  <div
    v-if="warningModal"
  >
    <WarningPassReset
      @close="warningModal = false"
    />
    
  </div>
  <div class="flex flex-col md:flex-row mt-4 md:mt-0 md:justify-end justify-center items-center md:items-start w-full lg:rounded-xl gap-3 lg:p-2 p-1 min-h-screen relative">
    <div
      v-if="!isLoading"
      class="rounded-2xl md:w-4/12 shadow-sm text-gray-800"
    >
      <div class="flex flex-col lg:flex-row items-start min-h-full gap-2 lg:gap-0 w-full lg:mb-2">
        <!-- Perfil à esquerda -->
        <div class="flex flex-col items-center text-center w-full relative  pr-6 md:border-r border-gray-800 lg:shadow-lg ">
          
          <!-- TAG DE ROLE -->
            <div
              class="flex items-center w-full flex-col bg-[rgba(0,0,0,0.7)] rounded-2xl py-4"
            > 
              <div
                class="flex lg:hidden  flex-col items-end gap-0.5 absolute top-0 right-0"
              >
                <div
                  v-if="tierData?.role"
                  class="rounded-bl-xl rounded-tr-xl px-3 py-1 w-fit text-xs font-semibold text-white shadow-md"
                  :class="roleTag.class "
                >
                  {{
                    roleTag.label
                  }}
                </div>
                <div 
                  v-if="userData?.licenses && userData?.licenses.length > 0"
                  class="flex flex-col items-end gap-0.5"
                >
                  <ul
                    v-for="lin in userData?.licenses"
                    :key="lin"
                    class="rounded-bl-xl rounded-tr-xl px-3 py-1 w-fit text-xs font-semibold text-white shadow-md appearance-none"
                    :class="roleTag.class"
                  >
                    <li>
                      {{ roleMap[lin] ?? lin }}
                    </li>
                  </ul>
                </div>
              </div>
              <!-- TAG DE TIER -->
              <div
                class="absolute top-0 left-0 flex items-center justify-center gap-2"
              >
                <p
                  v-if="tierData?.tier"
                  class="rounded-br-xl rounded-tl-xl px-3 py-1 text-xs font-semibold shadow-md"
                  :class="tierData?.colorClass"
                >
                  {{
                    tierData?.fullLabel
                  }}
                </p>
              </div>
              
            <img
              :src="userData.avatar || ''"
              alt="Avatar"
              class="w-32 h-32 rounded-full border-4 border-purple-300 object-cover shadow"
            />

            <div
              class="flex items-start justify-center mt-4 w-full"
            >

              <div>
                <h2 class="text-lbaseg font-bold text-purple-400">{{ userData.name || userData.userName }}</h2>
                
                <p class="text-xs text-indigo-400 mb-4">@{{ userData.userName }}</p>
              
                
                <!-- Botão de editar perfil -->
                <button
                  class="my-3 inline-flex items-center gap-2 px-4 py-1 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all duration-300 group"
                  @click="router.push('/profile/edit')"
                >
                  <Lucide icon="Edit" class="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                  Editar Perfil
                </button>
                <p class="text-xs text-violet-300 max-w-11/12 px-3">{{ userData.description || 'Sem bio ainda.' }}</p>
                <a
                  :href="userData.perfilWtpd"
                  target="_blank"
                  class="flex items-center w-52  mx-auto text-xs justify-center gap-2 mt-4 bg-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                <Lucide
                  icon="ExternalLink"
                  class="w-4 h-4"
                />
                  Ver perfil no Wattpad
                </a>   

              </div>
            </div>
            </div>
            
          <div
            class="w-full lg:block hidden my-2 border-y border-gray-800 pt-2"
          >
            <RegisterBook />
          </div>
        </div>
      </div>
    </div>


    <div v-else class="flex flex-col items-center justify-center gap-3 mt-22 text-purple-700 animate-pulse">
      <div class="bg-fuchsia-100/60 p-4 rounded-xl shadow w-full max-w-md border border-purple-300">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Lucide icon="Loader2" class="w-5 h-5 animate-spin text-purple-600" />
          <span class="text-base font-medium">Carregando perfil Lunar...</span>
        </div>
        <p class="text-sm text-gray-600">Estamos alinhando os astros para exibir seu perfil magicamente.</p>
      </div>
    </div>
        
    
    <div
      class="w-full lg:hidden mt-2 lg:mt-0"
    >
      <RegisterBook />
    </div>

    <div
      v-if="!isLoading && !isLoadingLibrary"
      class="flex md:w-6/12 bg-[rgb(0,0,0,0.8)] px-4 rounded-2xl"
    >
      <BookCard
        v-if="userProp"
        :user-id="userProp"
      />
    </div>    
    <div v-else class="flex flex-col items-center justify-center gap-3 text-center mt-12 text-purple-700 animate-pulse mb-14">
      <div class="bg-fuchsia-100/60 p-4 rounded-xl shadow w-full max-w-md border border-purple-300">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Lucide icon="Loader2" class="w-5 h-5 animate-spin text-purple-600" />
          <span class="text-base font-medium">Carregando biblioteca Lunar...</span>
        </div>
        <p class="text-sm text-gray-600">Buscando seus livros no Wattpad... isso pode levar alguns segundos.</p>
      </div>
    </div>  
  </div>

<!-- Modal de recompensa -->
<div 
  v-if="showReward"
  class="fixed inset-0 flex flex-col items-center justify-center bg-black/60 z-50"
>
  <div
    class="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-2xl flex flex-col items-center border border-purple-200"
    style="width: 80vw; max-width: 320px"
  >
    <div
      class="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-lg flex items-center justify-center mb-4"
    >
      <Lucide icon="Bitcoin" class="w-10 h-10 text-white drop-shadow" />
    </div>
    <p class="text-xl text-purple-700 font-bold">Parabéns!</p>
    <p class="mt-2 text-purple-700 text-center font-medium">
      Você ganhou <span class="text-yellow-600 font-bold">10 pontos de Elo!</span>
    </p>
    <button
      class="mt-5 text-sm text-white px-2 py-1 rounded-xl bg-fuchsia-700 font-semibold  hover:bg-fuchsia-800 transition"
      @click="closeReward"
    >
      Fechar
    </button>
  </div>
</div>
</template>