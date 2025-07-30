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
  promo: []
})

const isLoading = ref(false)
const userProp = ref('')
const userLogged = ref()
const isLoadingLibrary = ref(false)
const roleTag = ref() 
const promosActived = ref([])
const tierData = ref()

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

onMounted(async () => {
  isLoading.value = true
  const store = localStorage.getItem('user')
  const parsed = store ? JSON.parse(store) : null
  
  if(!parsed) return router.push('/login')

  const data = await getUserWtpd(parsed.user)
  userLogged.value = parsed

  console.log(data)
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
      promo: data.promo
    }
  }

  const tier = await getUserById(parsed.user)
  tierData.value = tier
  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-screen  px-1 lg:px-4 relative">
    <div
        class="top-0 lg:top-6 py-4 px-1 absolute z-10 left-0"
    >
      <h1
        class="flex items-center text-purple-400 text-sm cursor-pointer"
        @click="router.back()"
      >
        <Lucide
            icon="ArrowLeft"
            class="w-5 h-5"
          />
      </h1>
    </div>

      <div
        v-if="!isLoading"
        class="rounded-2xl lg:mt-8 mt-4 py-8  w-full mx-auto  shadow-sm text-gray-800 space-y-6"
      >
        <div class="flex flex-col lg:flex-row items-start min-h-full gap-8 w-full">
          <!-- Perfil à esquerda -->
          <div class="flex flex-col items-center text-center w-full lg:w-1/2 relative userCard lg:shadow-lg rounded-xl">
            
            <!-- Moeda promocional -->
            <div
              v-if="!promosActived?.includes('start')"
              class="flex items-center justify-center flex-col absolute top-24 right-6 z-50 w-14"
            >
              <button
                class="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-xl flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-300"
                @click="showReward = !showReward"
              >
                <Lucide icon="Bitcoin" class="w-6 h-6 text-white drop-shadow" />
              </button>

              <p class="text-white text-[10px] text-center">+10 pontos</p>
            </div>

            <!-- TAG DE ROLE -->
              <div
                class="flex items-center w-full flex-col bg-[rgba(0,0,0,0.7)] rounded-2xl py-4"
              >
                <div
                  v-if="tierData?.role"
                  class="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl px-3 py-1 w-fit text-xs font-semibold text-white shadow-md"
                  :class="roleTag.class "
                >
                  {{
                    roleTag.label
                  }}
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

                  <span
                    class="flex gap-1 text-white text-[10px] w-fit text-start"
                    @click="router.push('/tierlist')"
                  >
                    <Lucide
                      icon="TableProperties"
                      class="w-5 h-5"
                    />
                  </span>
                </div>
                
              <img
                :src="userData.avatar || ''"
                alt="Avatar"
                class="w-32 h-32 rounded-full border-4 border-purple-300 object-cover shadow"
              />

              <!--House-->
              <div
                v-if="tierData?.house?.thumb"
                class="flex flex-col items-center rounded-md p-1 absolute top-14 left-2 lg:top-5 lg:left-16"
              >
                <h3 class="text-xs mb-1 font-semibold text-purple-400 ">
                  {{ formatRankingPosition(tierData.house.rankingPosition) }}
                </h3>
                <div
                  class="flex items-center"
                >
                  <img 
                    :src="`/houses_flags/${tierData?.house?.thumb}`"
                    alt="Bandeira da Casa"
                    class="w-12 h-12 object-contain rounded-full border-2 bg-white/50 border-purple-400 shadow"
                  >
                </div>
                <p
                  class="flex items-center justify-center text-xs text-purple-400 rounded-full bg-fuch5sia-800 px-2 h-6 font-semibold"
                >
                  {{ tierData.house.name }}
                </p>

                <p class="flex items-center justify-center text-[10px] font-medium text-purple-400">
                  <Lucide
                    icon="Bitcoin" 
                    class="w-3 h-3 text-white drop-shadow rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600 shadow-xl flex items-center justify-center mr-1" 
                    /> {{ tierData.house?.points?.toLocaleString('pt-br') || 'Sem casa' }} pts.
                </p>
              </div>

              <div
                class="flex items-start justify-center mt-4 w-full"
              >

                <div>
                  <h2 class="text-lg font-bold text-purple-400">{{ userData.name || userData.userName }}</h2>
                  <!-- Botão de editar perfil -->
                  <p class="text-sm text-indigo-400">@{{ userData.userName }}</p>
                <button
                  class="m-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all duration-300 group"
                  @click="router.push('/profile/edit')"
                >
                  <Lucide icon="Edit" class="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                  Editar Perfil
                </button>
                  <p class="text-sm text-violet-300 max-w-md px-3">{{ userData.description || 'Sem bio ainda.' }}</p>
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
          </div>

          <!-- Estatísticas à direita -->
          <div class="gap-6 w-full lg:w-5/12">
            <div
              v-if="tierData?.tier"
              class="lg:px-6"
            >
              <div class="bg-[rgb(0,0,0,0.7)] rounded-xl p-4 shadow-md mb-2">
              
                <!-- Cabeçalho bonito -->
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-purple-400 uppercase tracking-wider">Progresso de Tier</h3>
                  <div class="flex items-center gap-1 text-xs font-semibold text-gray-400">
                   <p>Tier Atual: </p>
                    <div :class="tierData?.colorClass" class="flex flex-col px-2 py-1 rounded shadow relative">
                      <span>{{ tierData.fullLabel }}</span>
                      <span class="absolute top-6 right-0 text-purple-400">{{ tierData.progressText }}</span>
                    </div>
                  </div>
                </div>

                <!-- Progresso numérico -->
                <p class="flex items-center justify-start gap-1 text-sm text-gray-200 mt-4">
                  
                <Lucide
                 icon="Bitcoin" 
                 class="w-4 h-4 text-white drop-shadow rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600 shadow-xl flex items-center justify-center" 
                 /> 
                  Falta <span class="font-bold text-purple-400">{{ tierData.pointsToNext }}</span> pts para se tornar 
                  <span class="font-semibold text-purple-400">{{ tierData?.nextTierLabel }}</span>
                </p>

                <!-- Barra de progresso estilizada -->
                <div class="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    class="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-700 ease-out"
                    :style="{ width: ((tierData?.eloPoints / tierData?.maxPoints) * 100) + '%' }"
                  ></div>
                </div>

                <!-- Detalhes numéricos opcionais -->
                <div class="text-[11px] text-gray-300 mt-1 text-right relative">
                 
                  <span class="absolute top-0 right-1/2 text-purple-400">{{ tierData.progressPercent }}%</span> 

                  {{ tierData?.eloPoints }} / {{ tierData?.maxPoints }} pontos
                </div>
              </div>
            </div>

            <div v-else class="lg:px-6 mb-4">
              <div class="bg-[rgb(0,0,0,0.7)] rounded-xl p-4 shadow-md border border-gray-200 space-y-2 text-center">
                <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wider">Você ainda não foi ranqueado</h3>
                <p class="text-xs text-gray-600">
                  🌑 Colete pontos para começar sua jornada no Ranking Lunar.<br>
                  Conquiste feitos, participe da comunidade e não falhe nas leituras!
                </p>
                <div class="mt-2">
                  <span class="inline-block px-3 py-1 rounded-full text-xs bg-gray-300 text-gray-600 font-semibold tracking-wider">
                    Tier: Desconhecido
                  </span>
                </div>
              </div>
            </div>



            <div class="grid grid-cols-2 w-full sm:grid-cols-2 gap-3 lg:gap-6 lg:px-6">
               <!-- Pontos tier -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="Trophy" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.rakingPosition?.toLocaleString('pt-br') || "N/A" }}
                  </p>
                  <p class="text-sm text-gray-300">Ranking Geral</p>
                </div>
              </div>

              <!-- Pontos tier -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="Trophy" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.houseRakingPosition?.toLocaleString('pt-br') || "N/A" }}
                  </p>
                  <p class="text-sm text-gray-300">Ranking na Casa</p>
                </div>
              </div>
              <!-- Pontos Lunar -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.points?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-300">Pontos Lunar</p>
                </div>
              </div>

              <!-- Pontos elo -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.tierPoints?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-300">Pontos de Elo Total</p>
                </div>
              </div>

              

              <!-- Seguidores -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="Users" class="w-5 h-5 text-purple-400" />
                    {{ userData.numFollowers }}
                  </p>
                  <p class="text-sm text-gray-300">Seguidores</p>
                </div>
              </div>

              <!-- Seguindo -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="UserPlus" class="w-5 h-5 text-purple-400" />
                    {{ userData.numFollowing }}
                  </p>
                  <p class="text-sm text-gray-300">Seguindo</p>
                </div>
              </div>

              <!-- Histórias publicadas -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between  gap-1 text-xl font-bold text-purple-400"
                  >  
                    <Lucide icon="BookOpen" class="w-5 h-5 text-purple-400" />
                    {{ userData.numPublished }}
                  </p>
                  <p class="text-sm text-gray-300">Histórias</p>
                </div>
              </div>

              <!-- Votos recebidos -->
              <div class="bg-[rgb(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="Star" class="w-5 h-5 text-purple-400 fill-yellow-500" />
                    {{ userData.votesReceived }}
                  </p>
                  <p class="text-sm text-gray-300">Votos totais</p>
                </div>
              </div>
            </div>
          
            <div
              class="hidden w-full lg:flex mt-6 lg:px-6"
            >
              <RegisterBook />
            </div>
          </div>
        </div>
      </div>


      <div v-else class="flex flex-col items-center justify-center gap-3 mt-12 text-purple-700 animate-pulse">
        <div class="bg-fuchsia-100/60 p-4 rounded-xl shadow w-full max-w-md border border-purple-300">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Lucide icon="Loader2" class="w-5 h-5 animate-spin text-purple-600" />
            <span class="text-base font-medium">Carregando perfil Lunar...</span>
          </div>
          <p class="text-sm text-gray-600">Estamos alinhando os astros para exibir seu perfil com magia.</p>
        </div>
      </div>
        
    
      <div
        class="w-full lg:hidden"
      >
        <RegisterBook />
      </div>

    <div
      v-if="!isLoading && !isLoadingLibrary"
      class="flex w-full mt-2 lg:mt-0 mb-4 bg-[rgb(0,0,0,0.8)] p-4 rounded-2xl pb-14"
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