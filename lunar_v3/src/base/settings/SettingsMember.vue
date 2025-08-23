<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue"
import Lucide from "@/base/lucide/Lucide.vue"
import { deleteUser, updateUser } from "@/API/UserApi"
import { getHouses } from "@/API/HouseApi"
import { toast } from "../utils/toast"

const data = ref({
  house: "",
  role: "",
  points: 0,
  plus: null,
  subs: [] as string[]
})
const debug = ref(false)
const isSuperAdmin = ref(false)
const inicialPoints = ref(0)
const housesRef = ref<{ name: string }[]>([])
const showDeleteConfirm = ref(false) // modal de confirmação

const allSubs = Array.from({ length: 16 }, (_, i) => `A-${i + 1}`)
data.value.subs = [] as string[]

// função para adicionar um sub
const addSub = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (value && !data.value.subs.includes(value)) {
    data.value.subs.push(value)
  }
  target.value = "" // reseta select
}

// remover um sub já escolhido
const removeSub = (sub: string) => {
  data.value.subs = data.value.subs.filter((s) => s !== sub)
}

const props = defineProps<{
  User: string,
  data: {
    house: string,
    role: string,
    points: number,
    subs: string[]
  }
}>()

const emit = defineEmits(["close", "save", "deleted"])

watch(
  () => props.data,
  (newVal) => {
    inicialPoints.value = newVal.points || 0
  },
  { immediate: true } // já executa na primeira montagem
)

onMounted(async () => {
  const userStore = localStorage.getItem('user')
  const parsedUser = userStore ? JSON.parse(userStore) : null

  if (parsedUser.role === 'superadmin') {
    isSuperAdmin.value = true
  }

  data.value.house = props.data.house
  data.value.role = props.data.role
  data.value.subs = props.data.subs || []
  
  try {
    const houses = await getHouses()
    housesRef.value = houses
  } catch (err) {
    console.error("❌ Erro ao buscar casas:", err)
  }
})

const updateMember = async () => {

  const payload = {
    house: data.value.house || null,
    role: data.value.role,
    subs: data.value.subs
  }

  if(data.value.plus) {
    payload['pointsPlus'] = data.value.points
  } else {
    payload['pointsMinus'] = data.value.points
  }

  try {
    const response = await updateUser(props.User, payload)
    console.log("✅ Atualizado:", response)
    toast.success("Usuário atualizado com sucesso!") 
    emit("save", response)
  } catch (err) {
    console.error("❌ Erro ao atualizar usuário:", err)
  }
}

const updateMemberDebounce = async () => {

  const payload = {
    house: data.value.house || null,
    role: data.value.role,
    subs: data.value.subs
  }

  try {
    const response = await updateUser(props.User, payload)
    console.log("✅ Atualizado:", response)
    toast.success("Usuário atualizado com sucesso!") 
  } catch (err) {
    console.error("❌ Erro ao atualizar usuário:", err)
  }
}

watch(
  () => [data.value.house, data.value.role, data.value.subs],
  () => {
    if (!debug.value) {
      debug.value = true
      return
    } 
    updateMemberDebounce()
  } ,
  { deep: true }
)


const confirmDelete = async () => {
  const getUserStore = localStorage.getItem('user')
  const parsedUser = getUserStore ? JSON.parse(getUserStore) : null

  if (!parsedUser) {
    toast.error("Usuário não autenticado!")
    showDeleteConfirm.value = false
    return
  }

  if (parsedUser?.user === props.User) {
    toast.error("❌ Você não pode excluir a si mesmo!")
    showDeleteConfirm.value = false
    return
  }
  try {
    const response = await deleteUser(props.User, parsedUser.user) // chamada de API

    toast.success("Usuário excluído com sucesso!")

    console.log("🗑️ Usuário excluído:", response)
    emit("close")
    emit('deleted')
  } catch (err) {
    console.error("❌ Erro ao excluir usuário:", err)
    toast.error("Erro ao excluir usuário.")
  }
}
const toggleSwitch = () => {  
  if (!isSuperAdmin.value) {
    toast.error("Você não tem permissão para esta ação.")
    return
  }

  if (data.value.plus === null) {
    data.value.plus = true
  } else {
    data.value.plus = !data.value.plus
  }
  if (data.value.plus === null) {
    data.value.points = 0
  }
}

const handleDeleteClick = () => {
  if (!isSuperAdmin.value) {
    toast.error("Você não tem permissão para esta ação.")
    return
  }

  showDeleteConfirm.value = true
}


</script>

<template>
  <!-- overlay -->
 <!-- overlay -->
<div
  class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
