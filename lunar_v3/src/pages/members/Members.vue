
<script setup lang="ts">
import { getUser } from '@/API/UserApi'
import Loading from '@/base/loading/Loading.vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { setCache, getCache } from '../../base/cache/Cache' // Mesmo local que o dos livros


const cacheKey = 'cache_member_v1'
const data = ref([])
const isLoading = ref(false)
const fetchError = ref(false)
const retrying = ref(false)
const permanentFailure = ref(false)

const router = useRouter()

const handleGetProfile = (user: string) => {
  router.push(`/profile/${user}`)
}

async function fetchMembers(){
  try {
    const members = await getUser()
    return members.filter(m => m != null)
  } catch (err) {
    console.error('❌ Erro ao buscar membros:', err)
    return []
  }
}

async function loadMembersNormally() {
  const timeoutLimit = 50000 // 50s
  const retryInterval = 5000 // 5s

  const startTime = Date.now()
  let members = []

  while ((Date.now() - startTime) < timeoutLimit && members.length === 0) {
    members = await fetchMembers()
    if (members.length > 0) break

    retrying.value = true
    fetchError.value = true
    await new Promise(res => setTimeout(res, retryInterval))
  }

  data.value = members

  if (members.length === 0) {
    permanentFailure.value = true
  } else {
    setCache(cacheKey, members, 604800) // 7 dias
  }

  retrying.value = false
  fetchError.value = false
  isLoading.value = false
}

function membersAreDifferent(oldList, newList) {
  if (oldList.length !== newList.length) return true;

  for (let i = 0; i < oldList.length; i++) {
    const oldMember = oldList[i];
    const newMember = newList.find(m => m.id === oldMember.id);

    if (!newMember) return true;

    // Aqui você pode ajustar quais campos são importantes pra detectar mudança
    if (
      oldMember.name !== newMember.name ||
      oldMember.avatar !== newMember.avatar ||
      oldMember.user !== newMember.user ||
      oldMember.role !== newMember.role ||
      oldMember.tierPoints !== newMember.tierPoints
    ) {
      return true;
    }
  }

  return false;
}
async function updateMembersInBackground(oldMembers) {
  const freshMembers = await fetchMembers()

  if (membersAreDifferent(oldMembers, freshMembers)) {
    data.value = freshMembers
    setCache(cacheKey, freshMembers, 604800)
    console.log('📥 Membros atualizados em segundo plano.')
  } else {
    console.log('✅ Cache de membros ainda válido.')
  }
}

watch(data,(val) => {  
})


setTimeout(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}, 200) 

onMounted(async () => {
  await nextTick() 
  isLoading.value = true
  const cached = getCache(cacheKey)

  if (cached && cached.length > 0) {
    data.value = cached
    isLoading.value = false
    
    window.scrollTo({top:0,behavior:'smooth'})
    // Atualização em segundo plano
    updateMembersInBackground(cached)
    return
  }
  
  window.scrollTo({top:0,behavior:'smooth'})
  await loadMembersNormally()
  isLoading.value = false
  
})

// Atualiza a cada 10 minutos se tiver mudanças
setInterval(async () => {
  const freshMembers = await fetchMembers()

  const currentIds = data.value.map(m => m.id).join(',')
  const newIds = freshMembers.map(m => m.id).join(',')

  if (currentIds !== newIds && freshMembers.length > 0) {
    data.value = freshMembers
    setCache(cacheKey, freshMembers, 604800)
    console.log('🔄 Membros atualizados via setInterval')
  } else {
    console.log('📦 Nenhuma mudança nos membros detectada')
  }
}, 60 * 10 * 1000)

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
      class="bg-white border border-purple-200 transition-all rounded-xl flex flex-col items-center text-center  relative userCard"
    >
    <div
      class="bg-[rgba(0,0,0,0.5)] w-full h-full p-2 py-6 rounded-xl shadow-md hover:shadow-xl"
    >
      <div
      class="flex items-center justify-center flex-col "
      >
      <!-- Avatar -->
          <img
            :src="member.avatar || '/user.png'"
            alt="Avatar"
            class="w-24 h-24 lg:w-20 lg:h-20 rounded-full border-2 border-purple-300 object-cover shadow cursor-pointer"
            @click="handleGetProfile(member.user)"
          />

          <!-- Nome + Username -->
          <div>
            <h2 class="text-lg lg:text-sm font-semibold text-purple-400 leading-tight mt-4">
              {{ member.name }}
            </h2>
            <p class="text-sm lg:text-xs text-violet-300">@{{ member.user }}</p>
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
            class="w-8 lg:w-6 lg:h-10 h-12 bg-violet-200 rounded-b-full shadow-sm text-purple-400 flex items-center justify-center text-xs rounded"
          >
            —
          </div>

          <p class="text-xs mt-1 lg:text-[10px] font-medium text-purple-400">
            {{ member.house?.name || 'Sem casa' }}
          </p>

        </div>

        <div class="grid grid-cols-2 text-start w-full text-sm lg:text-[11px] text-gray-700 mt-4 ml-2">
          <!-- Cargo -->
          <div class="flex w-full">
            <span class="flex items-center gap-1 font-medium text-purple-400">
              <Lucide icon="BadgeCheck" class="w-3 h-3" />
              Cargo:
            </span>
            <span class="font-medium text-violet-300 ml-2">
              {{ member.role === 'admin' || member.role === 'superadmin' ? 'Adm' : 'Membro' }}
            </span>
          </div>

          <!-- Ranking -->
          <div class="flex w-full">
            <span class="flex items-center gap-1 font-medium text-purple-400">
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
            <span class="flex items-center gap-1 font-medium text-purple-400">
              <Lucide icon="BookOpenText" class="w-3 h-3" />
              Obras:
            </span>
            <span class="font-medium text-violet-300 ml-2">
              {{ member.numStoriesPublished }}
            </span>
          </div>

          <!-- Pontos -->
          <div class="flex w-full">
            <span class="flex items-center gap-1 font-medium text-purple-400">
              <Lucide icon="Star" class="w-3 h-3" />
              Pontos:
            </span>
            <span class="font-medium text-violet-300 ml-2">
              {{ member?.tierPoints?.toLocaleString('pt-br') }}
            </span>
          </div>

          <!-- Medalhas -->
          <div class="flex w-full">
            <span class="flex items-center gap-1 font-medium text-purple-400">
              <Lucide icon="Medal" class="w-3 h-3" />
              Medalha:
            </span>
            <span class="font-medium text-violet-300 ml-2">
              0
            </span>
          </div>

          <!-- Conquistas -->
          <div class="flex w-full">
            <span class="flex items-center gap-1 font-medium text-purple-400">
              <Lucide icon="BadgeCheck" class="w-3 h-3" />
              Conquistas:
            </span>
            <span class="font-medium text-violet-300 ml-2">
              0
            </span>
          </div>
        </div>

        <!-- Link para o perfil -->
        <a
          :href="member.deeplink"
          target="_blank"
          class="flex items-center justify-center gap-1 text-xs font-semibold text-purple-400 hover:underline mt-6"
        >
        Ver no Wattpad
        <Lucide icon="ExternalLink" class="w-3 h-3" />
        </a>
      </div>
    </div>

  </div>
</template>




