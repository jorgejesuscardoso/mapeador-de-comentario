<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Lucide from '@/base/lucide/Lucide.vue'
import { deleteHouse, updateHouse } from '@/API/HouseApi'
import { toast } from '@/base/utils/toast'
import switch_1 from '@/base/switch/switch_1.vue'
import { getUser } from '@/API/UserApi'
import Selectmembers from '@/base/form/Selectmembers.vue'

interface House {
  name: string
  description: string
  theme: string
  banner: string
  thumb: string
  points: number
  rankingPosition: number
  level: number
  leader: string
  subLeader: string
  memberCount: number
  members: string[]
  achievements: string[]
  tags: string[]
}

const plus = ref(null)
const isSuperAdmin = ref(false)
const usersWithoutHouse = ref<string[]>([])

const props = defineProps<{
  house: House
  show: boolean
}>()

const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''

const emit = defineEmits(['close', 'save'])

// state local editável
const form = ref({
  name: props.house.name,
  points: props.house.points,
  description: props.house.description,
  theme: props.house.theme,
  tags: [...props.house.tags],
  members: props.house.members
})

// proxy formatado
const pointsFormatted = computed({
  get() {
    return form.value.points?.toLocaleString('pt-BR') || ''
  },
  set(value: string) {
    // limpa tudo que não seja dígito
    const numeric = value.replace(/\D/g, '')
    form.value.points = numeric ? Number(numeric) : 0
  }
})

// evita letras no input
const blockNonNumeric = (e: KeyboardEvent) => {
  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
    e.preventDefault()
  }
}

// para adicionar tag nova
const newTag = ref('')

const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}
const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const saveChanges = async () => {
  const payload = {
    description: form.value.description,
    points: form.value.points,
    theme: form.value.theme,
    tags: form.value.tags,
    members: form.value.members
  }

  try {
    await updateHouse(form.value.name, payload)
    toast.success("Casa atualizada com sucesso!")
    emit('save', payload)
  } catch (err) {
    toast.error("Erro ao atualizar casa.")
    console.error(err)
  }
}


const toggleSwitch = () => {  
  if (!isSuperAdmin.value) {
    toast.error("Você não tem permissão para esta ação.")
    return
  }
  
  if (plus.value === null) {
    plus.value = true
  } else {
    plus.value = !plus.value
  }
}

const newMember = ref('')

const addMember = () => {
  const member = newMember.value.trim()
  if (member && !form.value.members.includes(member)) {
    form.value.members.push(member)

    // remove do select pra não aparecer mais
    usersWithoutHouse.value = usersWithoutHouse.value.filter(u => u !== member)

    // reseta select pro placeholder
    newMember.value = ''
  }
}



const removeMember = (member: string) => {
  form.value.members = form.value.members.filter(m => m !== member)
}

const getUsers = async () => {
  const response = await getUser()
  const usersWithoutHous = []

  response.filter((s) => {
    if (!s.house) {
      usersWithoutHous.push(s.username)
    }
  })
  usersWithoutHouse.value = usersWithoutHous
}

const showDeleteConfirm = ref(false)

const openDeleteModal = () => {
  if (currentUser.role !== 'superadmin' && currentUser.username !== props.house.leader) {
    toast.warning("Você não tem permissão para excluir esta casa.")
    return
  }
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteHouse(form.value.name)
    toast.success("Casa excluída com sucesso!")
    window.location.reload()
  } catch (err) {
    toast.error("Erro ao excluir casa.")
    console.error(err)
  } finally {
    showDeleteConfirm.value = false
  }
}

onMounted(() => {
  isSuperAdmin.value = currentUser.role === 'superadmin'
  getUsers()
})

</script>

