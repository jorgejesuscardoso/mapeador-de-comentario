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
  <div class="flex flex-col justify-center items-center w-full min-h-screen  px-4 relative">
    <div
        class="top-0 lg:top-6 p-4 absolute z-10 left-0"
    >
      <h1
        class="flex items-center text-purple-400 text-sm cursor-pointer"
        @click="router.push('/members')"
      >
        <Lucide
            icon="ArrowLeft"
            class="w-5 h-5"
          />
      </h1>
    </div>

      <div
        v-if="!isLoading"
        class="rounded-2xl lg:mt-12 mt-8 py-4 w-full mx-auto shadow-sm text-gray-800 space-y-6"
      >
        <div class="flex flex-col lg:flex-row items-start min-h-full gap-8 w-full">
          <!-- Perfil à esquerda -->
          <div class="flex flex-col items-center text-center w-full lg:w-1/2 relative userCard lg:shadow-lg rounded-xl ">
            <!-- TAG DE ROLE -->
              <div
                class="flex items-center w-full flex-col bg-[rgba(0,0,0,0.7)] rounded-2xl"
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
                <div
                  v-if="tierData?.rankingPosition"
                  class="flex items-center justify-center absolute text-violet-300 top-6 right-10"
                >
                  {{ formatRankingPosition(tierData?.rankingPosition) }}
                </div>
              <img
                :src="userData.avatar || ''"
                alt="Avatar"
                class="w-32 h-32 rounded-full border-4 border-purple-300 object-cover shadow mt-6"
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
                  v-if="tierData.house"
                  class="flex items-center justify-center text-xs text-purple-400 rounded-full bg-fuch5sia-800 px-2 h-6 font-semibold"
                >
                  {{ capitalize(tierData.house.name)}}
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

            <div class="grid grid-cols-2 w-full sm:grid-cols-2 gap-3 lg:gap-6 lg:px-6">

               <!-- Pontos tier -->
              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
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
              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
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



              <!-- Pontos tier -->
              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.totalTierPoints?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-300">Pontos de Elo Total</p>
                </div>
              </div>


              <!-- Pontos elo -->
              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="CirclePoundSterling" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.eloPoints?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-300">Pontos no Elo atual</p>
                </div>
              </div>

              <!-- Pontos elo -->
              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-start gap-3 text-xl font-bold text-purple-400"
                  > 
                    <Lucide icon="Link2" class="w-5 h-5 text-purple-400" />
                    {{ tierData?.nextTierLabel?.toLocaleString('pt-br') || 0 }}
                  </p>
                  <p class="text-sm text-gray-300">Próximo Elo</p>
                </div>
              </div>

              <div class="bg-[rgba(0,0,0,0.7)] p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-2 text-lg font-bold text-purple-400"
                  > 
                    <Lucide icon="Link" class="w-5 h-5 text-purple-400 " />
                    {{ tierData?.fullLabel }}
                  </p>
                  <p class="text-sm text-gray-300">Elo mais alto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>        

    <div
      v-if="!isLoading && !isLoadingLibrary"
      class="flex w-full pb-14 bg-[rgba(0,0,0,0.7)] p-4 rounded-xl mb-4"
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