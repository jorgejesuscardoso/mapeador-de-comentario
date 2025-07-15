
<script setup lang="ts">
import { getUser, getUserById, getUserWtpd } from '@/API/UserApi'
import Loading from '@/base/loading/Loading.vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const data = ref([])
const isLoading = ref(false)
const router = useRouter()

const handelGetProfile = (user: string) => {
  router.push(`/profile/${user}`)
}

onMounted(async () => {
  isLoading.value = true
  const members = await getUser()

  const filteredMembers = members.filter(member => member != null)

  data.value = filteredMembers

  isLoading.value = false
})

</script>


<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full mx-auto mt-4 lg:mt-11">


    
    <Loading :is-loading="isLoading">
      <template #title>
        Carregando os membros lunar
      </template>
      <template #description>
        Isso pode levar alguns segundos. Por favor, aguarde...
      </template>
    </Loading>



    <div
      v-for="member in data"
      :key="member.user"
      class="bg-white border border-purple-200 rounded-xl shadow-md p-2 py-6 hover:shadow-xl transition-all flex flex-col items-center text-center bg-red relative"
    >
      <!-- Avatar -->
      <div
        class="flex items-center justify-center flex-col"
      >
        <img
          :src="member.avatar || '/user.png'"
          alt="Avatar"
          class="w-24 h-24 lg:w-20 lg:h-20 rounded-full border-2 border-purple-300 object-cover shadow cursor-pointer"
          @click="handelGetProfile(member.user)"
        />

        <!-- Nome + Username -->
        <div>
          <h2 class="text-lg lg:text-sm font-semibold text-purple-800 leading-tight mt-4">
            {{ member.name }}
          </h2>
          <p class="text-sm lg:text-xs text-violet-400">@{{ member.user }}</p>
        </div>
      </div>




      
      <!-- Casa -->
      <div class="flex flex-col items-center absolute left-6 top-20 lg:left-6 lg:top-14">
        <img
          v-if="member.house?.thumb"
          :src="`/houses_flags/${member.house.thumb}`"
          alt="Casa"
          class="w-8 lg:w-6 object-contain rounded-b-full shadow-sm"
        />
        <div
          v-else
          class="w-8 lg:w-6 lg:h-10 h-12 bg-violet-200 rounded-b-full shadow-sm text-purple-600 flex items-center justify-center text-xs rounded"
        >
          —
        </div>

        <p class="text-xs mt-1 lg:text-[10px] font-medium text-purple-600">
          {{ member.house?.name || 'Sem casa' }}
        </p>

      </div>

      <div class="grid grid-cols-2 text-start w-full text-sm lg:text-[11px] text-gray-700 mt-4 ml-2">
        <!-- Cargo -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="BadgeCheck" class="w-3 h-3" />
            Cargo:
          </span>
          <span class="font-medium text-violet-500 ml-2">
            {{ member.role === 'admin' || member.role === 'superadmin' ? 'Adm' : 'Membro' }}
          </span>
        </div>

        <!-- Ranking -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="Trophy" class="w-3 h-3" />
            Ranking:
          </span>
          <span 
            class="font-medium ml-2 px-2 rounded-br-xl  rounded-tl-xl"
            :class="member.tier?.colorClass"
          >
            {{ member.tier?.fullLabel || 'N/A' }}
          </span>
        </div>

        <!-- Obras publicadas -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="BookOpenText" class="w-3 h-3" />
            Obras:
          </span>
          <span class="font-medium text-violet-500 ml-2">
            {{ member.numStoriesPublished }}
          </span>
        </div>

        <!-- Pontos -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="Star" class="w-3 h-3" />
            Pontos:
          </span>
          <span class="font-medium text-violet-500 ml-2">
            {{ member?.tierPoints?.toLocaleString('pt-br') }}
          </span>
        </div>

        <!-- Medalhas -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="Medal" class="w-3 h-3" />
            Medalha:
          </span>
          <span class="font-medium text-violet-500 ml-2">
            0
          </span>
        </div>

        <!-- Conquistas -->
        <div class="flex w-full">
          <span class="flex items-center gap-1 font-medium text-purple-700">
            <Lucide icon="BadgeCheck" class="w-3 h-3" />
            Conquistas:
          </span>
          <span class="font-medium text-violet-500 ml-2">
            0
          </span>
        </div>
      </div>

      <!-- Link para o perfil -->
      <a
        :href="member.deeplink"
        target="_blank"
        class="flex items-center justify-center gap-1 text-xs font-semibold text-purple-700 hover:underline mt-6"
      >
      Ver no Wattpad
      <Lucide icon="ExternalLink" class="w-3 h-3" />
      </a>
    </div>

  </div>
</template>




