<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { ResetPassword } from "@/API/UserApi"
import { toast } from "@/base/utils/toast"
import Lucide from "@/base/lucide/Lucide.vue";

const props = defineProps<{
  userToReset: string
}>()

const router = useRouter()

const resetCode = ref("")
const newPassword = ref("")
const loading = ref(false)
const error = ref("")
const showPassword = ref(false);
const confirmPassword = ref("");
const showConfirmPassword = ref(false);

const submitReset = async () => {
  if (!props.userToReset || !resetCode.value || !newPassword.value || !confirmPassword.value ) {
    error.value = "Preencha usuário, código, nova senha e confirmação!"
    return
  }

  try {
    error.value = ""
    loading.value = true

    if (newPassword.value !== confirmPassword.value) {
      error.value = "As senhas não coincidem!"
      return
    }

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
  <div class="min-h-screen flex items-center justify-center bg-[rgb(0,0,0,0.7)] w-full">
    <form
      class="bg-[rgb(0,0,0,0.3)] p-8 rounded-2xl shadow-xl w-full space-y-5 text-white"
    >
      <h3 class="text-2xl font-bold text-center text-fuchsia-400 mb-4">
        Redefinir Senha
      </h3>

      <div v-if="error" class="text-red-500 text-sm text-center mx-auto">
        {{ error }}
      </div>

      <div
        class="relative max-w-80 mx-auto"
      >
        <input
          v-model="resetCode"
          type="text"
          placeholder="Código de confirmação"
          class="w-full pl-3 pr-3 py-2 bg-transparent border border-fuchsia-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-white"
        />
      </div>
      <!-- New password input field JcBushido-->
      <div
        class="relative flex items-center w-full max-w-80 mx-auto"
      >
        <input
          v-model="newPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nova senha"
          class="w-full pl-3 pr-3 py-2 bg-transparent border border-fuchsia-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-white"
        />
        <Lucide
          :icon="showPassword ? 'EyeOff' : 'Eye'"
          class="w-5 h-5 absolute right-0 cursor-pointer mr-3 text-purple-400"
          @click="showPassword = !showPassword"
        />
      </div>
      <div
        class="relative flex items-center w-full max-w-80 mx-auto"
      >
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirmPassword"
          class="w-full bg-black/40 border border-purple-400 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Confirme a nova senha"
        />
        <Lucide
          :icon="showConfirmPassword ? 'EyeOff' : 'Eye'"
          class="w-5 h-5 absolute right-0 cursor-pointer mr-3 text-purple-400"
          @click="showConfirmPassword = !showConfirmPassword"
        />
      </div>

      <div class="flex justify-between mt-4 gap-2 max-w-80 mx-auto">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition duration-200"
          @click.prevent="submitReset"
        >
          {{ loading ? "Processando..." : "Confirmar" }}
        </button>

        <button
          type="button"
          class="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition duration-200"
          @click="$emit('close')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