>
  <!-- modal -->
  <div
    class="relative bg-[rgba(0,0,0,0.85)] border border-purple-700 rounded-xl mt-36 shadow-xl p-4 text-purple-200 w-full max-w-lg flex flex-col max-h-[190vh] "
  >
      <!-- título + botão fechar -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold text-violet-200">
          Editar Membro
          <span class="text-sm font-normal text-purple-400 ml-2">
            ( {{ props.User }} )
          </span>
        </h2>
        <Lucide
          icon="X"
          class="w-5 h-5 cursor-pointer hover:text-red-400"
          @click="emit('close')"
        />
      </div>

      <!-- conteúdo -->
      <div class="flex flex-col gap-3">
        <!-- Casa -->
        <div>
        
          <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-2">
            Mudar ou selecionar casa
          </label>
          <select
            v-model="data.house"
            class="w-full rounded-lg border border-purple-500 bg-black/40 text-purple-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 capitalize"
          >
            <option value="" disabled>Selecione uma casa</option>
            <option
              value="Nenhuma"
              class="text-purple-900 capitalize bg-white"
            >
              Nenhuma
            </option>
            <option
              v-for="h in housesRef"
              :key="h.name"
              :value="h.name"
              class="text-purple-900 capitalize bg-white"
            >
              {{ h.name }}
            </option>
          </select>
        </div>

        <!-- Cargo -->
        <div>          
          <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-2">Mudar Cargo</label>
          <select
            v-model="data.role"
            class="w-full rounded-lg border border-purple-500 bg-black/40 text-purple-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="membro" class="text-purple-900 bg-white">
              Membro
            </option>
            <option value="admin" class="text-purple-900 bg-white">
              Administrador
            </option>
            <option value="superadmin" class="text-purple-900 bg-white">
              Super Admin
            </option>
          </select>
        </div>

        <!-- Subs -->
        <div>
          <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-2">
            Selecionar Subgrupo(s)
          </label>

          <!-- select -->
          <select
            @change="addSub"
            class="w-full rounded-lg border border-purple-500 bg-black/40 text-purple-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Selecione um sub</option>
            <option
              v-for="s in allSubs.filter(sub => !data.subs.includes(sub))"
              :key="s"
              :value="s"
              class="text-purple-900 bg-white"
            >
              {{ s }}
            </option>
          </select>


          <!-- lista de subs escolhidos -->
           <label 
            v-if="data.subs.length > 0"
            class="text-xs font-semibold inline-block text-purple-300 w-full text-start my-3"
           >
            Subs selecionados:
           </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="s in data.subs"
              :key="s"
              class="px-2 py-1 rounded-lg bg-purple-700/40 border border-purple-500 text-purple-200 text-sm flex items-center gap-2 cursor-pointer"
            >
              {{ s }}
              <button
                type="button"
                @click="removeSub(s)"
                class="text-red-400 text-xs hover:text-red-200 font-bold"
              >
                <Lucide icon="X" class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- Tipo de pontos -->
        <h3
          class="text-sm font-semibold text-purple-400 mt-4 mb-2 border-b border-purple-600 pt-4" 
        >
          Área com acesso restrito

        </h3>
        <div>
          <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-4">
            Adicionar ou Remover Pontos
          </label>

          <div class="flex flex-col items-start gap-3">
            <!-- switch -->
           <div
              class="flex items-center gap-3"
           >
             <button
                type="button"
                class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none"
                :class="{
                  'bg-green-500': data.plus === true,
                  'bg-red-500': data.plus === false,
                  'bg-gray-600': data.plus === null
                }"
                @click="toggleSwitch"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300"
                  :class="{
                    'translate-x-7': data.plus === true,
                    'translate-x-1': data.plus === false,
                    'translate-x-3': data.plus === null
                  }"
                />
              </button>

              <!-- texto dinâmico -->
              <span
                class="text-sm font-medium"
                :class="{
                  'text-green-400': data.plus === true,
                  'text-red-400': data.plus === false,
                  'text-gray-400': data.plus === null
                }"
              >
                {{ data.plus === true ? "Adicionar pontos" : data.plus === false ? "Remover pontos" : "Nenhum" }}
              </span>
           </div>

            <!-- reset -->
            <button
              v-if="data.plus !== null"
              @click="data.plus = null"
              class="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              Resetar
            </button>
          </div>
        </div>


        <!-- Pontos -->
        <div>          
          <label class="text-xs font-semibold inline-block text-purple-300 w-full text-start mb-2">
            Pontos:
            <span class="text-gray-400 text-xs font-normal ml-2">
              (Atual: {{ inicialPoints.toLocaleString('pt-br') }})
            </span>
          </label>
          <input
            v-model.number="data.points"
            type="number"
            min="0"
            class="w-full rounded-lg border border-purple-500 bg-black/40 text-purple-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            :class="{
              'border-red-500': data.plus === false,
              'border-green-500': data.plus === true,
              'border-gray-500 cursor-not-allowed': data.plus === null
            }"
            :disabled="data.plus === null"
          />
        </div>
      </div>

      <!-- actions -->
      <div class="flex justify-center gap-3 mt-3">
        <button
          @click="emit('close')"
          class="px-3 py-1 text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-500"
          :class="{
            'opacity-50 cursor-not-allowed': !isSuperAdmin
          }"
          :disabled="!isSuperAdmin"
        >
          Cancelar
        </button>
        <button
          @click="updateMember"
          class="px-3 py-1 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-500"
          :class="{
            'opacity-50 cursor-not-allowed': !isSuperAdmin
          }"
          :disabled="!isSuperAdmin"
        >
          Salvar
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="mt-6 border-t border-red-600 pt-4">
        <h3 class="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
        <button
          @click="handleDeleteClick "
          class="w-full px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-500"
          :class="{
            'opacity-50 cursor-not-allowed': showDeleteConfirm
          }"
          :disabled="showDeleteConfirm"
        >
          Excluir membro
        </button>
      </div>

      <!-- Modal de Confirmação de Exclusão -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]"
      >
        <div class="bg-[rgba(0,0,0,0.9)] border border-red-600 rounded-xl p-6 max-w-sm shadow-xl text-red-200 w-full">
          <h2 class="text-lg font-semibold mb-4">⚠️ Confirmar Exclusão</h2>
          <p class="text-sm mb-4">
            Tem certeza que deseja excluir <strong class="text-purple-400"> {{ props.User }} </strong>? <br />
            <span class="text-red-400 font-bold">Essa ação não pode ser desfeita!</span>
          </p>

          <div class="flex justify-center gap-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-3 py-1 text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-500"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
