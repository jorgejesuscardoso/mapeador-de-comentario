<script setup lang="ts">
import { getUserById, getUserWtpd, updateTierPoints, updatePromotionalTierPoints } from '@/API/UserApi';
import RegisterBook from './component/RegisterBook.vue';
import {ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

const route = useRoute();

const isLoading = ref(false)
const userProp = ref('')
const userLogged = ref()
const isLoadingLibrary = ref(false)
const roleTag = ref() 
const promosActived = ref([])
const tierData = ref()

const showReward = ref(false)

const userId = route.params.user

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

watch(tierData, (val) => {
  userProp.value = userId as string
  roleTag.value = getRoleDisplay(val?.role, val?.subrole)
  promosActived.value = val?.promo
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
  const data = await getUserWtpd(userId as string)

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

  const tier = await getUserById(userId as string)
  tierData.value = tier
  isLoading.value = false
  isLoadingLibrary.value = false

  window.scrollTo({top:0,behavior:'smooth'})
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-screen bg-white px-4 relative">
    <div
        class="top-0 lg:top-7 p-4 absolute z-10 left-0 lg:left-6"
      >
        <h1
          class="flex items-center text-purple-800 text-sm cursor-pointer"
          @click="router.push('/members')"
        >
          <Lucide
              icon="ArrowLeft"
              class="w-5 h-5"
            />
            Voltar
        </h1>
      </div>

      <div
        v-if="!isLoading"
        class="rounded-2xl mt-5 lg:mt-12 py-4 lg:px-6 w-full mx-auto bg-white shadow-sm text-gray-800 space-y-6"
      >
        <div class="flex flex-col lg:flex-row items-start min-h-full gap-8 w-full">
          <!-- Perfil à esquerda -->
          <div class="flex flex-col items-center text-center w-full lg:w-1/2 relative userCard lg:shadow-lg rounded-xl lg:pb-3">
            <!-- TAG DE ROLE -->
              <div
                class="flex items-center w-full flex-col bg-[rgba(0,0,0,0.5)] rounded-2xl"
              >
                <div
                  v-if="tierData?.role"
                  class="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl px-3 py-1 w-fit text-xs font-semibold text-white shadow-md"
                  :class="roleTag.class"
                >
                  {{
                    roleTag.label
                  }}
                </div>
                <!-- TAG DE TIER -->
                <div
                  v-if="tierData?.tier"
                  class="absolute top-0 left-0 rounded-br-xl rounded-tl-xl px-3 py-1 text-xs font-semibold shadow-md"
                  :class="tierData?.colorClass"
                >
                  {{
                    tierData?.fullLabel
                  }}
                </div>
                
              <img
                :src="userData.avatar || ''"
                alt="Avatar"
                class="w-32 h-32 rounded-full border-4 border-purple-300 object-cover shadow"
              />

              <div
                v-if="tierData?.house?.thumb"
                class="flex flex-col items-center rounded-md p-1 absolute top-14 left-2 lg:top-5 lg:left-16"
              >
                <h3 class="text-xs mb-1 font-semibold text-purple-400 ">
                  {{ formatRankingPosition(tierData.house.rankingPosition) }}
                </h3>
                <img 
                  :src="`/houses_flags/${tierData?.house?.thumb}`"
                  alt="Bandeira da Casa"
                  class="w-8 h-12  rounded-b-3xl rounded-t-md"
                >
                <p
                  class="flex items-center justify-center text-xs text-purple-400 rounded-full bg-fuch5sia-800 px-2 h-6 font-semibold"
                >
                  {{ capitalize(tierData.house.name) }}
                </p>

                <p class="flex items-center justify-center text-xs lg:text-[10px] font-medium text-purple-400">
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
                  <p class="text-sm text-indigo-400 mb-2">@{{ userData.userName }}</p>
                  <p class="text-sm text-fuchsia-300 max-w-md px-3">{{ userData.description || 'Sem bio ainda.' }}</p>
                  <a
                    :href="userData.perfilWtpd"
                    target="_blank"
                    class="flex items-center w-52  mx-auto text-xs justify-center gap-2 mt-4 bg-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition mb-6"
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
              <div class="hidden bg-gradient-to-br from-fuchsia-100 mb-4 via-purple-100 to-white rounded-xl p-4 shadow-md border border-purple-200">
              
                <!-- Cabeçalho bonito -->
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-purple-800 uppercase tracking-wider">Progresso de Tier</h3>
                  <div class="flex items-center gap-1 text-xs font-semibold text-gray-500">
                   <p>Tier Atual: </p>
                    <div :class="tierData?.colorClass" class="flex flex-col px-2 py-1 rounded text-white shadow relative">
                      <span>{{ tierData.fullLabel }}</span>
                      <span class="absolute top-6 right-0 text-purple-800">{{ tierData.progressText }}</span>
                    </div>
                  </div>
                </div>

                <!-- Progresso numérico -->
                <p class="text-sm text-gray-700 mt-4">
                  🌕 Falta <span class="font-bold text-purple-700">{{ tierData.pointsToNext }}</span> pts para se tornar 
                  <span class="font-semibold text-purple-800">{{ tierData?.nextTierLabel }}</span>
                </p>

                <!-- Barra de progresso estilizada -->
                <div class="relative w-full h-3 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                  <div
                    class="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-700 ease-out"
                    :style="{ width: ((tierData?.eloPoints / tierData?.maxPoints) * 100) + '%' }"
                  ></div>
                </div>

                <!-- Detalhes numéricos opcionais -->
                <div class="text-[11px] text-gray-500 mt-1 text-right relative">
                 
                  <span class="absolute top-0 right-1/2 text-purple-700">{{ tierData.progressPercent }}%</span> 

                  {{ tierData?.eloPoints }} / {{ tierData?.maxPoints }} pontos
                </div>
              </div>
            </div>

            
            <div v-else class="lg:px-6 mb-4">
              <div class="bg-gradient-to-br from-slate-100 via-gray-100 to-white rounded-xl p-4 shadow-md border border-gray-200 space-y-2 text-center">
                <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ userId }} ainda não foi ranqueado</h3>
               
                <div class="mt-2">
                  <span class="inline-block px-3 py-1 rounded-full text-xs bg-gray-300 text-gray-600 font-semibold tracking-wider">
                    Tier: Desconhecido
                  </span>
                </div>
              </div>
            </div>




            <div class="grid grid-cols-2 w-full sm:grid-cols-2 gap-3 lg:gap-6 lg:px-6">

               <!-- Pontos tier -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="Trophy" class="w-5 h-5 text-purple-500" />
                    {{ tierData?.rakingPosition?.toLocaleString('pt-br') || "N/A" }}
                  </p>
                  <p class="text-sm text-gray-500">Ranking Geral</p>
                </div>
              </div>

              <!-- Pontos tier -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="Trophy" class="w-5 h-5 text-purple-500" />
                    {{ tierData?.houseRakingPosition?.toLocaleString('pt-br') || "N/A" }}
                  </p>
                  <p class="text-sm text-gray-500">Ranking na Casa</p>
                </div>
              </div>



              <!-- Pontos tier -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-500" />
                    {{ tierData?.totalTierPoints?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-500">Pontos de Elo Total</p>
                </div>
              </div>


              <!-- Pontos elo -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-500" />
                    {{ tierData?.eloPoints?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-500">Pontos no Elo atual</p>
                </div>
              </div>

              <!-- Pontos elo -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="Link2" class="w-5 h-5 text-purple-500" />
                    {{ tierData?.nextTierLabel?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-500">Próximo Elo</p>
                </div>
              </div>

              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-2 text-lg font-bold text-purple-600"
                  > 
                    <Lucide icon="Link" class="w-5 h-5 text-purple-500 " />
                    {{ tierData?.fullLabel }}
                  </p>
                  <p class="text-sm text-gray-500">Elo mais alto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>        

    <div
      v-if="!isLoading && !isLoadingLibrary"
      class="flex w-full mt-16 pb-14"
    >
      <BookCard
        v-if="userProp"
        :user-id="userProp"
        :third-user=true
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

</template>