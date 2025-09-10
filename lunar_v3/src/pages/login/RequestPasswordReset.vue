<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "@/base/utils/toast"
import { RequestPasswordReset } from "@/API/UserApi"
import ResetPasswordModal from "./ResetPasswordModal.vue"

const router = useRouter()
const username = ref("")
const loading = ref(false)
const error = ref("")
const nextStep = ref(false)

const requestCode = async () => {
  if (!username.value) {
    error.value = "Informe o usuário!"
    return
  }

  try {
    loading.value = true
    error.value = ""

    const response = await RequestPasswordReset(username.value.trim())
    
    if (response.status === 200) {
      toast.success("Código enviado para seu WhatsApp!")
      nextStep.value = true      
    } else {
      toast.warning(response.data.message || "Erro ao enviar código!")
    }
  } catch (err: any) {
    error.value = err.message || "Erro ao solicitar código!"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div 
    v-if="!nextStep"
    class="min-h-screen flex items-center justify-center bg-[rgb(0,0,0,0.7)]"
  >
    <form
      class="bg-[rgb(0,0,0,0.3)] p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 text-white"
    >
      <h3 class="text-2xl font-bold text-center text-fuchsia-400 mb-4">
        Solicitar Código
      </h3>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <input
        v-model="username"
        type="text"
        placeholder="Usuário"
        class="w-full pl-3 pr-3 py-2 bg-transparent border border-fuchsia-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-white"
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition duration-200"
        @click="requestCode"
      >
        {{ loading ? "Enviando..." : "Solicitar código de redefinição" }}
      </button>

      <button
        type="button"
        class="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition duration-200"
        @click="$emit('close')"
      >
        Voltar ao Login
      </button>
    </form>
  </div>
  <ResetPasswordModal 
    v-else
    @close="$emit('close')"
    :userToReset="username"
  />
</template>
