<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { ResetPassword } from "@/API/UserApi"
import { toast } from "@/base/utils/toast"

const props = defineProps<{
  userToReset: string
}>()

const router = useRouter()

const resetCode = ref("")
const newPassword = ref("")
const loading = ref(false)
const error = ref("")

const submitReset = async () => {
  if (!props.userToReset || !resetCode.value || !newPassword.value) {
    error.value = "Preencha usuário, código e nova senha!"
    return
  }

  try {
    error.value = ""
    loading.value = true

    const response = await ResetPassword(
      props.userToReset.trim(),
      resetCode.value.trim(),
      newPassword.value.trim()
    )

    if(response.message === "Senha redefinida com sucesso!") {
      toast.success("Senha redefinida com sucesso!")
      router.push('/login')
    } else {
      toast.warning(response.message || "Erro ao redefinir senha!")
    }
    
  } catch (err: any) {
    error.value = err.message || "Erro ao redefinir senha!"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
    <div
      class="bg-[rgb(0,0,0,0.3)] p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 text-white"
    >
      <h3 class="text-2xl font-bold text-center text-fuchsia-400 mb-4">
        Redefinir Senha
      </h3>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <input
        v-model="resetCode"
        type="text"
        placeholder="Código de confirmação"
        class="w-full pl-3 pr-3 py-2 bg-transparent border border-fuchsia-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-white"
      />

      <input
        v-model="newPassword"
        type="password"
        placeholder="Nova senha"
        class="w-full pl-3 pr-3 py-2 bg-transparent border border-fuchsia-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-white"
      />

      <div class="flex justify-between mt-4 gap-2">
        <button
          :disabled="loading"
          class="flex-1 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition duration-200"
          @click="submitReset"
        >
          {{ loading ? "Processando..." : "Confirmar" }}
        </button>

        <button
          class="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition duration-200"
          @click="$emit('close')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
