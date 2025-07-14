<script setup lang="ts">
import { getUserWtpd } from '@/API/UserApi';
import RegisterBook from './component/RegisterBook.vue';
import {ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import BookCard from './component/BookCard.vue';
import Lucide from '@/base/lucide/Lucide.vue';
import { getRoleDisplay } from '@/base/helpers/roleDisplay';


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
  votesReceived: 0
})
const isLoading = ref(false)
const userProp = ref('')
const userLogged = ref()
const isLoadingLibrary = ref(false)

const roleTag = ref() 

watch(userData, (val) => {
    userProp.value = val.userName
    roleTag.value = getRoleDisplay(userLogged?.value?.role, userLogged?.value?.subrole)
}, {immediate: true })

onMounted(async () => {
  isLoading.value = true
  const store = localStorage.getItem('user')
  const parsed = store ? JSON.parse(store) : null
  
  if(!parsed) return router.push('/login')
  const data = await getUserWtpd(parsed.user)
  userLogged.value = parsed

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
      votesReceived: data.votesReceived
    }
  }

  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-screen bg-white px-4">
    
      <div
        v-if="!isLoading"
        class="rounded-2xl lg:mt-8 py-8 lg:px-6 w-full mx-auto bg-white shadow-sm text-gray-800 space-y-6"
      >
        <div class="flex flex-col lg:flex-row items-center gap-8 w-full">
          <!-- Perfil à esquerda -->
          <div class="flex flex-col items-center text-center w-full lg:w-1/2 relative bg-fuchsia-200 lg:shadow-lg rounded-xl lg:pb-3">
            <!-- TAG DE ROLE -->
              <div
                v-if="userLogged?.role"
                class="absolute lg:relative top-0 right-0 rounded-bl-xl rounded-tr-xl lg:rounded-tr-none lg:rounded-b-xl px-3 py-1 text-xs font-semibold text-white shadow-md"
                :class="roleTag.class"
              >
                {{
                  roleTag.label
                }}
              </div>
            <img
              :src="userData.avatar || ''"
              alt="Avatar"
              class="w-32 h-32 rounded-full border-4 border-purple-300 object-cover shadow"
            />
            <h2 class="mt-4 text-lg font-bold text-purple-700">{{ userData.name || userData.userName }}</h2>
            <p class="text-sm text-indigo-700 mb-2">@{{ userData.userName }}</p>
            <p class="text-sm text-fuchsia-950 max-w-md px-3">{{ userData.description || 'Sem bio ainda.' }}</p>
            <a
              :href="userData.perfilWtpd"
              target="_blank"
              class="flex items-center text-xs justify-center gap-2 mt-4 bg-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition mb-6"
            >
            <Lucide
              icon="ExternalLink"
              class="w-4 h-4"
            />
              Ver perfil no Wattpad
            </a>
          </div>

          <!-- Estatísticas à direita -->
          <div class="gap-6 w-full lg:w-5/12">
            <div class="grid grid-cols-2 w-full sm:grid-cols-2 gap-3 lg:gap-6 lg:px-6">
              <!-- Seguidores -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="Users" class="w-5 h-5 text-purple-500" />
                    {{ userData.numFollowers }}
                  </p>
                  <p class="text-sm text-gray-500">Seguidores</p>
                </div>
              </div>

              <!-- Seguindo -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="UserPlus" class="w-5 h-5 text-purple-500" />
                    {{ userData.numFollowing }}
                  </p>
                  <p class="text-sm text-gray-500">Seguindo</p>
                </div>
              </div>

              <!-- Histórias publicadas -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between  gap-1 text-xl font-bold text-purple-600"
                  >  
                    <Lucide icon="BookOpen" class="w-5 h-5 text-purple-500" />
                    {{ userData.numPublished }}
                  </p>
                  <p class="text-sm text-gray-500">Histórias</p>
                </div>
              </div>

              <!-- Votos recebidos -->
              <div class="bg-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <div>
                  <p 
                    class="flex items-center justify-between gap-1 text-xl font-bold text-purple-600"
                  > 
                    <Lucide icon="Star" class="w-5 h-5 text-purple-500 fill-yellow-400" />
                    {{ userData.votesReceived }}
                  </p>
                  <p class="text-sm text-gray-500">Votos totais</p>
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
      class="flex w-full mt-16 pb-14"
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
</template>