<template>
  <!--Overlay-->
  <div
    v-if="show"
    class="fixed inset-0 z-40 bg-black bg-opacity-50"
  >
    <!--Content-->
    <div
      v-if="show"
      class="fixed inset-0 z-50 mt-28 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div
        class="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-screen pb-20"
      >
        <!-- Botão fechar -->
        <button
          class="absolute top-3 right-3 text-gray-400 hover:text-white"
          @click="emit('close')"
        >
          <Lucide icon="X" class="w-5 h-5" />
        </button>

        <h2 class="text-xl font-semibold text-purple-300 mb-4">
          Editar Casa
        </h2>

        <!-- Nome -->
        <label class="block mb-3">
          <span class="text-sm text-gray-300">
            Nome: 
            <span 
              class="text-xs text-gray-500 italic"
            >
             (Não editável)
            </span>
          </span>
          <span
            class="text-xs text-gray-500 italic block mb-1"
          >
            Se precisar mudar o nome, banner ou o brasão, exclua a casa e crie uma nova ou entre em contato com o administrador.
          </span>
          <p
            class="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none capitalize"
          >
            {{ form.name }}
          </p>
        </label>

        <!-- Pontos -->
        <label 
          v-if="isSuperAdmin"
          class="block mb-3"
        >
          <span class="text-sm text-gray-300">
            Pontos:
            <span
              class="text-xs text-gray-500 italic"
            >
              (Atual: {{ form.points.toLocaleString('pt-br') }} pts)
            </span>
          </span>

          <switch_1 
            v-model="plus"
            @click="toggleSwitch"
            :disabled="!isSuperAdmin"
            class="mb-2"
          />

         <input
            v-model="pointsFormatted"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            @keypress="blockNonNumeric":class="{
              'border-red-500': plus === false,
              'border-green-500': plus === true,
              'border-gray-500 cursor-not-allowed': plus === null
            }"
            :disabled="plus === null"
            class="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
          />
        </label>

        <!-- Descrição -->
        <label class="block mb-3">
          <span class="text-sm text-gray-300">Descrição</span>
          <textarea
            v-model="form.description"
            rows="3"
            class="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
          ></textarea>
        </label>

        <!-- Tema -->
        <label class="block mb-3">
          <span class="text-sm text-gray-300">Tema</span>
          <input
            v-model="form.theme"
            type="text"
            class="mt-1 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
          />
        </label>

        <!-- Tags -->
        <div class="mb-4">
          <span class="text-sm text-gray-300">Tags</span>
          <div class="flex gap-2 flex-wrap mt-2">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="bg-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              #{{ tag }}
              <button
                class="text-red-300 hover:text-red-500"
                @click="removeTag(tag)"
              >
                <Lucide icon="X" class="w-3 h-3" />
              </button>
            </span>
          </div>
          <div class="flex gap-2 mt-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Nova tag"
              class="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
            />
            <button
              class="px-3 py-2 bg-purple-600 rounded hover:bg-purple-500"
              @click="addTag"
            >
              Adicionar
            </button>
          </div>
        </div>

        <!-- Membros -->
        <div class="mb-4">
          <span class="text-sm text-gray-300">Membros</span>

          <!-- lista -->
          <ul class="mt-2 flex flex-col gap-2">
            <li
              v-for="(member, index) in form.members"
              :key="index"
              class="flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
            >
              <span class="text-gray-200">{{ member }}</span>
              <button
                class="text-red-300 hover:text-red-500"
                @click="removeMember(member)"
              >
                <Lucide icon="X" class="w-4 h-4" />
              </button>
            </li>
          </ul>

          <!-- adicionar -->
          <div class="flex gap-2 mt-3">
            <Selectmembers
              v-model="newMember"
              :options="usersWithoutHouse"
              placeholder="Adicionar membro"
              @select="addMember"
              class="flex-1"
            />
          </div>

        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
            @click="saveChanges"
          >
            Salvar
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="mt-6 border-t border-red-600 pt-4">
          <h3 class="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>

          <button
            @click="openDeleteModal"
            class="w-full px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-500"
          >
            Excluir Casa
          </button>
        </div>

        <!-- Modal de Confirmação -->
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        >
          <div class="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-lg font-semibold text-red-400 mb-3">
              Tem certeza que deseja excluir a casa?
            </h2>
            <p class="text-sm text-gray-400 mb-4">
              Essa ação é irreversível e vai apagar todas as informações dessa casa.
            </p>
            <div class="flex justify-end gap-3">
              <button
                class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                @click="showDeleteConfirm = false"
              >
                Cancelar
              </button>
              <button
                class="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                @click="confirmDelete"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
