
<script setup lang="ts">
import { getUser } from '@/API/UserApi'
import Loading from '@/base/loading/Loading.vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { ref, onMounted, nextTick, watch, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { setCache, getCache } from '../../base/cache/Cache' // Mesmo local que o dos livros
import FilterBar from '@/base/filters/FilterBar.vue'
import SearchInput from '@/base/Inputs.vue/SearchInput.vue'
import { capitalize } from '@/base/helpers/capitalize'
import { formatRankingPosition } from '@/base/utils/houseRankingFormat'
import SettingsMember from '@/base/settings/SettingsMember.vue'


const cacheKey = 'cache_member_v1'
const data = ref([])
const isLoading = ref(false)
const fetchError = ref(false)
const retrying = ref(false)
const permanentFailure = ref(false)
const search = ref('')
const rankingPosition = ref(0)
const router = useRouter()
const isAdmin = inject('isAdmin')
const ShowConfigMember = ref<string | null>(null)

const toggleConfig = (memberId: string) => {
  ShowConfigMember.value = ShowConfigMember.value === memberId ? null : memberId
}

const handleGetProfile = (user: string) => {
  const userLogged = JSON.parse(localStorage.getItem('user')) || '';
  if(user && user === userLogged.user) return router.push('/profile')
  router.push(`/profile/${user}`)
}

const normalize = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

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

const filteredMembers = computed(() => {
  if (!search.value.trim()) return data.value

  const term = normalize(search.value)

  return data.value.filter(member => {
    const name = normalize(member.name || '')
    const username = normalize(member.user || '')
    const house = normalize(member.house?.name || '')

    return (
      name.includes(term) ||
      username.includes(term) ||
      house.includes(term)
    )
  })
})

watch(data, (val) => {
  const sorted = [...val].sort((a, b) => {
    const pointsA = a?.tierPoints || 0;
    const pointsB = b?.tierPoints || 0;
    return pointsB - pointsA;
  });

  sorted.forEach((member, index) => {
    member.rankingPosition = index + 1;
  });
});


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

const saveSettings = () => {
  ShowConfigMember.value = null
  setTimeout(async () => {
    const freshMembers = await fetchMembers()
    if (freshMembers.length > 0) {
      data.value = freshMembers
      setCache(cacheKey, freshMembers, 604800) // 7 dias
      console.log('🔄 Refetch pós-salvar concluído!')
    }
  }, 300)
}

const reload = async () => {
  isLoading.value = true
  const freshMembers = await fetchMembers()
  search.value = ''
  if (freshMembers.length > 0) {
    data.value = freshMembers
    setCache(cacheKey, freshMembers, 604800) // 7 dias
    console.log('🔄 Refetch pós-deletar concluído!')
  }
  isLoading.value = false
}

const toggleShowConfigMember = () => {
  ShowConfigMember.value = null
  window.location.reload()
}

</script>


