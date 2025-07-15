
<script setup lang="ts">
import { getUser, getUserById, getUserWtpd } from '@/API/UserApi'
import { ref, onMounted } from 'vue'

const data = ref([])

onMounted(async () => {
  const members = await getUser()

  const filteredMembers = members.filter(member => member != null)

  data.value = filteredMembers

  console.log(filteredMembers)
})

</script>


<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-11/12 mx-auto mt-10">
    <div
      v-for="member in data"
      :key="member.user"
      class="bg-white border border-purple-200 rounded-xl shadow-md p-5 hover:shadow-xl transition-all flex flex-col items-center text-center space-y-6 relative"
    >
      <!-- Avatar -->
      <div
        class="flex items-center justify-center flex-col"
      >
        <img
          :src="member.avatar || '/user.png'"
          alt="Avatar"
          class="w-24 h-24 rounded-full border-2 border-purple-300 object-cover shadow"
        />

        <!-- Nome + Username -->
        <div>
          <h2 class="text-lg font-semibold text-purple-800 leading-tight mt-4">
            {{ member.name }}
          </h2>
          <p class="text-sm text-gray-500">@{{ member.user }}</p>
        </div>
      </div>




      
      <!-- Casa -->
      <div class="flex flex-col items-center absolute left-6 top-0">
        <h1 class="font-semibold text-sm uppercase mb-2 text-purple-600">Casa</h1>
        <img
          v-if="member.house?.thumb"
          :src="`/houses_flags/${member.house.thumb}`"
          alt="Casa"
          class="w-8 object-contain rounded-b-full shadow-sm"
        />
        <div
          v-else
          class="w-8 h-12 bg-violet-200 rounded-b-full shadow-sm text-purple-600 flex items-center justify-center text-xs rounded"
        >
          —
        </div>

        <p class="text-xs mt-1 font-medium text-purple-600">
          {{ member.house?.name || 'Sem casa' }}
        </p>

      </div>

      <!-- Informações principais -->
      <div class="grid grid-cols-2 text-start gap-2 w-full text-sm text-gray-700 mt-2 ml-2">
        <div><span class="font-medium text-purple-700">Cargo:</span> 
          <span 
            class="font-medium text-violet-700 ml-2"
          >
            {{ member.role === 'admin' || member.role === 'superadmin' ? 'Adm' : 'Membro' }}
          </span>
        </div>

        <div><span class="font-medium text-purple-700">Ranking:</span> 
          <span 
            class="font-medium text-violet-700 ml-2"
          >
            {{ member.tier?.fullLabel || 'N/A' }}
          </span>
        </div>


        <div><span class="font-medium text-purple-700">Obras:</span> 
          <span 
            class="font-medium text-violet-700 ml-2"
          > 
            {{ member.numStoriesPublished }}
          </span>
        </div>

        <div><span class="font-medium text-purple-700">Pontos:</span> 
          <span 
            class="font-medium text-violet-700 ml-2"
          >
            {{ member.tierPoints }}
          </span>
        </div>
        
        <div><span class="font-medium text-purple-700">Medal:</span>
          <span 
            class="font-medium text-violet-700 ml-2"
          >
            0
          </span>
        </div>
        <div><span class="font-medium text-purple-700">Conquistas:</span> <span class="font-medium text-violet-700"> 0</span> </div>
      </div>

      <!-- Link para o perfil -->
      <a
        :href="member.deeplink"
        target="_blank"
        class="text-xs font-semibold text-purple-700 hover:underline mt-2"
      >
        Ver no Wattpad
      </a>
    </div>
  </div>
</template>