<template>
    
  <div
    class="w-full px-2 lg:px-6"
  >
    <!--Barra de pesquisa-->
    <div
      class="mb-2 relative px-4 pt-5 pb-3 rounded-xl bg-[rgba(0,0,0,0.4)]"
    >
      <div class="flex flex-col items-between justify-start gap-3">
        
        <div 
          ref="filterMenuRef2"
          class="flex flex-col text-xs text-indigo-700"
        >
          <div
            class="flex items-center justify-between gap-3"
          >
            <div
              class="flex items-center text-violet-200 text-sm justify-center gap-1 cursor-pointer"
            >
              <Lucide
                icon="Search"
                class="w-4 h-4"
              />
              Buscar membro lunar:
            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-start justify-between "
        >
          <div class="w-full  mb-4">
            <SearchInput
              v-model="search"
              placeholder="Busque por usuário, nome ou casa!"
              class="border-gray-100"
            />
          </div> 
            <p
              class="text-white text-[10px]"
            >
              Membros encontrados: {{ filteredMembers.length }}
            </p>     
        </div>
      </div>  
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full mx-auto mt-4 lg:mt-11">

      
      <Loading :is-loading="isLoading">
        <template #title>
          Carregando os membros lunar
        </template>
        <template #description>
          Isso pode levar alguns segundos. Por favor, aguarde...
        </template>
      </Loading>


      <!--Card-->
      <div
        v-for="member in filteredMembers"
        :key="member.user"
        class="bg-white border border-purple-700 transition-all rounded-xl flex flex-col items-center text-center  relative userCard"
      >
        <div
          class="bg-[rgba(0,0,0,0.8)] w-full h-full p-2 py-6 rounded-xl shadow-md hover:shadow-xl"
        >

          <div
            v-if="member?.rankingPosition"
            class="flex flex-col items-center justify-center absolute text-violet-300 top-6 right-10 gap-10"
          >
            {{ formatRankingPosition(member?.rankingPosition) }}

            <!-- Botão de configurações -->
            <div
              v-if="isAdmin"
              class="mt-10 relative"
            >              
              <Lucide
                icon="Settings2"
                class="w-6 h-6 object-contain rounded-full p-1.5 bg-white/10 shadow cursor-pointer absolute"
                title="Configurações do membro"
                @click="toggleConfig(member.user)"
              />
            </div>
          </div>

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
                <h2 class="text-lg lg:text-sm font-semibold text-purple-200 leading-tight mt-4">
                  {{ member.name }}
                </h2>
                <p class="text-sm lg:text-xs text-violet-300">@{{ member.user }}</p>
              </div>
            </div>




            
            <!-- Casa -->
            <!-- <div class="flex flex-col items-center absolute left-4 top-6 lg:left-3 ">
              <h3 class="text-[10px] mb-1 font-semibold text-purple-300 ">
                {{ member?.house ? formatRankingPosition(member?.house?.rankingPosition) : 'N/A'}}
              </h3>
              
              <div
                v-if="member.house?.thumb"
                class="flex items-center"
              >
                <img
                  :src="`/houses_flags/${member.house.thumb}`"
                  alt="Casa"                
                  class="w-12 h-12 object-contain rounded-full border-2 bg-white/50 border-purple-400 shadow"
                />
              </div>

              <div
                v-else
              >
                <div
                  class="w-8 lg:w-6 lg:h-6 h-12 bg-violet-200 rounded-b-full shadow-sm text-purple-400 flex items-center justify-center text-xs rounded"
                >
                  —
                </div>
              </div>

              <p class="text-[10px] mt-1 lg:text-[10px] font-medium text-purple-300">
                {{ capitalize(member.house?.name) || 'Sem casa' }}
              </p>

              <p 
                v-if="member.house"
                class="flex items-center justify-center text-[10px] font-medium text-purple-300"
              >
                <Lucide
                  icon="Bitcoin" 
                  class="w-2.5 h-2.5 text-white drop-shadow rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600 shadow-xl flex items-center justify-center mr-1" 
                  /> {{ member.house.points?.toLocaleString('pt-br') || 'Sem casa' }} pts.
              </p>
            </div> -->

            <div class="grid grid-cols-2 text-start w-full text-sm lg:text-[11px] text-gray-700 mt-4 ml-2">
              <!-- Cargo -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="BadgeCheck" class="w-3 h-3" />
                  Cargo:
                </span>
                <span class="font-medium text-violet-300 ml-2">
                  {{ member.role === 'admin' || member.role === 'superadmin' ? 'Adm' : 'Membro' }}
                </span>
              </div>

              <!-- Ranking -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="Trophy" class="w-3 h-3" />
                  Ranking:
                </span>
                <span 
                  class="flex items-center font-medium ml-2 px-2 rounded-br-xl text-[11px] rounded-tl-xl"
                  :class="member.tier?.colorClass || 'text-white bg-red-600'"
                >
                  {{ member.tier?.fullLabel || 'N/A' }}
                </span>
              </div>

              <!-- Obras publicadas -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="BookOpenText" class="w-3 h-3" />
                  Obras:
                </span>
                <span class="font-medium text-violet-300 ml-2">
                  {{ member.numStoriesPublished }}
                </span>
              </div>

              <!-- Pontos -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="Star" class="w-3 h-3" />
                  Pontos:
                </span>
                <span class="font-medium text-violet-300 ml-2">
                  {{ member?.points?.toLocaleString('pt-br') }}
                </span>
              </div>

              <!-- Medalhas -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="Medal" class="w-3 h-3" />
                  Medalha:
                </span>
                <span class="font-medium text-violet-300 ml-2">
                  0
                </span>
              </div>

              <!-- Conquistas -->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="BadgeCheck" class="w-3 h-3" />
                  Conquistas:
                </span>
                <span class="font-medium text-violet-300 ml-2">
                  0
                </span>
              </div>

              <!--Subs-->
              <div class="flex w-full">
                <span class="flex items-center gap-1 font-medium text-purple-300">
                  <Lucide icon="Users" class="w-3 h-3" />
                  Subs:
                </span>
                <span 
                  v-if="member.subs && member.subs.length === 0 || !member.subs"
                  class="font-medium text-violet-300 ml-2"
                >
                  Nenhum
                </span>
                <span 
                  v-else
                  v-for="sub in member.subs"
                  class="font-medium text-violet-300 ml-2 after:content-[','] last:after:content-['.']"
                >
                  {{ sub }}
                </span>
              </div>
            </div>

            <!-- Link para o perfil -->
            <a
              :href="member.deeplink"
              target="_blank"
              class="flex items-center justify-center gap-1 text-xs font-semibold text-purple-300 hover:underline mt-6"
            >
            Ver no Wattpad
            <Lucide icon="ExternalLink" class="w-3 h-3" />
            </a>
          </div>

          <SettingsMember 
            v-if="ShowConfigMember === member.user"
            class="fixed z-50 top-14 xl:top-10 overflow-auto py-20"
            :data="{
              house: member.house?.name || '',
              role: member.role || 'member',
              points: member.points || 0,
              subs: member.subs || []
            }"
            @close="toggleShowConfigMember"
            @save="saveSettings()"
            @deleted="reload()"
            :User="member.user"
          />
        </div>        

    </div>
  </div>
</template>




